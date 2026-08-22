# AGENTS.md — Portfolio v2.0 "PHOSPHOR"

Personal portfolio rework for Alexis Hernández Camus (AIEP student, San Antonio, CL).
Currently in **concept-mockup phase**; the real app is not scaffolded yet.

## Stack (decided, pending scaffold)
Vite + React (JavaScript, **no TS**) + Tailwind CSS v4 + GSAP (ScrollTrigger/SplitText, free) + Lenis.
Deploy: Vercel (static). Site content in **Spanish**; code, comments and conventional commits in **English**.

## Repository layout
- `mockups/phosphor.html` — the chosen concept, self-contained (CDN gsap/lenis). Master reference for the visual style.
- `mockups/observatorio.html` — rejected comparison concept (kept as archive; do not iterate on it).
- `mockups/doom-web/doom1/` — DOOM engine payload (gitignored, ~43MB).
- `mockups/jsdos/`, `mockups/doom.jsdos` — legacy js-dos payload (gitignored, unused now).

## Locked design decisions (do not relitigate)
- Concept **PHOSPHOR**: ink-black night theme (default) + blue/white day theme via `data-theme` attr + View Transitions circular reveal + WebAudio synth click on toggle.
- Window chrome is **Arch Linux + Kitty + gruvbox pastel** (user's exact reference: Kitty terminal, Demox-numix-gruvbox theme, Awesome WM). Palette: bg `#1d2021`, bar `#3c3836`, fg `#ebdbb2`, green `#b8bb26`, teal `#83a598`, purple `#d3869b`, yellow `#fabd2f`, orange `#fe8019`, red `#fb4934`. Shared `.archbar` (arch triangle `#83a598`, `[–][□][×]` bracket buttons) across hero terminal, DOOM window and certificate viewer. Prompt: `[guest@arch ~]$`. Hero terminal has an awesome-wm style sysbar (battery/volume/ram/disk/cpu/temp mini SVG widgets; battery real via getBattery, others animated random-walk).
- Certificates = their own section **`// 06 certificados`** (between roadmap and contact) with circular badges (dashed seal ring + rotating conic beam ring, 3D tilt on hover); click opens the gruvbox arch-frame viewer (drag, clip-path circle reveal from the badge, typewriter ledger left, cert image right with hover zoom). Cert images in `mockups/certs/` (AIEP HPI mar-2026, Coursera×Google Intro to AI jul-2026, verify MLVDDQHX5RF1).
- DOOM iframe gets CSS injected on load (same-origin): hides the emscripten "powered by" logo, dims `#controls`. Credit lives in the page footer (id Software + webprboom GPL).
- Interactive terminal in hero (classic black body, white text, green `#00ff00` prompt).
- Background = halftone dots + technical ruler + registration marks (explicitly NO generic grid — user rejected it as "AI slop").
- Custom cursors = native-style tinted SVG data-URIs (green at night, blue in day). No JS-follow cursor (user rejected: laggy).
- Mono-charts style (amicro.vercel.app/mono-charts): hand-rolled animated SVG, no chart library.
- Certificates = circular badges (dashed seal ring + rotating conic beam ring, 3D tilt on hover) in the stack section; click opens an arch-frame viewer (drag, clip-path circle reveal from the badge, typewriter ledger text on the left, cert image right with hover zoom). Cert images in `mockups/certs/` (real certificates: AIEP HPI mar-2026, Coursera×Google Intro to AI jul-2026, verify MLVDDQHX5RF1).
- `doom.exe` easter egg: opens a **draggable 800×600 arch window** (windowed only, no fullscreen) with quit-confirm popup; ESC never closes directly (game gets ESC for its classic menu).

## DOOM easter egg — hard rules
- The game ALWAYS runs in a **same-origin iframe** (`mockups/doom-web/doom1/doom1.html`, webprboom/PrBoom WASM, GPL — keep the credit visible). Closing = removing the iframe (destroys realm: no zombie audio/instances — this was a real bug, never run an emulator inline again).
- Payloads are gitignored. Restore with:
  `for e in html js wasm data; do curl -sL -o mockups/doom-web/doom1/doom1.$e https://raw.githubusercontent.com/raz0red/webprboom/github-pages/doom1/doom1.$e; done`
- Mobile/touch plan: build **Dwasm** (github.com/GMH-Code/Dwasm) with Emscripten for the real app — it has native touch controls + widescreen. Plan B: sfhs-doom single-file. webprboom (current) is desktop-only.
- Verified: no SharedArrayBuffer/COOP-CEOP requirements → works on plain static hosting (Vercel OK).

## Gotchas
- Mockup server: `python3 -m http.server 4173` from repo root (pages at `/mockups/<name>.html`).
- Validate mockup inline JS: `awk '/^<script>$/{f=1;next} /^<\/script>$/{f=0} f' mockups/phosphor.html > /tmp/c.js && node --check /tmp/c.js`
- The preloader must NOT depend on gsap/rAF to hide (rAF freezes in background tabs — caused a stuck loader). CSS transition + setTimeout only.
- Old portfolio data (roadmap/projects/skills) lives in v1: https://github.com/AlexisHCD/Portfolio_Proyecto_AIEP — content there is outdated; a content-update checkpoint with the user is pending (2° año 2026, semester 3 in progress).
- User rules: warn before delicate/system commands; never work outside this workspace.

## Real-app scaffold plan (next phase)
Scaffold at repo root (`src/{components/{layout,sections,ui},data,hooks,lib}`), all content as data in `src/data/profile.js`, fonts via Fontsource (Space Grotesk + Inter + JetBrains Mono), GitHub API without token + localStorage cache, README with stack rationale.
