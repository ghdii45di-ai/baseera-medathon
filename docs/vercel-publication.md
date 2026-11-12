# Published static simulation

Verified HTTPS production URL: https://baseera-five.vercel.app

Existing Vercel project: ghadi132px-8298s-projects/baseera (Hobby plan).
Deployment: dpl_FLw5ErFrPde5XmhisLqujHXfeC9i, production READY.

Deployed only six prebuilt output files through the Vercel Build Output API. No source repository push was necessary. No functions, model weights, retinal evaluation photographs, research records, secrets or private files were uploaded. Repository visibility and Diraya were unchanged; no paid resources were created.

Anonymous HTTPS verification returned 200 for /, /app/start, /research, /device-demo and /app/cases/SIM-001. Direct POST /api/analyze returned 403 with public_demo_inference_disabled. Requests for /.env, /weights/final_model.keras and /docs/retinal-results.json returned 404. English and Arabic public-browser journeys both passed against the actual production alias, including all three scenarios, report export, refresh, mobile/desktop layout and zero browser API requests.

Reproduce the static deployment after rebuilding and reviewing the public output:

```powershell
npm run build
node deploy/prepare-vercel.mjs
npx vercel deploy --prebuilt --prod --scope ghadi132px-8298s-projects --yes --archive=tgz
```

The project remains linked through ignored .vercel/project.json. Never upload the workspace or research build. Existing research findings and local environments remain preserved. The public workflow continues to be explicitly labelled simulation with predefined fictional outcomes and disabled inference.

## Bilingual wording correction deployed

Production deployment dpl_8PLCJS8hbotR1AH8Qc51wysAvTjp retains https://baseera-five.vercel.app/. The shared anatomy section on both / and /device-demo now limits image uploads/basic technical checks to local research experiments and explicitly excludes image upload, assessment and model inference from the public demo. Both languages describe initial development/validation in clinics under specialist supervision, subject to safety reviews/approvals, with home use a future goal after validation and applicable regulatory authorization. The homepage workflow introduction reinforces the local-only boundary.

Verified the exact updated paragraphs in English and Arabic on both live pages, including 390px/1440px layout. Production routes returned HTTP 200 and direct inference remained HTTP 403. The existing simulation workflow and design were retained. No paid resources, visibility change or Diraya modification occurred.
