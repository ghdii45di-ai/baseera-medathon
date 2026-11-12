FROM node:24.15.0-bookworm-slim AS frontend
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM python:3.13.14-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 CUDA_VISIBLE_DEVICES=-1 KERAS_BACKEND=tensorflow \
    TF_CPP_MIN_LOG_LEVEL=2 TF_ENABLE_ONEDNN_OPTS=0 TF_DETERMINISTIC_OPS=1 \
    BASEERA_MODE=simulation BASEERA_MODEL_PROVIDER=unavailable \
    BASEERA_MODEL_PATH=/app/weights/final_model.keras BASEERA_DOWNLOAD_MODEL=false \
    BASEERA_SERVE_FRONTEND=true BASEERA_FRONTEND_DIR=/app/dist \
    BASEERA_CPU_THREADS=2 BASEERA_INFERENCE_PER_MINUTE=10 PORT=7860
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -u 1000 appuser
WORKDIR /app
COPY backend/requirements.txt backend/requirements-model.txt backend/requirements-linux.lock ./backend/
RUN pip install -r backend/requirements.txt
COPY backend ./backend
COPY --from=frontend /build/dist ./dist
COPY docs/model-card.md docs/model-license.md ./docs/
RUN mkdir -p /app/weights && chown -R appuser:appuser /app
USER appuser
EXPOSE 7860
HEALTHCHECK --interval=30s --timeout=5s --start-period=180s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:'+__import__('os').getenv('PORT','7860')+'/api/health',timeout=4)"
CMD ["python", "-m", "backend.serve"]
