# TASK: Build Certificates section with badge seals and arch-frame viewer

You are working inside an existing Vite + React 19 + Tailwind v4 project (JavaScript, NO TypeScript).
Repo root: /home/alexdev/proyectos/Portfolio2Final

## HARD RULES
- Create ONLY the files listed below. Do NOT modify any other file.
- No git, no npm, no new dependencies.
- All content from `src/data/profile.js` imports (certificates).
- Code and comments in English. Functional components only.
- Read first: `src/components/sections/About.jsx`, `src/hooks/useInView.js`, `.hermes/tasks/task_c.md` (for style consistency).

## FILES TO CREATE

### 1. src/components/ui/CertificateBadge.jsx
Round seal button for one certificate:
- Props: { cert, onSelect }. Renders button type=button aria-label `ver certificado ${cert.course}` data-hover
  className: relative size-[176px] rounded-full border border-line bg-ink-2 grid place-items-center cursor-pointer transition-shadow hover:shadow-[0_0_44px_var(--accent-glow)] will-change-transform.
- Children layers:
  a) rotating conic beam ring: span absolute -inset-[1.5px] rounded-full pointer-events-none,
     background: conic-gradient(from 0deg, transparent 0 72%, var(--accent) 88%, #b4ffe1 94%, transparent 100%),
     masked to a thin ring using CSS mask radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px)),
     animation spin 7s linear infinite (Tailwind animate-spin is 1s — use inline style animationDuration '7s' with class animate-spin).
     On hover of the parent speed up via group-hover:[animation-duration:1.6s] (add class "group" to the button).
  b) dashed inner seal: span absolute inset-2 rounded-full border border-dashed border-line transition-transform duration-[1400ms] group-hover:rotate-[135deg] group-hover:border-accent-line.
  c) curved text SVG: absolute inset-0 w-full h-full pointer-events-none viewBox="0 0 120 120":
     defs path id=`arc-${cert.id}` d="M60 60 m-45 0 a45 45 0 1 1 90 0" fill none;
     text className="arc-seal-text" with textPath href=#arc-${cert.id} startOffset=50% textAnchor=middle
       textLength=138 lengthAdjust="spacingAndGlyphs" and content cert.sealText.
     Style the text via inline props: fontSize 9, letterSpacing 2, fill var(--muted), fontFamily monospace,
     transition fill; add a <style> tag in this component defining .arc-seal-text:hover not possible — instead set fill on hover via CSS class already existing? Do NOT create new css files: put fill="var(--muted)" and add onMouseEnter nothing. Keep it static muted; acceptable.
  d) core column: flex flex-col items-center gap-[5px]: glyph span (mono text-[15px] muted), org span (mono text-[21px] font-bold tracking-[0.1em] text-text), year span "2026" mono text-[9.5px] tracking-[0.34em] muted.
- Below the round button the caller renders the label; include prop showLabel? NO — keep badge pure.

### 2. src/components/ui/CertificateBadge.test.jsx
- renders button with aria-label containing course name
- renders sealText content in the svg text
- renders issuer org text

### 3. src/components/sections/Certificates.jsx
Section id="certificados". SectionHead num="06" title="Certificados".
Desc line (muted): "Formalización de lo aprendido — chapas verificables. Click para inspeccionarlas." (hardcode ok)
Row: flex justify-center flex-wrap gap-x-[clamp(40px,6vw,96px)] gap-y-10 mt-16.
Each item: div flex flex-col items-center gap-3.5:
  CertificateBadge cert={c} onSelect={setSelected} + label span mono text-[11px] tracking-[0.14em] text-muted (c.label).
Viewer overlay (rendered when selected != null):
- fixed inset-0 z-[9500] bg-black/60 backdrop-blur-sm grid place-items-center p-4, onClick backdrop -> close.
- panel: relative w-full max-w-4xl rounded-xl border border-line bg-gruv-bg (use style background var(--gruv-bg)) overflow-hidden.
- top bar: flex items-center gap-3 bg-[var(--gruv-bar)] px-4 py-2.5: small arch triangle svg (inline path M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z fill #83a598 width 14),
  title mono text-xs color #ebdbb2: `${selected.course} — visor de certificados`,
  close button [×] ml-auto (aria-label cerrar visor) stops propagation, calls onClose.
- body grid md:grid-cols-[300px_1fr]:
  left ledger: p-5 font-mono text-[11px] leading-loose whitespace-pre-wrap color #ebdbb2, lines built from cert fields:
    `> emisor ......... ${selected.issuer}` , `> curso .......... ${selected.course}`,
    platform if present, `> fecha .......... ${selected.date}`, verifyId if present as `> verificación ... ${selected.verifyId}`,
    signedBy if present wrapped at two lines. Render each line as its own div key=i.
  right image area: p-4 grid place-items-center bg-black/20:
    img src selected.image alt `${selected.course} certificate` className max-h-[420px] w-auto rounded-md shadow-lg transition-transform duration-500 hover:scale-[1.04].
- Escape key closes (useEffect window keydown when open). Focus the close button on open (ref + useEffect).
- Body scroll lock: useEffect toggling document.body.style.overflow = 'hidden' while open, restore '' on cleanup.

### 4. src/components/sections/Certificates.test.jsx
- renders both labels from certificates data
- clicking first badge opens the viewer (assert course title visible)
- close button hides the viewer
- renders exactly two badges

## ACCEPTANCE
Compiles under repo ESLint rules. No console.log. No unused vars. No new deps.
