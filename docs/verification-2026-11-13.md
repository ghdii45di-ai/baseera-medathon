# Verification record — 2026-11-13 (Asia/Riyadh)

- Preserved the existing uncommitted implementation and reused `.venv-model` and the pinned checkpoint. Existing checkpoint size/hash/archive inspection passed. No AGENTS.md was found in the workspace or checked ancestors.
- `npm test`: 13 passed.
- `npm run build`: TypeScript and Vite succeeded.
- `.venv-model/Scripts/python -m pytest backend -q`: 22 passed, one upstream Starlette/AnyIO deprecation warning.
- `npm audit`: zero reported vulnerabilities.
- `npm run test:e2e -- --workers=1`: 12 passed, no skips, against Vite/model-enabled API.
- Same browser suite with `BASEERA_TEST_BASE_URL=http://127.0.0.1:8010`: 12 passed, no skips, against built React served directly by FastAPI, 28.6s. One earlier run overlapped another inference client and correctly encountered model-busy; serialized final run passed.
- `.venv-model/Scripts/python -m backend.retinal_smoke`: five real photographs, ten genuine predictions; repeated classes match. Every prediction class 0, including both HRF DR-group images. Full inputs/sources/available labels/output/timing in `retinal-inputs.json` and `retinal-results.json`. No accuracy evidence is claimed.
- Browser tests verify genuine prediction/report/refresh/reattachment in English/Arabic; failed reassessment clears an existing result; 500, 429, loading/unavailable 503, malformed successful response and transport failure cannot create a reassuring class. Failed state survives report/refresh. Invalid upload tests cover corruption/size; API tests additionally cover unsupported formats, dimensions, streamed limits and malformed actual provider output.
- Arabic desktop report screenshot inspected. English/Arabic print PDFs generated in ignored `test-results/`; complete pagination acceptance remains pending.
- Dockerfile local COPY inputs verified present, including added model-license document. Actual Docker build/run not executed: no Docker, Podman or installed WSL. This is a blocker, not a passing container test.
- Final loopback services: Vite on 5173; model-enabled FastAPI serving production frontend/API on 8010. No unrelated service was stopped. Test backend has a shared limit of 100/minute; default deployment setting remains ten/minute.

No push, deployment, public link, paid resources or visibility changes. Diraya and the deferred interactive glasses prototype were untouched. See `public-deployment.md` for remaining steps.
