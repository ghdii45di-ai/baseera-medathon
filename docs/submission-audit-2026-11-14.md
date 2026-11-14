# MEDATHON submission audit ? 2026-11-14

Baseera ? team **MED-P4LJHS**. Live simulation: https://baseera-five.vercel.app/. Source: https://github.com/ghdii45di-ai/baseera-medathon.

## Scope and findings

The checkout and fetched `origin/main` initially matched merge `bfb9ff3243465ea4b12906772d70659b216b2c3e`, with no pending changes or newer remote work. That merge contains `897b01a` and `80dfdc2`. This cleanup changes documentation and exclusions only; the submitted frontend/backend implementation is preserved.

Gitleaks 8.30.1 (official release archive verified against its published SHA256 checksum) scanned all reachable history, including all local refs, and an exported tracked-file tree with default rules and no custom suppressions. Both scans reported zero credential findings. Supplementary checks inspected all 202 stored Git blobs, eight reachable commits (seven on main), and 89 historical paths for credential patterns, actual environment files, patient-record patterns and forbidden artifacts. No additional credential/content findings or forbidden artifacts were detected. Automated checks cannot prove the absence of every possible sensitive datum.

The sole binary in stored Git blobs is the generated glasses concept illustration, `public/assets/baseera-glasses-concept-v1.png`, SHA256 `ef3600e670ee392de90d004873cea006ca018d3173a4cfcac8fd835a89302fed`. No research photographs, weights, dependencies, virtual environments, logs or caches were found in tracked history. Research provenance, attribution, class 0 results and evaluation records remain intact. Actual local environments and research assets remain ignored and were not removed.

### Git metadata privacy consideration

Existing author/committer metadata contains non-noreply email addresses. Values are intentionally omitted. Affected commits on main:

- `bfb9ff3243465ea4b12906772d70659b216b2c3e`
- `80dfdc27cc1189e6daadae2eb59a96cb13d3468a`
- `897b01a69d8dffcc116c16b7870ed7bd631c7510`
- `d6a3b0cf1d50352df94f60ad3bff3f3b52280723`
- `24da8d945f4f067b1a609776d9ecf509cc4688c0`
- `a576c0d197c8ad8cd76e05e0b815b97b2cd921c2`
- `b3d17b737d24375cd62c1234417c135e2cebc034`

One additional local-only checkpoint also contains non-noreply metadata; it is not on main and is not being pushed. These are identity metadata, not detected credentials or patient records. No credential rotation is indicated by the scan results. The repository is now public. If the owner regards these addresses as private, historical metadata exposure requires a separate privacy decision. Removing an address from current files does not remove historical metadata; sanitizing that history would require a separately authorized history rewrite, which was not performed. Use GitHub noreply identity for future commits where appropriate.

## Submission cleanup

- Added team code, explicit current/future functionality and audit access guidance to README; clarified backend test terminal instructions.
- Replaced contradictory unpublished status with the actual static Vercel publication status and retained the existing deployment connection/settings.
- Marked previous phase reports as historical without erasing evaluation or verification evidence.
- Consolidated exclusions for local environments, model/data assets, generated files, logs and credential files. `.env.example` contains only non-secret example defaults; the public demo needs no environment file.

## Verification

Passed: 19 frontend unit tests, 23 backend tests and the production TypeScript/Vite build. Backend tests emitted one dependency deprecation warning. All 10 live Playwright tests passed, covering Arabic/English, both eyes, distinct scenarios, switching/back/retry/restart, saved-state restoration, mobile navigation, print export and disabled public inference. Live JavaScript, CSS and concept-image bytes match the local production build exactly. Nine broken relative links in the relocated historical workflow document were repaired; all 55 internal Markdown file links resolve. No public inference is enabled and no application source or deployment configuration is changed by this cleanup.

## Access and remaining action

Initial access checks returned Private/404. During the audit, a later metadata check reported **Public**, and fresh unauthenticated HTTP requests to the repository, its README page and raw README all returned **200**. This audit did not change visibility. Anonymous judges can now access the source. Write access still requires a collaborator invitation; public reviewers can use forks and Pull Requests. Existing historical email metadata remains a privacy consideration, not a detected credential exposure. No automatic invitations, history rewrite or deployment setting changes were performed.

Vercel was previously linked to an older v0 source, not this repository; a push here does not imply automatic production deployment. The audit does not publish a new site version. The implementation remains the one already deployed and merged; documentation-only cleanup does not require a new frontend release.
