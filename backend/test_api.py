from io import BytesIO
import numpy as np
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from backend.main import app, technical_checks, MAX_BYTES

@pytest.fixture(autouse=True)
def local_research_mode(monkeypatch):
    monkeypatch.setenv('BASEERA_MODE', 'research')


client = TestClient(app)


def raster(fmt='PNG', size=(256, 256), color=(90, 90, 90)):
    out = BytesIO()
    Image.new('RGB', size, color).save(out, format=fmt)
    return out.getvalue()


@pytest.mark.parametrize('fmt', ['JPEG', 'PNG'])
def test_real_decode_ignores_extension_and_mime(fmt):
    response = client.post('/api/images/check', files={'file': ('wrong.exe', raster(fmt), 'text/plain')})
    assert response.status_code == 200
    data = response.json()
    assert (data['width'], data['height']) == (256, 256)
    assert abs(data['brightness'] - 90) < 1
    assert data['sharpness'] == 0


@pytest.mark.parametrize('data,code,status', [
    (b'not an image', 'corrupt', 422),
    (raster('GIF'), 'unsupported', 415),
    (raster(size=(64, 256)), 'dimensions', 422),
    (raster(size=(8001, 128)), 'dimensions', 422),
    (b'x' * (MAX_BYTES + 1), 'too_large', 413),
], ids=['corrupt', 'gif', 'too-small', 'too-wide', 'oversized'])
def test_input_rejection(data, code, status):
    response = client.post('/api/images/check', files={'file': ('retina.png', data, 'image/png')})
    assert response.status_code == status
    assert response.json()['detail']['code'] == code


def test_sharpness_is_real_signal_not_gradability():
    array = np.indices((256, 256)).sum(axis=0) % 2 * 255
    image = Image.fromarray(array.astype('uint8'))
    checks = technical_checks(image)
    assert checks['sharpness'] > technical_checks(Image.new('RGB', (256, 256)))['sharpness']
    assert 'gradable' not in checks


def test_missing_model_fails_closed_even_if_unknown_provider(monkeypatch):
    monkeypatch.setenv('BASEERA_MODEL_PROVIDER', 'random-checkpoint')
    assert client.get('/api/health').json()['model']['ready'] is False
    response = client.post('/api/analyze', files={'file': ('input.png', raster(), 'image/png')})
    assert response.status_code == 503
    assert response.json() == {'detail': {'code': 'model_unavailable'}}


def test_analysis_validates_before_provider():
    response = client.post('/api/analyze', files={'file': ('input.png', b'bad', 'image/png')})
    assert response.status_code == 422


@pytest.mark.parametrize('failure,status,code', [
    ('exception', 500, 'analysis_failed'), ('busy', 429, 'model_busy'),
    ('loading', 503, 'model_loading'), ('malformed', 500, 'analysis_failed'),
])
def test_inference_failures_never_return_a_prediction(monkeypatch, failure, status, code):
    from backend.providers import ModelBusy, ModelUnavailable, ResearchProvider
    if failure == 'malformed':
        class InvalidModel:
            def __call__(self, *args, **kwargs):
                return type('Output', (), {'numpy': lambda self: np.zeros((1, 5))})()
        provider = ResearchProvider('aldahmashi-efficientnetb0')
        provider.state, provider.model = 'ready', InvalidModel()
    else:
        class BrokenProvider:
            def predict(self, image):
                if failure == 'busy':
                    raise ModelBusy()
                if failure == 'loading':
                    raise ModelUnavailable('model_loading')
                raise RuntimeError('sensitive internal details')
        provider = BrokenProvider()
    monkeypatch.setattr('backend.main.get_provider', lambda: provider)
    response = client.post('/api/analyze', files={'file': ('input.png', raster(), 'image/png')})
    assert response.status_code == status
    assert response.json() == {'detail': {'code': code}}
    if status == 429:
        assert response.headers['retry-after'] == '60'


def test_server_health_is_separate_from_model_readiness(monkeypatch):
    monkeypatch.setenv('BASEERA_MODEL_PROVIDER', 'unavailable')
    assert client.get('/api/health').status_code == 200
    assert client.get('/api/ready').status_code == 503
    assert client.get('/api/not-real').status_code == 404


def test_declared_and_streamed_whole_body_limits():
    from backend.limits import MAX_BODY
    response = client.post('/api/images/check', content=b'x', headers={'content-length': str(MAX_BODY + 1)})
    assert response.status_code == 413
    boundary = 'baseera'
    def body():
        yield f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="big.png"\r\nContent-Type: image/png\r\n\r\n'.encode()
        for _ in range(12):
            yield b'x' * (1024 * 1024)
        yield f'\r\n--{boundary}--\r\n'.encode()
    response = client.post('/api/images/check', content=body(), headers={'content-type': f'multipart/form-data; boundary={boundary}'})
    assert response.status_code == 413


def test_public_mode_never_calls_provider_even_when_configured(monkeypatch):
    monkeypatch.setenv('BASEERA_MODE', 'simulation')
    monkeypatch.setenv('BASEERA_MODEL_PROVIDER', 'aldahmashi-efficientnetb0')
    def forbidden():
        raise AssertionError('Public mode must not access the model')
    monkeypatch.setattr('backend.main.get_provider', forbidden)
    with TestClient(app) as public:
        assert public.get('/api/health').json()['model']['ready'] is False
        for endpoint in ['/api/analyze', '/api/images/check']:
            response = public.post(endpoint, files={'file': ('input.png', raster(), 'image/png')})
            assert response.status_code == 403
            assert response.json() == {'detail': {'code': 'public_demo_inference_disabled'}}
