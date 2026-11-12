"""Reproducible synthetic execution benchmark. NOT a retinal test or evaluation."""
import json
import os
from pathlib import Path
import statistics
import threading
import time

import psutil
from PIL import Image

os.environ['BASEERA_MODE'] = 'research'
os.environ['BASEERA_MODEL_PROVIDER'] = 'aldahmashi-efficientnetb0'
os.environ['BASEERA_INFERENCE_PER_MINUTE'] = '100'
from .providers import get_provider, MANIFEST


def main():
    process = psutil.Process()
    samples = [process.memory_info().rss]
    done = threading.Event()
    def sample():
        while not done.wait(.02):
            samples.append(process.memory_info().rss)
    monitor = threading.Thread(target=sample, daemon=True)
    monitor.start()
    provider = get_provider()
    provider.start()
    deadline = time.monotonic() + 180
    while provider.status()['state'] == 'loading' and time.monotonic() < deadline:
        time.sleep(.1)
    if not provider.status()['ready']:
        raise RuntimeError(provider.status())
    outputs, latencies = [], []
    for value in [0, 128, 255]:
        with Image.new('RGB', (256, 256), (value,) * 3) as image:
            pair = [provider.predict(image), provider.predict(image)]
        assert pair[0]['grade'] == pair[1]['grade']
        outputs.append({'synthetic_constant_rgb': value, 'predicted_grade': pair[0]['grade'],
                        'class_name': pair[0]['class_name'], 'repeat_equal': True})
        latencies.extend(p['inference_ms'] for p in pair)
    backbone = provider.model.layers[1]
    normalization = next(layer for layer in backbone.layers if layer.__class__.__name__ == 'Normalization')
    report = {'test_type': 'synthetic_execution_smoke_only', 'retinal_images_tested': 0,
              'labeled_evaluation_count': 0, 'model': MANIFEST, 'load_seconds': provider.load_seconds,
              'parameters': provider.model.count_params(), 'runs': outputs,
              'warm_inference_ms': latencies, 'median_warm_ms': statistics.median(latencies),
              'rss_after_mb': round(process.memory_info().rss / 1024**2, 2),
              'sampled_peak_rss_mb': round(max(samples) / 1024**2, 2),
              'normalization_weights': [weight.tolist() for weight in normalization.get_weights()],
              'runtime': {'python': __import__('platform').python_version(), 'platform': __import__('platform').platform()},
              'limitations': 'Generated constant RGB images verify execution only. No medical accuracy or retinal-image workflow is established.'}
    done.set()
    destination = Path('docs/smoke-results.json')
    destination.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({key: value for key, value in report.items() if key not in ('model', 'normalization_weights')}, indent=2))


if __name__ == '__main__':
    main()
