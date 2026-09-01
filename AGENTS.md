# AGENTS.md — Portfolio v2.0 "AlexDev_OS"

Personal portfolio for Alexis Hernández Camus (AIEP student, San Antonio, CL). GitHub: `AlexisHCD/PorfolioADH`.
The **concept-mockup phase is CLOSED and user-approved** (Aug 2026). Next phase: real-app React scaffold.

## Stack (decided)
Mockup (reference only): self-contained HTML/CSS/JS with CDN gsap/lenis.
Real app: Vite + React (**JavaScript, no TS**) + Tailwind CSS v4 + GSAP (ScrollTrigger + SplitText — both free since v3.13) + Lenis.
Deploy: Vercel (static). Site content in **Spanish**; code, comments, docs and conventional commits in **English**.

## Agent orchestration
- **Hermes (ox-alpha)** = architect/orchestrator/reviewer: plans, reviews every diff, runs builds/tests itself, proposes atomic commits. Pushes only with user approval.
- **OpenCode CLI (Zen FREE tier)** = builder/documenter. Invoke from repo root:
  `opencode run "$(cat /tmp/task.md)" --model opencode/<model>`
  - VERIFIED WORKING bench (all passed smoke + code tests): `opencode/hy3-free` (PRIMARY), then rotation order: `nemotron-3-ultra-free`, `big-pickle`, `muse-spark-1.2-contributor-free`, `mimo-v2.5-free`, `nemotron-3.5-lightning-free`. Rotate on failure — toy benchmarks don't differentiate quality; real differentiator is long-brief adherence, discovered during Phase 2.
  - KNOWN BROKEN/FLAKY: `opencode/ox-alpha-free` → HTTP 500 server-side (user investigating); `opencode/x-preview-f-free` → upstream endpoint down most of the time (~1/4 success; retry occasionally); provider `opencode-go/*` → insufficient balance (dead subscription, never use).
  - Always smoke-test first: `opencode run 'Respond with exactly: SMOKE_OK' --model <id>`.
  - Task briefs must be self-contained: absolute paths, conventions, acceptance criteria, what NOT to touch; attach context with `-f`.

## Repository layout
- `mockups/phosphor.html` — approved design reference (file keeps its historical name). Single source of truth for visuals/animations while porting.
- `mockups/observatorio.html` — rejected comparison concept (archive; do not iterate).
- `mockups/img/whoami.jpg` — placeholder ID photo (Gorillaz 2-D fan art); replace with a real portrait later.
- `mockups/certs/` — real certificate images (AIEP HPI mar-2026, Coursera×Google Intro to AI jul-2026, verify MLVDDQHX5RF1).
- `public/doom/doom1/` — DOOM payload for the real app, served at `/doom/doom1/doom1.html` (gitignored). Legacy `mockups/jsdos/`, `mockups/doom.jsdos` — gitignored, unused.
- `mockups/cv-alexis-hernandez.pdf` — downloadable CV.
- `.hermes/plans/` — master phase plan + implementation plans.

