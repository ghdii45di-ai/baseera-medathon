# Simulation report refinement — 2026-11-14

Started from clean main at a576c0d, identical to origin/main. No AGENTS.md was found in the checkout or checked parent directories. Changes are isolated on fix/simulation-reports; no newer/unrelated work was overwritten. Existing evaluation records, model weights, local research configuration, disabled-public-inference policy and clinic-to-home development wording are preserved. Diraya is untouched.

## Findings and changes

The three previous scenario indices selected the correct headings/opening sentences. The apparent sameness came from lengthy repeated limitation text. There was also a separate restart issue: the research journey's legacy simulation-complete flag could revive completion after a public restart.

Reports now derive title, explanation and illustrative next step from one stable scenario ID (unflagged, flagged or unavailable), rather than parallel indexed arrays. Existing saved 0/1/2 selections migrate without changing meaning. Report access requires both completed simulated capture and a scenario. Restored states discard research payloads; restart clears completion/result/date, and retry preserves the selected eye. Report date is set when opening a report.

The selected outcome is prominent above case ID, eye, report date and scenario. Each scenario has distinct explanatory/next-step content; unavailable assessment offers a retry without reassurance. A single concise disclosure retains the lack of image capture/analysis, technical checks, validated gradability, model inference or medical advice. Printed reports retain an explicit predefined-simulation badge.

Navigation uses View simulation report, Change scenario and Continue to scenario selection. The capture progress headings no longer promise image review in public mode. The alignment graphic reads 45–55. The existing original SVG fundus artwork is reused with an explicit not-captured/not-analyzed caption and an explanation that the visitor's scenario determines the report. No research photograph was added. Homepage workflow labels no longer suggest public quality assessment, and detailed class-0/missed-disease findings stay on the Research page.

## Local verification

- 18 frontend tests pass, including migration, mapping uniqueness, gating and restart regressions.
- 23 backend tests pass; one upstream Starlette/AnyIO deprecation warning remains.
- Eight production-preview browser tests pass: all three outcomes in English/Arabic for both eyes, distinct explanations/next steps, scenario and language switching, eye changes, Previous/browser Back/progress navigation, retry, both restart controls, saved-state restoration and legacy migration.
- Browser checks cover 390px/1440px widths, no script errors or browser API requests, no confidence scores, no public upload, and direct inference refusal with HTTP 403. Existing research-case records stay unchanged.
- Twelve PDFs (three scenarios × two eyes × two languages) each fit one A4 page. All were rendered; representative renders for every scenario/language were visually inspected, as were mobile RTL and desktop scenario selection. Explicit simulation labels remain visible in print, with no clipping observed. Other browser/printer combinations remain outside this acceptance scope.
- Public TypeScript/Vite build and separate explicit local-research build both succeed. No model inference or new medical evaluation was performed for this UI change.

Production publication and verification are recorded separately in vercel-publication.md. No change to repository visibility, Vercel connection/settings, public URL or paid resources is part of this work.

## Verified production publication

Deployment dpl_B455zHxecuWUUTHHSxXsNnHv5J2x completed on the existing Hobby project at https://baseera-five.vercel.app/. All eight browser tests passed against the live HTTPS alias, including all scenarios for both eyes/languages and report exports. The served public files match the tested build byte-for-byte; inference remains HTTP 403, and private asset paths return 404. The public URL, hosting connection, access settings and research findings are unchanged. No deployment blocker remains. Source changes are on fix/simulation-reports for review rather than merged into main.
