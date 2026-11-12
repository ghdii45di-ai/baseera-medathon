> Historical pre-simulation research snapshot. Do not use its publication instructions for the public demo; see README.md and public-deployment.md for current configuration.

# Baseera | MEDATHON 2026

Interactive digital research prototype for a proposed retinal screening solution. React + TypeScript + Vite frontend, Python FastAPI backend. English by default, full Arabic and RTL support. No account required.

**Research use only.** The glasses are conceptual, unmanufactured, and unvalidated. A pinned research model runs on CPU. In a five-photo real retinal check it returned class 0 for every image, including both HRF diabetic-retinopathy images; it can miss disease and is not suitable for clinical screening. The application never substitutes simulated predictions. Use fictional case identifiers and de-identified research images with permission; do not upload personal health information.

## Run locally (PowerShell)

Prerequisites: Node.js 22.12+ (tested with 24.15), Python 3.13 (tested with 3.13.14; TensorFlow 2.21 CPU in isolated `.venv-model`), npm, and Chrome for browser tests.

```powershell
npm ci
python -m venv .venv-model
.\.venv-model\Scripts\python -m pip install -r backend/requirements-model.txt
Copy-Item .env.example .env
```

Terminal 1:

```powershell
$env:BASEERA_MODEL_PROVIDER='aldahmashi-efficientnetb0'
$env:BASEERA_MODEL_PATH='weights/aldahmashi/final_model.keras'
# Use existing verified weights; set BASEERA_DOWNLOAD_MODEL=true only if acquisition is needed.
.\.venv-model\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8010
```

Terminal 2:

```powershell
npm run dev -- --port 5173 --strictPort
```

Open **http://127.0.0.1:5173/**. The Vite proxy forwards `/api` to `127.0.0.1:8010`. Port 8010 avoids an existing unrelated service on 8000. API documentation: http://127.0.0.1:8010/docs. Health/model readiness: `/api/health`.

macOS/Linux: replace `.venv-model\Scripts\python` with `.venv-model/bin/python`. If using different origins, set `BASEERA_CORS_ORIGINS` in the backend process environment. `.env` supplies Vite variables; FastAPI reads process environment, not `.env`. `BASEERA_MODEL_PROVIDER=aldahmashi-efficientnetb0` selects the pinned CPU provider; `unavailable` deliberately disables it. Wait for `/api/ready` to return 200 before inference. Unknown providers fail closed.

## What works

- Complete bilingual public site with explicit project positioning, operator/beneficiary roles, a full proposed screening journey, and an original generated three-quarter product render, editable anatomy/retinal SVGs, and clean subsystem exploration.
- One case-based journey: **Try the Platform** opens `/app/start`, creates one unique demo case/current date if there is no active case, and opens Image Source. Repeated entry resumes the active case. Dashboard **Start New Experience** deliberately starts one new case; existing rows resume their saved stage. Manual case creation is secondary. Only fictional metadata is allowed.
- Per-eye JPEG/PNG selection, preview, zoom, replacement and removal. **Check Image Properties** explicitly calls real server decoding and computes dimensions, brightness and basic sharpness. Local preview decoding is separate from server validation; a failed server request preserves the selected image for retry. Permission confirmation enables selection.
- Bilingual **Technical Image Review Reports** enabled after successful checks, including eye/source, actual measurements, timestamps, missing inputs and missing AI status. Empty cases cannot print a report. Optional research inference requires successful basic checks, a ready model and fundus/permission confirmation. It reports class, pinned model revision and timestamp, with an explicit warning about observed disease misses. Starting reassessment clears earlier output; failures persist in reports without a class. Connection status and retry are separate from image checking.
- Inside each case: **Image Source -> Capture / Upload -> Review & Checks -> Report**. Choose compact simulated capture (preparation, eye selection, alignment, capture animation, review handoff) or direct research image upload. Both converge within the same case and selected eye. The separate **Explore the Glasses** educational route `/device-demo` preserves subsystem exploration without creating a case. Reduced motion is respected; no webcam or retinal sample is used.

