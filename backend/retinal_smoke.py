"""Reproduce the permitted five-image execution check, NOT an accuracy evaluation.

python -m backend.retinal_smoke --acquire --base http://127.0.0.1:8010
Images and archives stay in ignored data/. Requires the model-enabled server.
"""
import argparse
import hashlib
from io import BytesIO
import json
from pathlib import Path
import zipfile

import httpx
from PIL import Image


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--acquire', action='store_true')
    parser.add_argument('--base', default='http://127.0.0.1:8010')
    args = parser.parse_args()
    records = json.loads(Path('docs/retinal-inputs.json').read_text())
    archives = {}
    with httpx.Client(timeout=120, follow_redirects=True) as client:
        for record in records:
            path = Path(record['path'])
            if not path.exists() and args.acquire:
                path.parent.mkdir(parents=True, exist_ok=True)
                url = record['source_url']
                if 'source_member' in record:
                    if url not in archives:
                        response = client.get(url)
                        response.raise_for_status()
                        assert digest(response.content) == record['archive_sha256'], 'Archive changed'
                        archives[url] = response.content
                    with zipfile.ZipFile(BytesIO(archives[url])) as archive:
                        with Image.open(BytesIO(archive.read(record['source_member']))) as image:
                            image.convert('RGB').save(path, 'PNG')
                else:
                    response = client.get(url)
                    response.raise_for_status()
                    assert digest(response.content) == record['sha256'], 'Image changed'
                    path.write_bytes(response.content)
            assert path.exists(), 'Acquire permitted fixtures with --acquire first'
            assert digest(path.read_bytes()) == record['sha256'], f'Fixture changed: {path}'
        health = client.get(args.base + '/api/health')
        health.raise_for_status()
        assert health.json()['model']['ready'], 'Wait for the pinned research model to be ready'
        runs = []
        for record in records:
            path = Path(record['path'])
            files = {'file': (path.name, path.read_bytes(), 'image/png' if path.suffix == '.png' else 'image/jpeg')}
            checks = client.post(args.base + '/api/images/check', files=files)
            checks.raise_for_status()
            predictions = []
            for _ in range(2):
                result = client.post(args.base + '/api/analyze', files=files)
                result.raise_for_status()
                predictions.append(result.json())
            runs.append({**record, 'checks': checks.json(), 'predictions': predictions,
                         'repeat_class_equal': predictions[0]['grade'] == predictions[1]['grade']})
            print(record['id'], record['source_group'], predictions[0]['grade'], predictions[0]['class_name'])
        from datetime import datetime, timedelta, timezone
        report = {'test_type': 'real_retinal_execution_case_series_not_accuracy_evaluation',
                  'date': datetime.now(timezone(timedelta(hours=3))).date().isoformat(),
                  'model': health.json()['model'], 'runs': runs,
                  'limitations': ['Five selected photographs, not a random or held-out cohort.',
                                  'HRF source groups are not five-class DR severity grades.',
                                  'Expert five-class labels and training-overlap checks are absent.',
                                  'No accuracy, sensitivity, specificity or clinical validation established.',
                                  'Basic measurements do not validate retinal gradability.']}
        Path('docs/retinal-results.json').write_text(json.dumps(report, indent=2), encoding='utf-8')


if __name__ == '__main__':
    main()
