"""Pinned local Keras provider. No remote code, arbitrary model URL, or fake fallback."""
from collections import deque
from datetime import datetime, timezone
from functools import lru_cache
import hashlib
import json
import logging
import os
from pathlib import Path
import threading
import time
import urllib.request
import zipfile

import numpy as np
from PIL import Image

MANIFEST = json.loads(Path(__file__).with_name('model_manifest.json').read_text())
CLASSES = MANIFEST['classes']
LOGGER = logging.getLogger('baseera.model')


class ModelUnavailable(Exception):
    def __init__(self, code='model_unavailable'):
        self.code = code


class ModelBusy(Exception):
    pass


def map_output(output) -> int:
    values = np.asarray(output, dtype=np.float32)
    if values.shape != (1, 5) or not np.isfinite(values).all():
        raise ValueError('Unexpected model output')
    if (values < 0).any() or (values > 1).any() or not np.isclose(values.sum(), 1, atol=1e-3):
        raise ValueError('Expected five-class softmax')
    return int(values[0].argmax())


def preprocess(image: Image.Image) -> np.ndarray:
    # Matches the author's PIL RGB resize example. Do NOT externally normalize.
    return np.asarray(image.convert('RGB').resize((224, 224), Image.Resampling.BICUBIC), dtype=np.float32)[None, ...]


def verify_archive(path: Path):
    if path.stat().st_size != MANIFEST['size_bytes']:
        raise ValueError('Weight size mismatch')
    with path.open('rb') as source:
        if hashlib.file_digest(source, 'sha256').hexdigest() != MANIFEST['sha256']:
            raise ValueError('Weight checksum mismatch')
    allowed = {'InputLayer', 'Functional', 'Rescaling', 'Normalization', 'DTypePolicy',
               'Conv2D', 'DepthwiseConv2D', 'BatchNormalization', 'Activation', 'ZeroPadding2D',
               'GlobalAveragePooling2D', 'Reshape', 'Multiply', 'Add', 'Dropout', 'Dense',
               'GlorotUniform', 'Zeros', 'Ones', 'VarianceScaling', 'Adam', '__keras_tensor__'}
    with zipfile.ZipFile(path) as archive:
        if set(archive.namelist()) != {'metadata.json', 'config.json', 'model.weights.h5'}:
            raise ValueError('Unexpected archive content')
        config = json.loads(archive.read('config.json'))
    def inspect(value):
        if isinstance(value, dict):
            if 'class_name' in value and value['class_name'] not in allowed:
                raise ValueError('Unreviewed serialized class')
            for item in value.values():
                inspect(item)
        elif isinstance(value, list):
            for item in value:
                inspect(item)
    inspect(config)


def download_weights(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    url = f"https://huggingface.co/{MANIFEST['repo_id']}/resolve/{MANIFEST['revision']}/{MANIFEST['filename']}"
    temporary = path.with_suffix('.download')
    try:
        with urllib.request.urlopen(url, timeout=60) as response, temporary.open('wb') as target:
            count = 0
            while block := response.read(1024 * 1024):
                count += len(block)
                if count > MANIFEST['size_bytes']:
                    raise ValueError('Download exceeds pinned size')
                target.write(block)
        verify_archive(temporary)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)


