> Publication update: the static simulation is live at https://baseera-five.vercel.app/. See vercel-publication.md for the actual deployment record. The preparation notes below are retained as historical guidance, not current deployment status.

# Publish the simulation — prepared, not published

The simplest path is the existing Vite frontend as a **static dist/ upload**, with no backend or model. No existing host account/project configuration or public URL was found in this checkout. Reuse your frontend host if you already have one, setting build command `npm run build`, publish directory `dist`, and `VITE_BASEERA_MODE=simulation`. No server functions, Python, model download, API proxy, evaluation data or paid resources are needed.

For a compatible Netlify project, `netlify.toml` sets the build/publish settings and `public/_redirects` is copied into dist. It handles `/api/*` first with a disabled response (404), then falls back to `index.html` for browser routes. See [Netlify routing documentation](https://docs.netlify.com/manage/routing/redirects/overview/) and [status/force options](https://docs.netlify.com/manage/routing/redirects/redirect-options/). These are prepared files, not evidence that a hosted deployment has been tested.

Remaining publication steps:

1. Select the existing frontend project/host (or authorize a no-cost static host). Confirm no paid plan, add-on or billable resource will be enabled.
2. Build from this checkout with `npm ci` and `npm run build`, using simulation configuration. Upload ONLY `dist/`, or connect the repository only after push authorization. Do not upload the workspace, `dist-research/`, backend, weights, data or local environment.
3. Configure SPA fallback and ensure `/api/*` has no research proxy/function. The supplied Netlify rules do that for its routing format; other hosts need equivalent settings. Remove any inherited API proxies or research environment variables in the selected host.
4. Publish when authorized, then verify the resulting HTTPS URL, direct `/app/start` and `/research` refreshes, English/Arabic, mobile layout, all three predefined scenarios, report export and an unsuccessful API request. Confirm browser network activity contains no inference/image-upload requests.

The site is ready for a static-host publication check after authorization. No public URL exists yet. No deployment, push, repository visibility change or resource creation was performed. Target-host routing and public PDF/browser acceptance remain to be verified on that actual URL.

The optional root Dockerfile now uses the disabled backend configuration and does not install TensorFlow/download weights. A container is unnecessary for this static demo; actual container build is still unverified because Docker/Podman/WSL are unavailable. The former model-enabled container is retained separately as `deploy/Dockerfile.research` for local research only, with its earlier unresolved license/data-lineage/container issues documented in `research-deployment-history.md`. Those issues are not prerequisites for publishing a simulation that distributes no model or evaluation data.

Local research requires `BASEERA_MODE=research` plus the explicit research frontend mode, bound to loopback. Never set those flags on the public host. The public API does not silently substitute predefined results: simulation results are selected and labelled entirely in the browser, and real inference endpoints reject requests in the public backend configuration.
