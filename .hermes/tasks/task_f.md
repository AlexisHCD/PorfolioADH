# TASK: Build the DOOM window component (arch window with iframe + pointer-lock UX)

You are working inside an existing Vite + React 19 + Tailwind v4 project (JavaScript, NO TypeScript).
Repo root: /home/alexdev/proyectos/Portfolio2Final

## HARD RULES
- Create ONLY the files listed below. Do NOT modify any other file.
- No git, no npm, no new dependencies.
- Code and comments in English; user-visible strings in Spanish as given.
- Read first: `src/components/ui/Terminal.jsx` for gruvbox chrome conventions.

## CONTEXT
The game payload lives at PUBLIC url `/doom/doom1/doom1.html` (gitignored folder the user restores
locally). The game is webprboom WASM and uses Pointer Lock for mouse look. Known issues from the
mockup era that THIS component must solve:
1) clicking outside the canvas strands focus -> keys dead;
2) losing pointer lock confuses the player;
3) in-game QUIT should close the whole window automatically;
4) game audio too loud by default.

## FILES TO CREATE

### 1. src/hooks/usePointerLockState.js
Hook tracking whether an element inside a given iframe document currently holds pointer lock.
Signature: usePointerLockStatus(frameRef) returns 'locked' | 'unlocked'.
Implementation notes: attach pointerlockchange listener on frameRef.current.contentWindow.document
inside a load-aware effect (retry attach on an interval of 400ms until doc available or 20 tries).
Cleanup everything on unmount. Guard every access with try/catch (cross-origin safety).

### 2. src/components/ui/DoomWindow.jsx
Props: { open = true, onClose }.
If !open return null.
Overlay: fixed inset-0 z-[9600] bg-black/60 grid place-items-center p-4,
onClick on the overlay background (e.target === e.currentTarget) -> refocus iframe (NOT close).
Window: w-[min(800px,94vw)] aspect-[4/3] flex flex-col overflow-hidden rounded-xl border border-[#504945]
bg black shadow-2xl.
Title bar (draggable via pointer events, store offset in ref, apply translate to window wrapper):
flex items-center gap-2.5 bg-[var(--gruv-bar)] px-3.5 py-2 select-none cursor-grab active:cursor-grabbing:
arch triangle svg like Terminal's, title mono text-xs color #ebdbb2: <b>alex@archlinux</b>: ~/doom — doom.exe,
ml-auto span mono [10px] text-[#928374] "esc: menú", close button [×] aria-label "cerrar doom"
mono px-2 hover:text-[#fb4934].
Body: relative flex-1 bg-black:
- iframe title="DOOM — prboom wasm" src="/doom/doom1/doom1.html" className absolute inset-0 h-full w-full border-0
  allow="autoplay; fullscreen" — IMPORTANT also set ref.
- pointer-lock pill: absolutely centered top-3 z-[5], rendered when status !== 'locked':
  span rounded-full border border-[#504945] bg-[rgba(29,32,33,.88)] px-3.5 py-1.5 font-mono text-[10px]
  tracking-widest color #ebdbb2, text: "click en el juego = capturar mouse · esc = liberar".
- Injected-on-load CSS into the iframe document (same-origin, try/catch): hide a[href*="emscripten.org"],
  hide #output, dim #controls opacity .45 font-size 10px with :hover opacity 1.
- On iframe load ALSO: patch AudioContext destination gain at 0.4 (wrap AudioContext.prototype.destination
  with a master GainNode exactly once per context using a WeakSet guard), set up click-to-recapture:
  document click handler inside iframe that requests canvas.requestPointerLock() when nothing is locked
  (ignore clicks on #controls), and hook Module.onExit + window 'exit' event to call onClose()
  (in-game QUIT closes the window automatically). Wrap ALL of it in try/catch.
- Escape key global handler while open: if quit dialog hidden show it, else hide it (game owns ESC when focused).

### 3. Quit confirm dialog INSIDE DoomWindow (same file)
State showQuit. Rendered above body content: absolute inset-0 z-[6] grid place-items-center bg-black/55:
card rounded-xl border border-white/15 bg-[#1c1c1e] p-6 text-center:
p "¿Salir del juego?" (color #e8e8e3, font-medium), row gap-3 mt-4 two buttons:
"Sí, salir" (id-less, bg #ff5f57 text dark rounded-md px-4 py-2) -> onClose(),
"Seguir jugando" (border white/20 color #e8e8e3) -> setShowQuit(false) and refocus iframe.

### 4. Tests src/components/ui/DoomWindow.test.jsx
Mock heavy browser APIs where needed (jsdom lacks them):
- renders nothing when open=false (queryByLabelText 'cerrar doom' null)
- renders title bar and close button when open=true
- clicking "Sí, salir" calls onClose
- clicking "Seguir jugando" hides the dialog

Keep tests robust: query by role/name, not implementation details.

## ACCEPTANCE
Compiles under repo ESLint rules. No console.log. All timers/intervals cleaned on unmount.
