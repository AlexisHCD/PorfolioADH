# TASK: Build the interactive Terminal component (hero slot)

You are working inside an existing Vite + React 19 + Tailwind v4 project (JavaScript, NO TypeScript).
Repo root: /home/alexdev/proyectos/Portfolio2Final

## HARD RULES
- Create ONLY the files listed below. Do NOT modify any other file.
- No git, no npm, no new dependencies.
- Content strings in Spanish (they ARE user-visible content; hardcoding here is allowed since this
  component is the content). Code/comments in English.
- Read first: `src/components/ui/SectionHead.jsx` for style conventions and `src/data/profile.js`
  for identity/social/projects/roadmap/certificates data (use them where noted).
- gruvbox chrome constants available as CSS vars: --gruv-bg #1d2021, --gruv-bar #3c3836,
  --gruv-fg #ebdbb2, --gruv-green #b8bb26, --gruv-teal #83a598, --gruv-purple #d3869b,
  --gruv-yellow #fabd2f, --gruv-orange #fe8019, --gruv-red #fb4934.

## FILES TO CREATE

### 1. src/components/ui/Terminal.jsx
Arch-window terminal for the hero right column. Structure:
- Root div className "flex flex-col overflow-hidden rounded-xl border border-[#504945]" with style background var(--gruv-bg), boxShadow subtle.
- Title bar (archbar): flex items-center gap-2.5 bg-[var(--gruv-bar)] border-b border-black/30 px-3.5 py-2:
  arch triangle svg (viewBox 0 0 16 16, path M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z fill #83a598 width 14 height 14),
  span mono text-[11px] color var(--gruv-fg): <b>alex@archlinux</b>: ~/portfolio — kitty,
  spacer ml-auto, decorative sysbar: five tiny inline SVG glyphs (battery/volume/ram/cpu/temp) using the
  gruvbox colors above, each inside a span.flex.items-center.gap-1 with a small text value:
  battery "100%", volume "67", ram "42%", disk "61%", cpu "14%", temp "45°" — purely static/decorative.
  Add aria-hidden to the sysbar wrapper.
- Body: ref-able scroll container h-[300px] md:h-[340px] overflow-y-auto p-3.5 font-mono text-[12.5px] leading-relaxed bg-transparent.
  Lines state: array of {id, html} rendered via dangerouslySetInnerHTML (content is built internally from
  escaped user input — implement escapeHtml(s) replacing & < > ).
- Boot sequence on mount (async, cancellable via AbortController-ish flag or mounted ref):
  print lines with delays: "alexdev os v2.0 — tty1", "montando /dev/portfolio ......... ok",
  "iniciando shell phosphor ...... ok", "" , then prompt line.
  Use setTimeout chains stored in a ref array and clear them all on unmount.
- Prompt line at bottom of body: flex items-center gap-2:
  span text-[var(--gruv-green)] font-bold "[guest@arch ~]$" + input (transparent bg, outline none, flex-1,
  color var(--gruv-fg), font-mono) + blinking block cursor span (animate-pulse bg-[var(--accent)] w-[9px] h-[15px]).
  Clicking anywhere on the body focuses the input.
- Command handling on Enter:
  push echo line `{`[guest@arch ~]$ ${escaped}`}` styled color #ebdbb2,
  keep history array (ref), ArrowUp/ArrowDown navigate history (input value swap),
  run command matching (lowercase first token):
  - help -> list commands (see below)
  - whoami -> two lines from identity.fullName + role + location.city
  - stack -> three lines listing stack items joined by ' · ' (import stack)
  - proyectos -> numbered lines from projects data: `${p.num} ${p.title} → ${p.repo}`
  - roadmap -> status lines per semester (✓✓✓ done years, ● current title [en curso], ◇ next) + final line `progreso de carrera: ${roadmap.currentSemester}/${roadmap.totalSemesters} semestres`
  - contacto -> email + github + linkedin lines (identity.email, social.*)
  - certificados -> one line per certificate: `[${i+1}] ${c.label.replace('// ','')} · ${c.date}`
  - neofetch -> ascii art lines (hardcode a small 6-line arch logo ascii + info lines os: alexdev os v2.0, host: portfolio 2026, shell: react-sh 1.0, uptime: 2° año y contando)
  - theme -> call prop onToggleTheme() and print "tema alternado"
  - clear -> empties lines
  - ls -> "proyectos/  intereses/  cv.pdf  doom.exe*"
  - date -> new Date().toLocaleString('es-CL')
  - sudo -> error line "permiso denegado: aquí manda alexis." (class t-red)
  - matrix -> prints "entrando a la matrix..." then 18 lines of katakana/digits rain over ~2s
    (setInterval 110ms printing 1 random line each tick, glyphs string constant), stops automatically
  - rm with args "-rf /" -> "jajaja no. este sistema es inmune a dedos traviesos."
  - doom.exe or doom -> print "ejecutando ./doom.exe ..." then call prop onLaunchDoom()
  - unknown -> `comando no encontrado: X — prueba help`
  Line color helpers: t-ok uses var(--gruv-green), t-err var(--gruv-red), t-accent var(--gruv-teal),
  default var(--gruv-fg). Implement as small function returning class names; keep it simple with spans.
- Props: { onToggleTheme = () => {}, onLaunchDoom = () => {} }.
- Auto-scroll body to bottom whenever lines change (ref.scrollTop = scrollHeight in useEffect).

### 2. src/components/ui/Terminal.test.jsx
jsdom notes: use fake timers where needed; boot sequence may be awaited via waitFor.
Tests:
- renders prompt "[guest@arch ~]$"
- typing "help" + Enter shows "comandos disponibles"
- typing "sudo" + Enter shows "permiso denegado"
- typing "rm -rf /" + Enter shows "jajaja no"
- typing "whoami" + Enter renders identity.fullName
- unknown command shows "comando no encontrado"

## ACCEPTANCE
Compiles under repo ESLint rules (react-hooks rules!). No console.log. No unused vars. Timers cleaned up on unmount.
