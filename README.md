# Baseera | بصيرة — MEDATHON 2026

الموقع المنشور / Live demo: **https://baseera-five.vercel.app/**

النسخة العامة **محاكاة تفاعلية باللغتين العربية والإنجليزية**، تتضمن التقاطًا مُحاكى وسيناريوهات خيالية محددة مسبقًا. لا ترفع صورًا، ولا تفحصها، ولا تشغّل نموذجًا للاستدلال الطبي. توضح التقارير مصدر النتائج وحدودها. لا ندّعي دقة طبية أو تحققًا سريريًا. رفع الصور والفحوص التقنية مقتصران على البحث المحلي المنفصل.

The public site is a bilingual **interactive simulation**, with simulated capture and visitor-selected predefined fictional outcomes. It has no image upload, image assessment or model inference. It provides no diagnosis or medical advice. Initial development and validation are planned in clinics under specialist supervision, subject to necessary safety reviews and approvals. Home use is a future goal only after validation and applicable regulatory authorization.

## Install and run the public simulation

Requirements: Node.js 22.12+ (tested on Node 24), npm. Python is unnecessary for the public simulation.

```powershell
git clone https://github.com/ghdii45di-ai/baseera-medathon.git
cd baseera-medathon
npm ci
npm run dev -- --port 5173 --strictPort
```

Open http://127.0.0.1:5173. No account, image, model weights or external API is required. Simulation state uses its own browser-storage key and does not read or overwrite local research cases. `.env.example` is a sanitized reference; the public defaults work without creating any environment file.

Production build and local verification:

```powershell
npm test
npm run build
npm run preview -- --port 5175 --strictPort
# In another terminal:
$env:BASEERA_TEST_BASE_URL='http://127.0.0.1:5175'
npm run test:e2e
```

Playwright uses installed Google Chrome. The public tests check English/Arabic, all three scenarios, report export, refresh, mobile/desktop layouts, preserved research records, zero browser API requests and disabled inference. `dist/` is generated, not committed. Only static public files are deployed; weights, retinal photographs, research records and backend functions are not part of the site.

## Backend and separate local research

Python 3.13 is used for the FastAPI backend. Its default `BASEERA_MODE=simulation` does not load a model and rejects image-check and inference requests. This is independent of the frontend default.

To install/test the basic backend without TensorFlow:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r backend/requirements.txt
.\.venv\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8010
# Run after npm run build:
.\.venv\Scripts\python -m pytest backend -q
```

The experimental research UI/provider is preserved for **explicit local research only**, not clinical screening. It requires its own isolated environment and separately acquired, checksum-verified weights. The repository does not contain weights or evaluation photographs. See [model card](docs/model-card.md), [license evidence](docs/model-license.md) and [data provenance](docs/data-provenance.md) before acquiring research assets. Do not place credentials or personal health information in this project.

```powershell
python -m venv .venv-model
.\.venv-model\Scripts\python -m pip install -r backend/requirements-model.txt
$env:BASEERA_MODE='research'
$env:BASEERA_MODEL_PROVIDER='aldahmashi-efficientnetb0'
$env:BASEERA_MODEL_PATH='weights/aldahmashi/final_model.keras'
$env:BASEERA_DOWNLOAD_MODEL='false'
.\.venv-model\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8010
```

In a second terminal, explicitly opt into the separate frontend research mode:

```powershell
$env:VITE_BASEERA_MODE='research'
npm run dev:research -- --port 5176 --strictPort
```

Open http://127.0.0.1:5176 and wait for the model to be ready. The research Vite server proxies to loopback port 8010. The backend reads process environment, not Vite `.env` files. Real `.env*` files remain ignored; do not commit `.env.research` or `.env.local`. `npm run build:research -- --outDir dist-research` also requires `VITE_BASEERA_MODE=research` and produces a LOCAL research build that must not be published. `npm run test:e2e:research` retains the real-image/failure-path tests; it requires permitted local fixtures, a ready local model and a base URL for the research UI. Use a higher rate limit only for isolated tests; the normal shared default is ten attempts/minute.

macOS/Linux: replace `.venv\Scripts\python` with `.venv/bin/python` (likewise for `.venv-model`) and use your shell's `export NAME=value` syntax for environment variables.

## Evaluation findings and limitations

Five real retinal photographs were each tested twice: **all predictions were class 0, including both HRF diabetic-retinopathy images**. The findings are preserved in [evaluation](docs/evaluation.md), [sources and available labels](docs/data-provenance.md), and [recorded outputs](docs/retinal-results.json). No independently adjudicated five-class evaluation or clinical accuracy is established. Synthetic tests establish software execution only. Basic dimensions, brightness and sharpness do not establish retinal content or validated retinal-image quality.

The glasses, optics, illumination and device transfer remain conceptual. The public simulation never substitutes predefined outcomes for genuine inference. The earlier experimental work and evaluation evidence remain separate from the public workflow.

## Deployment and code review

The existing Vercel production project serves **https://baseera-five.vercel.app/**. The published build was uploaded as static prebuilt output using `deploy/prepare-vercel.mjs`; see [publication record](docs/vercel-publication.md). `vercel.json` contains the existing static SPA routes and API refusal rule. Do not enable research mode or upload workspace/data/model files to the public host. This source update does not change project settings or repository visibility.

At the source-sync check, Vercel was linked to an older v0 source, not this GitHub repository. Pushing here does **not** automatically deploy this project. The current site was published separately through the CLI; the hosting connection has not been changed.

This repository remains private. To let a colleague review it without making it public, the owner can use **GitHub repository → Settings → Collaborators / Manage access → Add people**, invite her GitHub username, and have her accept the invitation. She can review code and propose changes through a branch and Pull Request. No invitation or access change has been made automatically.

The repository contains the React frontend, FastAPI backend, tests, pinned dependency files, deployment configuration and evaluation documentation. Local environments, dependencies, generated builds, logs, credentials, model weights and evaluation photographs are deliberately excluded. Diraya is outside this work and remains untouched.
