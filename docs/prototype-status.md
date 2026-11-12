# Current prototype status — simulation finalization

Baseera's public default is a clearly labelled interactive hackathon simulation. The existing bilingual React/TypeScript/Vite layout and device animation were reused. Visitors select a predefined fictional scenario after simulated capture; the report explicitly separates the capture animation, unperformed basic checks, absent validated retinal-quality assessment, disabled inference, and visitor-selected demonstration outcome. The unavailable scenario provides no result or reassurance. There is no hidden fallback from inference to simulation.

The public experience has no uploads or API requests and runs as a static frontend. Simulation state has its own browser key and does not read/write existing research cases. Public API requests are blocked in Vite development/preview, and static routing rules are prepared for publication. The backend defaults to simulation, does not load a model, and rejects image-check/inference endpoints even when the research provider is configured.

The local research workflow, weights, isolated environment, real/synthetic execution records and source/label information are preserved. Explicit frontend/backend research flags are required. Existing image checks remain basic descriptive measurements, not retinal gradability. Five real photographs all produced class 0, including both HRF DR-group photographs. No accuracy or clinical validation is claimed. See evaluation.md and retinal-results.json. No alternative model was sought or integrated.

The wearable, optics, illumination, capture and device transfer remain conceptual/simulated. No manufactured glasses, health service, device connection, validated retinal detector, medical advice or public inference is supplied. Diraya and the additional interactive glasses prototype are untouched.

See public-deployment.md for the static publication path and verification-simulation.md for final test evidence. The earlier research verification record remains in verification-2026-11-13.md. No public URL, push, deployment, paid resource or visibility change was created.
