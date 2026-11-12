> Historical pre-simulation research snapshot. Do not use its publication instructions for the public demo; see README.md and public-deployment.md for current configuration.

# Public demo readiness — 2026-11-13

No push, deployment, paid resource, visibility change or public URL was created. Diraya was untouched.

The production frontend builds locally. FastAPI serves the built SPA and API from one origin with one model-owning worker. Local production routes and real CPU inference were tested; all 12 browser tests passed against this built single-origin application. Dockerfile source inputs are present, including the formerly missing model-license document. The Linux dependency lock was previously resolved with compatible wheels in `tmp/linux-wheel-check`; that is not a container build.

**Actual container build/run is blocked:** Docker and Podman are absent and WSL is not installed on this machine. Do not describe this container as verified. On a Docker-capable machine, run:

```sh
docker build --progress=plain -t baseera-research .
docker run --rm -p 127.0.0.1:7860:7860 baseera-research
curl -f http://127.0.0.1:7860/api/health
curl -f http://127.0.0.1:7860/api/ready
BASEERA_TEST_BASE_URL=http://127.0.0.1:7860 npm run test:e2e -- --workers=1
python -m backend.retinal_smoke --acquire --base http://127.0.0.1:7860
```

Health is server liveness; `/api/ready` returns 503 until the research model loads, and on model-load failure. Startup requires outbound access to the pinned Hugging Face artifact, about 33.4 MB, unless the verified checkpoint is supplied at `BASEERA_MODEL_PATH`. Cold-start/network/memory behavior must be measured inside the actual target container. Default shared rate limit is ten attempts/minute; serialize demo users or handle HTTP 429. Test reruns may need a minute between batches. Set `BASEERA_INFERENCE_PER_MINUTE=100` only for isolated test runs.

Before any public demo:

1. Resolve upstream full license notice and training-data permission questions; retain attribution.
2. Decide whether the observed misses make prediction suitable even for a public research demonstration. Both HRF DR-group images were class 0. Retain the bilingual warning and no-reassurance language. Clinical screening is not supported.
3. Build/run the container and verify startup, readiness, memory limits, failure handling, uploads, reports and mobile RTL under HTTPS on the intended host.
4. Review request-only handling, multipart temporary storage, hosting request logs, abuse controls, privacy notice and the prohibition on personal health information. No authentication or production health-data safeguards are implemented.
5. With separate authorization, select an appropriate host (the supplied Docker Space metadata is only preparation), confirm its resource/cost settings and publish. Verify the resulting public URL and cold start. No hosting account or resources have been created here.

Real images stay in ignored `data/`, outside the public assets and Docker context. The glasses/capture interaction is simulated and produces no photograph. Additional interactive glasses work remains deferred. Independent severity-labeled evaluation, patient/duplicate overlap checks, retinal gradability and out-of-domain validation remain outstanding.