## Locked design decisions (do not relitigate)
- Brand: **AlexDev_OS** (formerly "PHOSPHOR"; zero references to the old name remain in UI).
- Ink-black night theme (default) + blue/white day theme via `data-theme` attr + View Transitions circular reveal + WebAudio synth click. Persisted under localStorage key `alexdevos-theme`.
- Window chrome is **Arch Linux + Kitty + gruvbox pastel** (user's exact desktop). Palette: bg `#1d2021`, bar `#3c3836`, fg `#ebdbb2`, green `#b8bb26`, teal `#83a598`, purple `#d3869b`, yellow `#fabd2f`, orange `#fe8019`, red `#fb4934`. Shared `.archbar` (arch triangle `#83a598`, `[–][□][×]`) across hero terminal, DOOM window, cert viewer. Prompt `[guest@arch ~]$`; awesome-wm style sysbar widgets (decorative only, battery fixed at 100%).
- Loader: ~2s, **always visibly reaches 100%** before hiding. Self-correcting `setInterval` counter (never rAF-dependent); `hideLoader()` waits for `counterDone`; failsafe at 6s. (rAF froze at 68% under main-thread stalls — real bug, fixed twice.)
- Roadmap progress bar fills ONCE up to measured center of node 4 via `tlTargetFrac()`, then stays FIXED. Never scroll-scrubbed (explicit user requirement: progress indicator, not scrollbar toy).
- Certificates = own section `// 06 certificados`: circular badges (dashed seal ring + conic beam ring, 3D tilt), curved seal text via SVG textPath with fixed `textLength="138"` (prevents clipping): `· ASHOKA × AIEP ·` and `· COURSERA × GOOGLE ·`. Click opens gruvbox arch-frame viewer (drag, clip-path circle reveal from badge, typewriter ledger left, cert image right with hover zoom).
- Hero CTAs: `ver proyectos ↓` + `github ↗` + `linkedin ↗`, inline SVG icons, magnetic hover.
- Contact email: **adhcamus@gmail.com** (copy button + terminal `contacto`).
- Background: full-page ambient field — halftone dots + technical rulers both edges + 4 scroll-distributed glows + hairline seams between sections (NO generic grid — rejected as "AI slop"). Scroll-progress hairline beam fixed at viewport top.
- Custom cursors: native-style tinted SVG data-URIs (green night / blue day). No JS-follow cursor.
- Mono-charts: hand-rolled animated SVG, no chart library.
- Konami Code (`↑↑↓↓←→←→BA`) = Overdrive surge: screen-wide phosphor vignette flash breathing ~6s + beams ×6 speed (CSS var `--beam-speed`) + glow scale/brightness pulse. Disabled while DOOM or cert viewer is open.
- Terminal easter eggs: `matrix` (katakana rain 5s), `rm -rf /` (funny refusal), `sudo`, `doom.exe`. Console prints SKIDROW-style NFO (scene skull block art) in phosphor green on load.
- DOOM window: pointer-lock pill hint (fades when locked), click-to-recapture canvas, overlay clicks refocus iframe, console log `#output` hidden, in-game QUIT auto-closes the arch window (Module.onExit hook), master audio gain 0.4 injected over iframe AudioContext.

## DOOM easter egg — hard rules
- ALWAYS same-origin iframe (`public/doom/doom1/doom1.html`, webprboom WASM, GPL — credit visible in footer). Closing removes the iframe (destroys realm: no zombie audio — real past bug).
- Payloads are gitignored. Restore:
  `for e in html js wasm data; do curl -sL -o public/doom/doom1/doom1.$e https://raw.githubusercontent.com/raz0red/webprboom/github-pages/doom1/doom1.$e; done`
- Verified: no SharedArrayBuffer/COOP-COEP requirements → plain static hosting OK (Vercel fine).
- Mobile/touch plan: build **Dwasm** (github.com/GMH-Code/Dwasm) for the real app. webprboom is desktop-only.

## Gotchas
- **Node ≥26 ships an experimental global `localStorage`** that shadows jsdom's inside Vitest (`undefined` methods, tests crash). All test scripts must set `NODE_OPTIONS=--no-experimental-webstorage` (already wired into package.json).
- The user's shell exports `NODE_ENV=production`, which makes npm silently skip devDependencies. Always install/run tooling with `NODE_ENV=` emptied.
- Mockup server: `python3 -m http.server 4173` from repo root (`/mockups/phosphor.html`).
- Validate mockup inline JS: `awk '/^<script>$/{f=1;next} /^<\/script>$/{f=0} f' mockups/phosphor.html > /tmp/c.js && node --check /tmp/c.js`
- Old v1 data: https://github.com/AlexisHCD/Portfolio_Proyecto_AIEP (outdated; superseded by current content).
- User rules: warn before delicate/system commands; never work outside this workspace; propose commits atomically, never push without explicit approval.

## QA & testing policy (revised 2026-08-30 — lean suite, user decision)
**Methodology: SDD (spec-driven development)** — the approved mockup is the visual
specification, the data layer (`src/data/`) is the content specification; specs
precede implementation and contract tests validate them. Not TDD.
Testing targets the **real app, not the mockup**. The primary QA layer is **E2E**
(Playwright, `e2e/`, 22 tests): it owns flows, interactions and regressions.
Unit tests exist **only for pure logic and data contracts** — component render
tests were removed (they duplicated e2e coverage and added maintenance noise).

- Unit (Vitest, 5 files / 30 tests): `githubCore` reducers, `github` fallback
  chain, `profile.js` contract, `useTheme`, `useKonami`. Do not re-add render
  tests per component.
- E2E: `npm run test:e2e` — smoke, theme, roadmap fixed-progress, cert viewer,
  terminal/DOOM, live activity with network fixtures, contact form, axe
  (wcag2a/2aa) on 3 pages × 3 viewports — zero critical/serious gate.
- Performance: Lighthouse CI with budgets once deploy wiring exists.
- Proportionality rule: no test theater — each test encodes a real regression risk or acceptance criterion.

## Phase roadmap (details + session handoff in .hermes/plans/)
**ENTRY POINT for new agents: `.hermes/plans/2026-08-30_handoff-phase3b-complete.md`**
(current state, gotchas, QA plan, deploy runbook). Nothing has been pushed yet.

| Phase | Scope | Status |
|---|---|---|
| 0 | Concept + mockup | DONE (approved 2026-08-24) |
| 1 | Repo hygiene: README, AGENTS.md, GitHub remote + push | IN PROGRESS (push needs user approval) |
| 2 | Scaffold: Vite+React+Tailwind4+ESLint+Prettier+Vitest, `src/` architecture, `profile.js` data layer | DONE |
| 3 | Component port + live GitHub (serverless), contact form, legal pages, mobile pass, a11y, favicon/SEO — 1:1 mockup parity verified | DONE (2026-08-30) |
| 4 | Full QA pass: Playwright suite, axe, Lighthouse, mobile matrix | NEXT (spec list in handoff doc) |
| 5 | Deploy Vercel + env tokens (GITHUB_TOKEN, VITE_WEB3FORMS_ACCESS_KEY) — runbook in handoff doc | PENDING |
| 6 | Backlog: JSON-LD/analytics, EN version, Dwasm touch DOOM, real photo re-integration, ⌘K palette | PENDING |

