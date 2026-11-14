> Historical phase record: subsequent publication and merge supersede any pending-deployment or pending-merge statements below. See the [current submission audit](submission-audit-2026-11-14.md). Original verification evidence is preserved.

# Pre-submission clarity and flow update

Work continues on the existing fix/simulation-reports branch and draft PR #1, starting from d6a3b0c after a clean-worktree/remote comparison. No newer work was overwritten and no force push or main-branch replacement is required.

## Visitor-facing changes

- The homepage names diabetic retinopathy in Arabic and English, explains the proposed glasses/platform/diabetes-clinic role, and distinguishes it from today's interactive demo. The empty slogan strip is removed. Four proposed-solution steps use explicit simulated/future/available status chips.
- Progress & sources replaces inconsistent Research/navigation/footer labels without changing /research. Its concise overview contains current availability, limitations, next development steps, a short dataset-candidate line, relevant official references and illustration credits. Model links, exact class-0 runs, provenance, access history and IR/colour engineering details are retained in existing docs and indexed in RESEARCH.md rather than displayed in the public visitor journey. Original experiment records are unchanged.
- A single visible home/demo disclosure, a short footer and a concise report disclosure replace repeated warnings. Contextual illustration/example labels remain. Example names and next-step copy are consistent across selector, report and print; there is no actual referral, follow-up schedule, image assessment or diagnosis.
- Public entry shows the beginning of the journey and explicit Resume previous demo / Start new demo choices if progress exists. The saved bytes are not overwritten on load; even corrupted progress is retained until an explicit new-demo choice. Valid older numeric scenarios still migrate when resumed.
- Current-step headings receive focus and scroll into view on navigation, retry and new starts. Reduced motion uses instant scrolling. Previous/Continue/restart are grouped with instructions; mobile capture/review puts instructions/actions before the illustration, uses a compact tracker and includes the CTA in the mobile menu. Same-route CTA navigation closes the menu and returns to entry choices. Demo replaces case-workspace navigation.
- Preparation wording, the glasses-concept label, the alignment-success text and 45–55 display are consistent. Technical component details remain in documentation/local research rather than public explanatory panels.

## Scope and evidence

The existing layout system, visual palette, original artwork, clinic-led validation pathway, routes, disabled public inference and separate local research workflow are preserved. No camera/upload/referral/case-management functionality, new model, restricted photograph, secret or paid resource is introduced. Backend and retinal experiment records are unchanged; Diraya is untouched.

Final local/live verification and publication are appended after completion below.

## Local verification completed

- 19 frontend unit tests and 23 backend tests pass (one upstream Starlette/AnyIO deprecation warning).
- Ten production-preview browser tests pass, covering all three examples for both eyes/languages, distinct report content, resume/new choices, raw saved-data preservation, corrupt-data handling, legacy migration, retry/restart, back navigation, same-route mobile CTA, heading focus/reduced motion and button visibility at 390px. Homepage/progress/glasses wording, four-step chips, anchors, model-link removal, 1280px/390px overflow checks and inference refusal are covered.
- Public production and separate explicit local-research builds succeed. No medical inference experiment was run for this update.
- Twelve PDFs (three examples × two eyes × two languages) each fit one A4 page. The required disclosure remains visible. Representative English/Arabic pages and homepage/capture/progress/entry layouts were rendered and visually inspected. Other browser/printer combinations remain outside the acceptance scope.
- The original retinal result/input records, provenance, evaluation documents and backend code are unchanged. No weights, research photographs, environment files or private deployment data are staged.

## Verified production publication

Implementation commit 897b01a was published on the existing Baseera Hobby project as deployment dpl_6nijwwmUdqgw27jLrKtxMXNhxRg8. The public URL remains https://baseera-five.vercel.app/. Only six prebuilt static-output files were uploaded; no model, function, research photograph, secret or private workspace file was deployed.

All ten browser tests passed again on the actual HTTPS alias (1.4 minutes), including the bilingual homepage text/four-step labels, Progress & sources, mobile menu, saved-progress choices, scenario reports, both eyes, keyboard focus, restart/retry, restored state and print export. The deployed HTML/JS/CSS/concept image/disabled-API JSON match the tested build byte for byte. Public routes return 200; inference returns 403 and private model/data/environment paths return 404.

The existing draft PR #1 is updated on fix/simulation-reports; main is not overwritten or merged. Hosting connection/settings, repository privacy and the public URL are unchanged. No paid resource was created. No deployment blocker remains; acceptance is scoped to the installed Chrome browser and generated A4 PDFs, not every browser/printer combination.
