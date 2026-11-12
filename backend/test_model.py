import numpy as np
import pytest
from PIL import Image
from backend.providers import CLASSES, MANIFEST, ResearchProvider, map_output, preprocess, ModelBusy, ModelUnavailable


def test_output_mapping_all_five_classes_and_shape_rejection():
    for grade, label in enumerate(CLASSES):
        output = np.zeros((1, 5), dtype=np.float32)
        output[0, grade] = 1
        assert CLASSES[map_output(output)] == label
    for invalid in [np.zeros((1, 4)), np.full((1, 5), np.nan), np.zeros((1, 5)), np.full((1, 5), -1)]:
        with pytest.raises(ValueError):
            map_output(invalid)


def test_preprocessing_is_raw_rgb_not_double_normalized():
    image = Image.new('RGB', (300, 400), (255, 128, 0))
    array = preprocess(image)
    assert array.shape == (1, 224, 224, 3)
    assert array.dtype == np.float32
    assert array[0, 0, 0].tolist() == [255, 128, 0]


def test_missing_weights_fail_without_fake_predictions(tmp_path, monkeypatch):
    monkeypatch.setenv('BASEERA_MODEL_PATH', str(tmp_path / 'absent.keras'))
    provider = ResearchProvider('aldahmashi-efficientnetb0')
    provider.state = 'loading'
    provider._load()
    assert provider.status()['state'] == 'failed'
    with pytest.raises(ModelUnavailable):
        provider.predict(Image.new('RGB', (224, 224)))


def test_concurrency_and_rate_limits_never_substitute_output():
    provider = ResearchProvider('aldahmashi-efficientnetb0')
    provider.state, provider.model = 'ready', object()
    provider._slot.acquire()
    with pytest.raises(ModelBusy):
        provider.predict(Image.new('RGB', (224, 224)))
    provider._slot.release()
    import time
    provider._recent.extend([time.monotonic()] * provider._limit)
    with pytest.raises(ModelBusy):
        provider.predict(Image.new('RGB', (224, 224)))


def test_pinned_model_manifest():
    assert MANIFEST['revision'] == 'fb8d14c59bd56aa17fe0dfdea04a83ecd2f2eeac'
    assert len(CLASSES) == 5