class ResearchProvider:
    def __init__(self, configured: str):
        self.configured = configured
        self.state = 'unavailable'
        self.reason = 'not_configured' if configured == 'unavailable' else 'unsupported_provider'
        self.model = None
        self.load_seconds = None
        self._start_lock = threading.Lock()
        self._slot = threading.Lock()
        self._recent = deque()
        self._limit = max(1, int(os.getenv('BASEERA_INFERENCE_PER_MINUTE', '10')))
        self.path = Path(os.getenv('BASEERA_MODEL_PATH', 'weights/aldahmashi/final_model.keras'))

    def start(self):
        with self._start_lock:
            if self.configured != 'aldahmashi-efficientnetb0' or self.state != 'unavailable':
                return
            self.state, self.reason = 'loading', 'model_loading'
            threading.Thread(target=self._load, name='baseera-model-loader', daemon=True).start()

    def _load(self):
        start = time.perf_counter()
        try:
            if not self.path.exists() and os.getenv('BASEERA_DOWNLOAD_MODEL', 'false').lower() == 'true':
                download_weights(self.path)
            verify_archive(self.path)
            os.environ.setdefault('CUDA_VISIBLE_DEVICES', '-1')
            os.environ.setdefault('TF_DETERMINISTIC_OPS', '1')
            os.environ.setdefault('TF_ENABLE_ONEDNN_OPTS', '0')
            os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2')
            os.environ.setdefault('KERAS_BACKEND', 'tensorflow')
            import tensorflow as tf
            import keras
            tf.config.threading.set_intra_op_parallelism_threads(int(os.getenv('BASEERA_CPU_THREADS', '2')))
            tf.config.threading.set_inter_op_parallelism_threads(1)
            tf.keras.utils.set_random_seed(2026)
            model = keras.saving.load_model(self.path, compile=False, safe_mode=True)
            if model.input_shape != (None, 224, 224, 3) or model.output_shape != (None, 5):
                raise ValueError('Architecture shape mismatch')
            # Execution smoke test only: not retinal validation or evaluation.
            map_output(model(np.full((1, 224, 224, 3), 128, dtype=np.float32), training=False).numpy())
            self.model = model
            self.load_seconds = round(time.perf_counter() - start, 3)
            self.state, self.reason = 'ready', None
            LOGGER.info('Pinned research model loaded and execution-tested')
        except Exception:
            self.state, self.reason = 'failed', 'model_load_failed'
            LOGGER.exception('Research model startup failed; technical checks remain available')

    def status(self) -> dict:
        selected = self.configured == 'aldahmashi-efficientnetb0'
        return {'ready': self.state == 'ready', 'state': self.state,
                'mode': 'live_research_inference' if self.state == 'ready' else 'model_unavailable',
                'reason': self.reason, 'name': MANIFEST['repo_id'] if selected else None,
                'version': MANIFEST['revision'] if selected else None,
                'task': MANIFEST['task'] if selected else None,
                'classes': CLASSES if selected else [], 'load_seconds': self.load_seconds,
                'retina_detector': False, 'clinically_validated': False}

    def predict(self, image: Image.Image) -> dict:
        if self.state != 'ready' or self.model is None:
            raise ModelUnavailable('model_loading' if self.state == 'loading' else 'model_unavailable')
        if not self._slot.acquire(blocking=False):
            raise ModelBusy()
        try:
            now = time.monotonic()
            while self._recent and self._recent[0] < now - 60:
                self._recent.popleft()
            if len(self._recent) >= self._limit:
                raise ModelBusy()
            self._recent.append(now)
            start = time.perf_counter()
            grade = map_output(self.model(preprocess(image), training=False).numpy())
            # Deliberately omit uncalibrated softmax probabilities from the API/UI.
            return {'kind': 'research_model_prediction', 'grade': grade, 'class_name': CLASSES[grade],
                    'model_name': MANIFEST['repo_id'], 'model_version': MANIFEST['revision'],
                    'task': MANIFEST['task'], 'analysis_at': datetime.now(timezone.utc).isoformat(),
                    'inference_ms': round((time.perf_counter() - start) * 1000, 2),
                    'input_sha256': hashlib.sha256(image.tobytes()).hexdigest(),
                    'calibrated': False, 'clinically_validated': False}
        finally:
            self._slot.release()


@lru_cache(maxsize=4)
def provider_for(configured: str):
    return ResearchProvider(configured)


def get_provider() -> ResearchProvider:
    return provider_for(os.getenv('BASEERA_MODEL_PROVIDER', 'unavailable'))
