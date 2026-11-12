from datetime import datetime, timezone
from contextlib import asynccontextmanager
from io import BytesIO
import os
from pathlib import Path
import warnings
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from starlette.concurrency import run_in_threadpool
from starlette.staticfiles import StaticFiles
from PIL import Image, ImageOps, UnidentifiedImageError
from .providers import get_provider, ModelUnavailable, ModelBusy
from .limits import UploadLimitMiddleware

def research_enabled():
    return os.getenv('BASEERA_MODE', 'simulation') == 'research'


def public_model_status():
    return {'ready': False, 'state': 'disabled', 'mode': 'simulation', 'reason': 'public_demo_inference_disabled', 'classes': []}


MAX_BYTES = 10 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 24_000_000
@asynccontextmanager
async def lifespan(app):
    if research_enabled():
        get_provider().start()
    yield


app = FastAPI(title='Baseera research API', version='0.2.0', lifespan=lifespan)
app.add_middleware(UploadLimitMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=os.getenv(
    'BASEERA_CORS_ORIGINS', 'http://127.0.0.1:5173,http://localhost:5173').split(','),
    allow_methods=['GET', 'POST'], allow_headers=['Content-Type'])


async def decode(upload: UploadFile) -> Image.Image:
    try:
        raw = await upload.read(MAX_BYTES + 1)
    finally:
        await upload.close()
    if len(raw) > MAX_BYTES:
        raise HTTPException(413, detail={'code': 'too_large'})
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('error', Image.DecompressionBombWarning)
            with Image.open(BytesIO(raw)) as check:
                if check.format not in ('JPEG', 'PNG') or getattr(check, 'n_frames', 1) != 1:
                    raise HTTPException(415, detail={'code': 'unsupported'})
                w, h = check.size
                if min(w, h) < 128 or max(w, h) > 8000 or w * h > 24_000_000:
                    raise HTTPException(422, detail={'code': 'dimensions'})
                check.verify()
            with Image.open(BytesIO(raw)) as source:
                source.load()
                return ImageOps.exif_transpose(source).convert('RGB')
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError,
            Image.DecompressionBombWarning):
        raise HTTPException(422, detail={'code': 'corrupt'})


def technical_checks(image: Image.Image) -> dict:
    gray = np.asarray(image.convert('L').resize((256, 256)), dtype=np.float32)
    lap = -4 * gray[1:-1, 1:-1] + gray[:-2, 1:-1] + gray[2:, 1:-1] + gray[1:-1, :-2] + gray[1:-1, 2:]
    return {'width': image.width, 'height': image.height,
            'brightness': round(float(gray.mean()), 2),
            'sharpness': round(float(lap.var()), 2),
            'method': 'grayscale_256_laplacian_variance_v1',
            'checked_at': datetime.now(timezone.utc).isoformat()}


@app.get('/api/health')
def health():
    return {'ok': True, 'model': get_provider().status() if research_enabled() else public_model_status(), 'retention': 'request_only'}


@app.post('/api/images/check')
async def check_image(file: UploadFile = File(...)):
    if not research_enabled():
        await file.close()
        raise HTTPException(403, detail={'code': 'public_demo_inference_disabled'})
    image = await decode(file)
    try:
        return await run_in_threadpool(technical_checks, image)
    finally:
        image.close()


@app.post('/api/analyze')
async def analyze(file: UploadFile = File(...)):
    if not research_enabled():
        await file.close()
        raise HTTPException(403, detail={'code': 'public_demo_inference_disabled'})
    image = await decode(file)
    try:
        try:
            return await run_in_threadpool(get_provider().predict, image)
        except ModelUnavailable as error:
            raise HTTPException(503, detail={'code': error.code})
        except ModelBusy:
            raise HTTPException(429, detail={'code': 'model_busy'}, headers={'Retry-After': '60'})
        except Exception:
            # Do not leak image bytes, filesystem paths or backend stack traces to clients.
            raise HTTPException(500, detail={'code': 'analysis_failed'})
    finally:
        image.close()


@app.get('/api/ready')
def ready():
    model = get_provider().status() if research_enabled() else public_model_status()
    return JSONResponse({'server_ok': True, 'model': model}, status_code=200 if model['ready'] else 503)


if os.getenv('BASEERA_SERVE_FRONTEND', 'false').lower() == 'true':
    frontend = Path(os.getenv('BASEERA_FRONTEND_DIR', 'dist')).resolve()
    if (frontend / 'assets').is_dir():
        app.mount('/assets', StaticFiles(directory=frontend / 'assets'), name='assets')

    @app.get('/{route:path}', include_in_schema=False)
    def spa(route: str):
        if route == 'api' or route.startswith('api/'):
            raise HTTPException(404, detail={'code': 'api_not_found'})
        candidate = (frontend / route).resolve()
        if candidate.is_relative_to(frontend) and candidate.is_file():
            return FileResponse(candidate)
        if Path(route).suffix:
            raise HTTPException(404)
        index = frontend / 'index.html'
        if not index.is_file():
            raise HTTPException(503, detail={'code': 'frontend_not_built'})
        return FileResponse(index, headers={'Cache-Control': 'no-cache'})
