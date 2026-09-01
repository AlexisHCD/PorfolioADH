# AlexDev_OS — Portfolio v2.0

Personal portfolio for **Alexis Hernández Camus** — AIEP student (Técnico en Programación y Análisis de Sistemas), San Antonio, Chile. Oriented to **Cybersecurity**.

> Status: **feature-complete, QA suite green, deploy-ready** (Vercel runbook in
> [`docs/deploy.md`](docs/deploy.md)). Author-facing documentation (Spanish) in
> [`docs/`](docs/README.md). Agent-facing notes in [AGENTS.md](AGENTS.md).

## What is this?

A terminal-flavored developer portfolio built around one idea: **the whole site is a Linux desktop**. Arch Linux + gruvbox window chrome, an interactive hero terminal, live GitHub activity (serverless-proxied, edge-cached), hand-rolled animated SVG charts, certificate badges with a cinematic viewer — and a fully playable **DOOM easter egg** (`doom.exe`) running native WASM inside a draggable window (desktop only).

## Highlights

- 🌗 Day/night theme with View Transitions circular reveal + WebAudio synth click
- 🟢 **Live GitHub section**: contribution calendar with year selector, commit feed,
  language bars and stats — 4-layer fallback chain, never breaks
- 🖥️ Interactive hero terminal (`help`, `matrix`, `rm -rf /`, `doom.exe`, …)
- 🏅 Certificate badges → arch-frame viewer (clip-path reveal + typewriter ledger)
- 📬 Contact form (Web3Forms) + legal pages (Chilean law 19.628 / 21.719)
- 💀 Konami Code easter egg · ⌨️ SKIDROW-style NFO in the browser console
- ♿ axe-clean (WCAG 2A/2AA, 3 viewports) · mobile-first flows · reduced-motion aware

## Tech

Vite 7 · React 19 · Tailwind CSS 4 · GSAP 3.13 + Lenis · react-router 7 ·
Vercel Function (`api/github.js`, edge-cached GitHub proxy) · Vitest + Playwright.

## Commands

```bash
npm install && npm run dev   # develop on :5173
npm test                     # 30 unit tests (pure logic + contracts)
npm run test:e2e             # 22 Playwright tests + axe audits (against the build)
npm run build                # production build → dist/
```

## License & credits

Site content © Alexis Hernández Camus. DOOM © id Software — executed locally via the
open-source webprboom port (GPL), credit kept visible in the footer.
