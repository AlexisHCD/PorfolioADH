# AlexDev_OS — Portfolio v2.0

Personal portfolio for **Alexis Hernández Camus** — AIEP student (Técnico en Programación y Análisis de Sistemas), San Antonio, Chile.

> Status: **mockup phase closed & approved** · real-app React scaffold next · see [AGENTS.md](AGENTS.md) for agent-facing docs and `.hermes/plans/` for the phase roadmap.

## What is this?

A terminal-flavored developer portfolio built around one idea: **the whole site is a Linux desktop**. Arch Linux + Kitty + gruvbox window chrome, an interactive hero terminal, hand-rolled animated SVG charts, certificate badges with a cinematic viewer — and a fully playable **DOOM easter egg** (`doom.exe`) running native WASM inside a draggable window.

## Highlights

- 🌗 Day/night theme with View Transitions circular reveal + WebAudio synth click
- 🖥️ Interactive hero terminal (`help`, `neofetch`, `matrix`, …)
- 💀 Konami Code easter egg (screen-wide phosphor surge)
- 🏅 Certificate badges → arch-frame viewer (clip-path reveal + typewriter ledger)
- 🎮 Playable DOOM 1993 (webprboom WASM): pointer-lock UX, auto-close on in-game quit, master volume control
- ⌨️ SKIDROW-style NFO printed to the browser console (scene art from 1997-style release groups)

## Tech

| Layer | Mockup (current) | Real app (next phase) |
|---|---|---|
| Build | single HTML file | Vite |
| UI | vanilla JS | React 18 (JavaScript, no TS) |
| Styling | inline CSS | Tailwind CSS v4 |
| Animation | GSAP + Lenis via CDN | GSAP (ScrollTrigger + SplitText) + Lenis via npm |
| Tests | manual QA (done) | Vitest + Playwright + axe-core |

## Repository layout

```
Portfolio2Final/
├── mockups/
│   ├── phosphor.html      # approved design reference (single source of truth)
│   ├── observatorio.html  # rejected concept (archive)
│   ├── certs/             # real certificate images
│   ├── img/               # placeholder portrait
│   └── cv-alexis-hernandez.pdf
├── .hermes/plans/         # phase-by-phase roadmap
└── AGENTS.md              # conventions & locked decisions (read this first)
```

DOOM payloads are gitignored (~43 MB). Restore locally:

```bash
for e in html js wasm data; do curl -sL -o mockups/doom-web/doom1/doom1.$e \
  https://raw.githubusercontent.com/raz0red/webprboom/github-pages/doom1/doom1.$e; done
```

## Run the mockup

```bash
python3 -m http.server 4173
# open http://localhost:4173/mockups/phosphor.html
```

Try: type `doom.exe` in the hero terminal · toggle day/night (top-right pill) · enter the Konami code `↑↑↓↓←→←→BA` · open DevTools for the console NFO.

## Conventions

- Site content: **Spanish** · Code, comments, commits, docs: **English**
- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`…)
- Design decisions listed in AGENTS.md are **locked** — do not relitigate

## License / credits

Site code by Alexis Hernández Camus.
DOOM © id Software; webprboom WASM port under GPL — credit kept visible in the page footer.
Gorillaz 2-D placeholder portrait used as temporary avatar fan art.
