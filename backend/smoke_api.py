"""Synthetic HTTP smoke test; never a retinal or accuracy evaluation."""
import argparse
from io import BytesIO
import json
from pathlib import Path
import httpx
from PIL import Image


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:8011')
    parser.add_argument('--pid', type=int)
    args = parser.parse_args()
    data = BytesIO()
    Image.new('RGB', (256, 256), (128, 128, 128)).save(data, 'PNG')
    with httpx.Client(base_url=args.base, timeout=60) as client:
        health = client.get('/api/health').json()
        assert health['model']['ready']
        checks = client.post('/api/images/check', files={'file': ('synthetic-gray.png', data.getvalue(), 'image/png')})
        checks.raise_for_status()
        predictions = []
        for _ in range(2):
            response = client.post('/api/analyze', files={'file': ('synthetic-gray.png', data.getvalue(), 'image/png')})
            response.raise_for_status()
            predictions.append(response.json())
        assert predictions[0]['grade'] == predictions[1]['grade']
        assert predictions[0]['input_sha256'] == predictions[1]['input_sha256']
        for output in predictions:
            assert 'confidence' not in output
        paths = {path: client.get(path).status_code for path in ['/', '/app/cases/DEMO-001', '/research', '/api/missing', '/assets/missing.js']}
    report = {'test_type': 'synthetic_http_execution_only', 'retinal_images': 0,
              'input': 'Generated 256x256 constant RGB (128,128,128) PNG',
              'checks': checks.json(), 'predictions': predictions, 'health': health,
              'repeat_class_equal': True, 'production_route_statuses': paths}
    if args.pid:
        import psutil
        memory = psutil.Process(args.pid).memory_info()
        report['server_rss_mb'] = round(memory.rss / 1024**2, 2)
        report['server_peak_working_set_mb'] = round(getattr(memory, 'peak_wset', memory.rss) / 1024**2, 2)
    Path('docs/api-smoke-results.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
