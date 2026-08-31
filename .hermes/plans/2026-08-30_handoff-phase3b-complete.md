# Session Handoff — 2026-08-30 (Phase 3b complete, Phase 4 QA next)

Read this first. It supersedes the stale phase table that used to live in AGENTS.md
(now updated to point here). Companion docs: `2026-08-24_master-phase-plan.md`,
`2026-08-30_phase-3b-ssot-parity-and-live-features.md`.

## Where the project stands

**Concept:** AlexDev_OS — personal portfolio for Alexis Hernández Camus (AIEP student,
San Antonio, CL). GitHub `AlexisHCD/PorfolioADH`. Site content Spanish; code/docs/commits English.

**Real app is built and feature-complete for launch scope** (Vite + React 19 + JS +
Tailwind v4 + GSAP 3.13 + Lenis + react-router-dom 7). The mockup
(`mockups/phosphor.html`) is the approved visual SSOT and the app is a verified 1:1
port (content lives in `src/data/profile.js` + `src/data/legal.js`).

**Latest commit at handoff:** `ead9c6a feat: github-style contribution calendar with year selector`.
Working tree clean. **Nothing has been pushed** — pushes require explicit user approval.

### Recent commit trail (this session)
- `ead9c6a` contribution calendar with year selector (GraphQL-backed)
- `4852657` accessibility pass, favicon, SEO meta
- `7f72335` mobile experience (hamburger menu, touch-safe DOOM, layout fixes)
- `9333a7c` contact form (Web3Forms) + legal pages + routing
- `78bfcaf` live GitHub activity (serverless + 4-layer fallback)
- `cd732a2` 1:1 mockup SSOT sync (projects/stack/roadmap/certs/footer)
- `2a1e652` gitignore Capturasyvideos/ · `db7dc20` phase-3b plan doc
- Earlier: cert viewer/badges + roadmap timeline port (`cd732a2` includes them)

### Gate status at handoff
lint ✅ · `npm test` **85/85** ✅ (`NODE_OPTIONS=--no-experimental-webstorage` already
wired into the test script; `NODE_ENV` must be emptied when running tools — user shell
exports it) · build ✅ (~3s) · axe-core audited in-browser: **0 violations** (home
desktop + 390px + privacy page).

## What works (verified in-browser)
- **1:1 mockup parity**: all sections, texts from `profile.js` (user hand-tuned some
  strings in About/Activity — respect them), roadmap with "Preparación del TPE",
  projects (5, incl. Portfolio v2.0 self-link), certificates viewer (clip-path circle
  reveal, typewriter ledger, draggable arch titlebar, focus return on close).
- **Live GitHub section** (`src/lib/github.js` + `api/github.js`):
  `$ commits --live` panel, real language bars, real stats, real line chart,
  **contribution calendar with year selector (2026/2025)** — all with a
  4-layer fallback: Vercel function → direct CORS fetch → localStorage (per-year key
  `alexdevos-github-cache[:year]`) → committed snapshot. Source badge: `● live` /
  `◍ cache` / `◌ local`. **Without the token** the calendar panel shows the mockup
  seed grid and the selector hides — by design, no fake numbers.
- **Contact form** (`// 07`): Web3Forms transport, client validation + honeypot,
  success/error states, copy-email degradation (user explicitly banned `mailto:`).
- **Legal pages**: `/aviso-legal` + `/politica-de-privacidad` (react-router), footer
  links, both laws linked by official title to BCN (Ley 19.628 + Ley 21.719, effective
  in full 2026-12-01).
- **Mobile**: hamburger overlay menu below `lg`, DOOM refused on coarse pointers /
  `<768px` ("requiere teclado y mouse"), sysbar widgets hidden below `sm`, two-line
  commit/repo rows. Verified at 390×844 and 768×1024.
- **A11y/SEO**: skip link, focus-visible, viewer focus return, `role="status"` loader,
  favicon `</>` (SVG + apple-touch PNG), og.png card, professional title
  "Alexis Hernández — Desarrollador & Ciberseguridad | Portafolio", per-route titles.

## Hard-won gotchas (do not relearn these)
1. **GitHub Events API strips `payload.commits` from PushEvents.** Commit history comes
   from `/repos/{owner}/{repo}/commits` feeds of the top-5 recently-pushed repos
   (`pickFeedRepos`, per_page=30). Merged cap 100 in `reducePayload`.
