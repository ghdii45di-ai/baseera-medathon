# Source synchronization verification — 2026-11-13

The full frontend/backend source, tests and project configuration are prepared for the existing private GitHub repository on main. Existing local work was preserved; generated files and private research assets remain outside Git. Only the sanitized `.env.example` is included; actual `.env*` files, `.vercel`, local environments, dependencies, model weights and evaluation photographs are excluded. A staged-file secret/identity-pattern scan found no matches.

Verified from the dependency lock: npm ci succeeded after releasing Baseera's own development-server lock on esbuild.exe; no unrelated process was stopped. Frontend unit suite: 13 passing. Backend suite: 23 passing with one upstream deprecation warning. Production build succeeds. All four public browser tests pass against https://baseera-five.vercel.app/, including English/Arabic and disabled inference (HTTP 403).

All five served public files match the rebuilt source byte for byte by SHA-256: index HTML, JS, CSS, conceptual glasses image and disabled-API JSON. The separate Netlify routing file is intentionally not served by Vercel. See source-sync-verification.json for exact file hashes. README, research documentation and backend are additional source/review material, not publicly served application assets. The public app remains a labelled simulation; genuine research inference was not activated.

Read-only hosting inspection found the existing Baseera Vercel project linked to an older v0 source rather than ghdii45di-ai/baseera-medathon. Consequently, this GitHub push does not automatically deploy that Vercel project. No hosting connection, deployment setting, repository visibility or access permission was changed. Diraya was untouched.

The repository remains private. Its owner may invite a colleague through GitHub repository Settings → Collaborators / Manage access → Add people, using her GitHub username. She must accept the invitation. No invitation was issued automatically and no public visibility is required.
