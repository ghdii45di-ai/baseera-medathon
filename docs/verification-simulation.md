# Simulation verification — 2026-11-13

Final public configuration: static Vite build, simulation by default. Explicit `--mode research` AND `VITE_BASEERA_MODE=research` are required for the research UI. Backend defaults to simulation; `BASEERA_MODE=research` is required independently for local inference.

Verified:

- `npm run build`: TypeScript and production Vite build pass.
- `npm test`: 13 pass, including bilingual dictionary coverage and retained research storage/prediction contracts.
- `.venv-model/Scripts/python -m pytest backend -q`: 23 pass; one upstream Starlette/AnyIO deprecation warning. Includes a public-mode test that configures the real provider but forbids any provider access, checks startup/health, and verifies HTTP 403 without predictions for both image checks and inference.
- `BASEERA_TEST_BASE_URL=http://127.0.0.1:5175 npm run test:e2e`: 4 pass, no skips, against the built static simulation. English/Arabic, all three predefined outcomes, simulated capture/eye selection/alignment, report/refresh persistence, 390px/1440px layout, existing research-record preservation, zero browser API requests, excluded data/model artifacts and explicit HTTP 403 on a direct inference request.
- English and Arabic exported simulation PDFs generated, extracted and rendered for inspection. Each is one A4 page. Labels, unavailable outcome, provenance, unperformed checks and disabled inference are visible without clipping. Representative desktop RTL screenshot inspected. Other browsers/printers and the actual public host still require acceptance checks.
- `npm run build:research -- --outDir dist-research`: separate local research build passes. A genuine FastAPI TestClient execution with explicit local research flags loads the existing verified checkpoint and returns a genuine `research_model_prediction` (class 0) for the existing permitted CC0 fixture. This is an execution regression check only; evaluation records were not rewritten.
- `npm audit`: zero reported vulnerabilities.
- `git diff --check`: no whitespace errors (Git emits a Windows line-ending normalization advisory).
- `tmp/baseera-simulation-demo.zip`: exactly six public build files: index, JS, CSS, conceptual glasses PNG, disabled-API JSON and SPA routing rules. No model weights, medical photographs, backend files or evaluation records. Publish this archive's contents or `dist/` only.

Preserved: all prior retinal input/result records, documented disease misses, synthetic execution records, weights, isolated model environment and local research workflow. The experimental model remains unsuitable for clinical screening. No alternative model was searched for or integrated. No accuracy or clinical validation is claimed. The simulation's visitor-selected outcomes are not substitutes for real inference.

The earlier 12-test research browser suite is retained as `npm run test:e2e:research`; the current simulation acceptance is the separate four-test suite. The old research test evidence remains in verification-2026-11-13.md and is not reclassified as simulation evidence.

Remaining to publish: select/authorize the existing static hosting target, upload only the prepared public build, set SPA fallback and disabled API routing, then verify the actual HTTPS URL and PDF export. No hosted URL exists yet. No push, deployment, paid resource or visibility change occurred. Actual container build remains unverified and is unnecessary for static publication. Diraya was untouched.