2. **Real contribution calendar requires the OWNER's token** (GraphQL
   `user(login:).contributionsCollection`, supports `from`/`to` for year selection).
   REST has no calendar. Dev (no token) = seed grid, always.
3. **Lenis is rAF-driven**: in hidden/background tabs rAF freezes — programmatic
   scrolls must use `lenisStore.current.scrollTo(..., { immediate: document.hidden })`
   (see `RouteScroll` in App.jsx). Don't "fix" this back to native scrollIntoView.
4. **`grid-rows-7` (1fr rows) collapses to height 0** in a height-less container — the
   calendar cells use explicit `gridTemplateRows: repeat(7, 11px)`.
5. **`readCache` validates payload shape** (`stats` + `commits[]` present) — a stale or
   malformed cache must fall through to snapshot, never crash consumers.
6. **Vitest gotchas**: run tests via `npm test` (has the webstorage flag). Running
   `npx vitest` bare hits the Node ≥26 global `localStorage` bug.
7. **The IAB browser screenshot pipeline flakes** when the pane is hidden; DOM probes
   via `playwright.evaluate` are the reliable verification path. Lenis/rAF tests need
   the pane visible (`document.hidden === false`).
8. **The mockup SSOT is content-frozen as of `cd732a2`** — after that, the user's
   hand edits + explicit requests win over the mockup (e.g. "120 SCT" removed,
   semestre 04 renamed, ID card removed).

## Phase 4 — QA (next up; policy in AGENTS.md still applies)
- Install `@playwright/test` (+ `@axe-core/playwright`, `@lhci/cli`).
- Viewport matrix: **390×844 / 768×1024 / 1440×900**.
- E2E specs to write (spec-per-feature, no test theater):
  1. smoke: every section renders; loader reaches 100%; footer links → legal routes.
  2. theme toggle day/night persists (localStorage `alexdevos-theme`).
  3. terminal: boot, `help`, `doom.exe` opens on desktop / refuses on touch viewport.
  4. cert viewer: open (circle reveal) → Escape/backdrop/[×] close → focus returns.
  5. roadmap: progress bar fills to node 4 and stays fixed.
  6. contact form: validation blocks, fake-submit success, error shows copy-email.
  7. live activity: mock `/api/github` (playwright `page.route`) → calendar renders,
     year switch works; 500 → cache/snapshot fallback + badge.
  8. a11y gate: axe zero critical violations per page per viewport.
  9. Lighthouse CI budgets (suggest: perf ≥ 85 mobile, a11y ≥ 95, best-practices ≥ 95).
- Reduced-motion pass: animations degrade, calendar still renders.
- Keep unit suite green (85 tests) — extend `githubCore` tests only when logic changes.

## Phase 5 — Deploy runbook (Vercel)
1. **GitHub PAT (owner-only, for the calendar)**: github.com → Settings → Developer
   settings → Fine-grained token → only this repo NOT needed — use **classic token with
   zero scopes** (public data is enough for `user(login:)` GraphQL) or fine-grained
   "Public repositories (read-only)". **It must be created while logged in as
   AlexisHCD** or `user.login` won't match and the calendar layer stays off.
2. **Web3Forms**: create form → copy access key (free tier 250/mo, hCaptcha on).
3. **Vercel**: import `AlexisHCD/PorfolioADH` → framework "Vite" (auto) →
   Environment Variables: `GITHUB_TOKEN` (server-side only — used by `api/github.js`),
   `VITE_WEB3FORMS_ACCESS_KEY` (public-by-design). `vercel.json` (SPA rewrites) and
   `api/` are already committed — Vercel auto-detects the serverless function.
4. **Post-deploy checklist**: `GET /api/github?year=2026` returns JSON with
   `calendar.length > 0`; site badge shows `● live`; calendar total matches the GitHub
   profile for the selected year; form sends to the inbox; legal routes resolve;
   favicon/og.png served.
5. Domain/analytics/JSON-LD = Phase 6 backlog (also: Dwasm DOOM mobile, EN version,
   ⌘K palette, real photo re-integration — the ID card was removed on request; the
   slot is `profile.js` `identity.photo`).

## Repo state notes
- `Capturasyvideos/` is gitignored temp media (user will delete it).
- Dev servers at handoff: Vite on :5173 (background task, `--force` re-optimized),
  mockup static server on :4173 (`python3 -m http.server` from repo root).
- `.hermes/plans/` holds all phase plans; this file is the entry point.
