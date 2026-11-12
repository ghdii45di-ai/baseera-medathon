import os
from pathlib import Path
import subprocess
import sys


def test_single_origin_spa_and_api_errors_are_distinct():
    assert Path('dist/index.html').is_file(), 'Run npm run build before production serving checks'
    script = '''
from fastapi.testclient import TestClient
from backend.main import app
with TestClient(app) as c:
    for path in ['/', '/app/start', '/app/cases/DEMO-001', '/device-demo', '/research']:
        r=c.get(path)
        assert r.status_code==200 and '<div id="root">' in r.text, path
    assert c.get('/api/not-an-endpoint').status_code==404
    assert c.get('/api/not-an-endpoint').headers['content-type'].startswith('application/json')
    assert c.get('/missing.js').status_code==404
    assert c.get('/assets/missing.js').status_code==404
    assert c.get('/api/health').json()['ok'] is True
    assert c.get('/api/ready').status_code==503
    assert c.get('/assets/baseera-glasses-concept-v1.png').headers['content-type']=='image/png'
'''
    env = {**os.environ, 'BASEERA_SERVE_FRONTEND': 'true', 'BASEERA_MODEL_PROVIDER': 'unavailable'}
    result = subprocess.run([sys.executable, '-c', script], env=env, capture_output=True, text=True, timeout=30)
    assert result.returncode == 0, result.stderr
