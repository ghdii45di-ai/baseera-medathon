# Public simulation deployment

The simulation is live at **https://baseera-five.vercel.app/** in the existing Baseera Vercel project. The production implementation was merged into `main` as `bfb9ff3243465ea4b12906772d70659b216b2c3e`. See the [publication record](vercel-publication.md) and [submission audit](submission-audit-2026-11-14.md).

The public build is a static React/Vite application. It has predefined, explicitly labelled fictional outcomes, no image upload or assessment, no model inference and no backend functions. `/api/*` requests are refused. Do not publish research builds, model weights, evaluation photographs, environment files or the workspace.

## Existing production path

The existing project was published using static prebuilt output, not automatic deployment from this GitHub repository. At the last hosting check, its Git connection still referenced the older v0 source. A GitHub push alone does not update production. Do not change that connection or deployment settings as part of submission cleanup.

For a separately authorized future publication, using the existing free project and authenticated CLI:

```powershell
npm ci
npm test
npm run build
node deploy/prepare-vercel.mjs
npx --yes vercel@65.16.0 deploy --prebuilt --prod --scope ghadi132px-8298s-projects --yes --archive=tgz
```

The preparation script packages the static public build; inspect its output before publishing. Retain the existing simulation defaults and `vercel.json` SPA/API rules. Verify HTTPS, direct `/app/start` and `/research` routes, both languages, all scenarios, mobile and printed reports, and refused API requests after any publication. Never set research flags on the public host.

The Netlify files are an unused alternative static-host configuration, not the current deployment. No new host, paid resource or visibility change is required for the current demo.

## Separate local research

The optional root Dockerfile uses the disabled backend configuration. The simulation needs no container. A container build remains unverified because Docker/Podman/WSL were unavailable during the recorded verification. `deploy/Dockerfile.research` is experimental and local only; its license/data-lineage and container limitations remain in [the research deployment history](research-deployment-history.md). They do not establish medical accuracy or clinical readiness.

Research requires explicit frontend and backend opt-in on loopback. Public outcomes are selected and labelled in the browser; failed research inference is never silently replaced with a simulated result.