Case metadata, language preference, current stage, source choice, selected eye, simulation step/alignment, and successful per-eye technical measurements (with source/method/timestamp) persist in this browser's local storage. Image bytes, object URLs and filenames are not persisted. Existing `baseera-cases-v1` records are safely migrated and sanitized on read: old checked cases open at Review & Checks, and empty cases at Image Source. No existing case is replaced by a new one. Images remain available across in-app navigation, but must be reattached after refresh/closing. Saved measurements remain printable without the image. Selecting a new or reattached image invalidates the old measurements for that eye immediately; recheck to make that eye report-eligible again. Other eyes are unchanged. A partial report explicitly lists assessed and unassessed eyes. Removing an attached image also removes its saved measurements. A corrupt replacement preserves prior work. Storage failures are disclosed. Unsaved manual form edits and active image requests/capture animations trigger an in-app leave/stay dialog. Saved simulation progress resumes directly. Save & Exit saves supported metadata and warns that image bytes are session-only; in-app navigation retains images but refresh/closing loses them. Changing source paths or restarting simulation preserves existing images/measurements rather than silently discarding them. Browser unload protection is best effort for edits, pending requests and in-memory images; mobile/browser limitations mean it cannot guarantee protection. Print before leaving if needed. The API does not retain images or expose them via URLs. FastAPI/Starlette can spool larger multipart uploads to temporary files; the upload is closed after reading, and temporary storage is cleaned by the framework. Run locally, bound to loopback; this is not a production health-data service.

Accepted files: single-frame JPEG or PNG, at most 10 MiB, each side 128–8,000 pixels, at most 24 million pixels. Validation uses decoded content, not extension/MIME. Technical signals are descriptive, not validated gradability. There is no retina/out-of-domain detector.

## Verification

With both servers running:

```powershell
npm test
.\.venv-model\Scripts\python -m pytest backend -q
npm run test:e2e
npm run build
npm audit
```

Playwright uses installed Chrome in headless mode. It verifies one-case creation and repeat entry, both source paths, same-case simulation handoff, anatomical eye mapping, language switching, Previous and browser Back/Forward, resume after refresh, real technical checks, partial-report eligibility, per-eye replacement invalidation, source switching/restart preservation, Save & Exit, backend failure/retry, corrupt/oversized selection, legacy migration and missing-case routes. Generated solid-color PNGs test software execution only; they are not evidence of medical accuracy. See docs/retinal-results.json for the separate five-photo real retinal check. Class mapping/preprocessing and malformed model-output tests are implemented. Two additional bilingual browser tests use a real permitted CC0 fundus photograph and exercise genuine predictions plus injected failures. Desktop Arabic report screenshots were inspected; browser PDFs were generated, but full print-pagination acceptance remains pending.

To preview the production build with the same API proxy:

```powershell
npm run build
npm run preview -- --port 5173
```

Do not run development and production preview on the same port simultaneously. No deployment, push, or visibility changes were performed.

## Research and next actions

See [data provenance](docs/data-provenance.md), [model card](docs/model-card.md), [evaluation](docs/evaluation.md), [prototype status](docs/prototype-status.md), and [demonstration walkthrough](docs/demo-walkthrough.md), [proposed device architecture](docs/device-architecture.md), and [visual provenance](docs/visual-provenance.md).

The current scope and remaining public-demo steps are in [prototype status](docs/prototype-status.md) and [deployment readiness](docs/public-deployment.md). Dockerfile inputs are complete, but an actual container build/run could not be verified because Docker/Podman and WSL are unavailable here. No public demo link exists yet. License-notice/data-lineage review and a decision about the observed disease misses remain publication blockers.

Reproduce the permitted real-image check (images stay ignored and outside public assets):

```powershell
.\.venv-model\Scripts\python -m backend.retinal_smoke --acquire --base http://127.0.0.1:8010
```

Run the browser suite against the built frontend served by FastAPI after starting that backend with `BASEERA_SERVE_FRONTEND=true`:

```powershell
npm run build
$env:BASEERA_TEST_BASE_URL='http://127.0.0.1:8010'
npm run test:e2e -- --workers=1
```

For isolated testing use `BASEERA_INFERENCE_PER_MINUTE=100`; the production default is ten shared attempts/minute. Image acquisition requires network access. Without the documented local fixture the real-image browser tests skip explicitly. Diraya and the additional interactive glasses prototype remain untouched.
