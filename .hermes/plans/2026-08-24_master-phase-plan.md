# Portfolio v2.0 "AlexDev_OS" — Master Phase Plan

> **For Hermes:** orchestrate; delegate build/doc tasks to OpenCode CLI (Zen free tier) per AGENTS.md §Agent orchestration.
> **Goal:** ship the approved mockup as a solid, tested, accessible React app deployed on Vercel.
> **Owner:** Hermes ox-alpha (architect/reviewer) · Builder: OpenCode Zen · Approver: Alexis.

## Answer to "QA before or after scaffold?"
**AFTER scaffold, BEFORE deploy.** The mockup is a throwaway artifact — testing it is waste.
Rule of thumb for this project: every phase ends with its own verification gate (build/tests/lint),
full QA suite lands in Phase 4 once there is a real component tree to test.

---

## Phase 1 — Repo hygiene (NOW)
1. [x] README.md created
2. [ ] AGENTS.md update (rebrand + agent policy + QA policy) — BLOCKED: needs explicit user approval to write protected file
3. [ ] Create GitHub repo `AlexisHCD/Portfolio2Final` (user creates it in browser, private→public later; or install `gh`)
4. [ ] `git remote add origin git@github.com:AlexisHCD/Portfolio2Final.git && git push -u origin main`

## Phase 2 — Scaffold (NEXT)
- [ ] Vite + React 18 (JS) + Tailwind v4 + ESLint + Prettier + Vitest at repo root
- [ ] Folder architecture:
  ```
  src/
  ├── components/
  │   ├── layout/      # Nav, Footer, ThemeToggle, ScrollProgress
  │   ├── sections/    # Hero, About, Stack, Activity, Projects, Roadmap, Certificates, Contact
  │   └── ui/          # ArchWindow, Terminal, Badge, Chart primitives, MagneticButton
  ├── data/profile.js  # ALL content as data (single source, Spanish)
  ├── hooks/           # useTheme, useKonami, usePointerLock, useLenis…
  └── lib/             # gsap setup, audio synth, storage helpers
  ```
- [ ] Fonts via Fontsource (Space Grotesk / Inter / JetBrains Mono)
- [ ] Port tokens from mockup CSS vars → Tailwind theme
- [ ] Gate: `npm run build` green + Vitest smoke + ESLint clean

## Phase 3 — Component port (with per-component tests)
Order: layout shell → theme system → sections top-to-bottom → terminal → certs viewer → DOOM window.
Each ported component: implementation + 1-3 meaningful Vitest tests (behavior, not snapshots).
Port FX as hooks/utilities (`useKonami`, overdrive surge util). DOOM iframe wrapper keeps all
pointer-lock/auto-close/volume logic from the mockup (see AGENTS.md locked decisions).
Gate: visual parity vs mockup reviewed by user in browser; tests green.

## Phase 4 — Full QA pass (the user's question lives here)
- [ ] Playwright smoke: every section renders, key interactions (theme toggle, terminal boot,
      cert viewer open/close, DOOM open/quit) across viewports **390×844 / 768×1024 / 1440×900**
- [ ] axe-core accessibility scan per page+viewport; zero critical violations as merge gate;
      keyboard nav pass (terminal, viewer, dialogs); reduced-motion variants verified
- [ ] Lighthouse CI: perf/a11y/BP/SEO ≥ agreed budgets (define budgets when wiring)
- [ ] Fix round + re-run until green. Gate: full matrix green.

## Phase 5 — Deploy
- [ ] Vercel project wired to GitHub repo (framework auto-detect)
- [ ] meta/OG tags, favicon set, 404, sitemap, robots.txt
- [ ] Post-deploy Lighthouse re-run on production URL

## Phase 6 — Backlog (future, one at a time)
- SEO: JSON-LD person schema, semantic audit
- GitHub API live section (repos + recent commits/PRs), no token, localStorage cache + graceful fallback
- English version (i18n or second locale route)
- Dwasm touch-enabled DOOM for mobile
- Real portrait photo replacing placeholder
- Privacy-friendly analytics (opt-in decision)
- ⌘K global command palette exposing the terminal

## Working agreement
- OpenCode Zen builds/docs per self-contained task briefs; Hermes reviews every diff, runs gates itself.
- Atomic conventional commits; push only with Alexis' explicit approval.
- No test theater: each test encodes a real regression risk. No docs beyond what a future reader needs.
