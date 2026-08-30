# TASK: Build SectionHead + About + Contact components

You are working inside an existing Vite + React 19 + Tailwind v4 project (JavaScript, NO TypeScript).
Repo root: /home/alexdev/proyectos/Portfolio2Final

## HARD RULES
- Create ONLY the files listed below. Do NOT modify any other file.
- Do NOT run git, npm install, or any package manager command.
- Do NOT add dependencies.
- All user-visible text MUST come from imports of `src/data/profile.js` (never hardcode content strings, except tiny structural labels noted below).
- Code and comments in English. Functional components only. Tailwind utility classes (arbitrary values like `text-[10.5px]` are fine).
- Match existing code style: look at `src/components/ui/ThemeToggle.jsx` and `src/hooks/useTheme.js` first.

## FILES TO CREATE

### 1. src/components/ui/SectionHead.jsx
Generic section header used by every section:
```jsx
<SectionHead num="01" title="Sobre mí" />
```
Renders: a flex row (baseline aligned) with a `<span>` mono tag showing `{`// ${num}`}` in accent color,
an `<h2>` in display font, bold, uppercase, text size clamp(2rem,5vw,3.4rem),
and a flexible hairline line filling remaining space (1px tall, gradient from var(--line) to transparent).
Add prop documentation via JSDoc comment. Export default.

### 2. src/components/ui/SectionHead.test.jsx
- renders the num tag and title
- title is an h2

### 3. src/components/sections/About.jsx
Imports from ../../data/profile: identity, about, social, stack (only what you use), plus roadmap for the study card.
Structure (port of approved mockup section // 01):
a) ID card row ABOVE the main grid: full-width horizontal card (rounded-2xl border border-line bg-ink-2 p-3.5 flex items-center gap-4 relative overflow-hidden) containing:
   - img (size 86x86, rounded-xl object-cover) from identity.photo with alt identity.photoAlt,
     className includes grayscale contrast-125 brightness-95 mix-blend-luminosity,
     wrapped in a div whose style background is linear-gradient(160deg, var(--accent-soft), transparent 70%)
   - name identity.fullName in display font bold uppercase; role line built as `// ${identity.role}` in accent mono;
     sub note "foto temporal · la real llega pronto" muted mono text-[10px]
   - scanline effect element: absolute inset-x-0 h-1/3 with className "id-scan" (animation provided elsewhere)
b) Main grid lg:grid-cols-[1fr_1.15fr] gap-12 items-start:
   LEFT column: h3 heading from about.headingParts where parts[1] wrapped in em not-italic text-accent;
   paragraphs from about.paragraphs muted leading-relaxed; signature about.signature in mono.
   RIGHT column ("bento") grid sm:grid-cols-2 gap-4, cards:
   - Card "ESTUDIO" sm:col-span-2: tag row (`// ESTUDIO` mono accent + italic muted "en curso"),
     title identity.school, sub `${roadmap.career} — San Antonio · ${roadmap.sct} SCT`,
     progress bar: outer h-[5px] rounded bg-[var(--line)], inner span width `${roadmap.progressPercent}%` bg-accent rounded,
     labels row left `SEMESTRE ${roadmap.currentSemester} / ${roadmap.totalSemesters}` right "2° AÑO".
   - Card "REDES": anchor rows for github + linkedin using named icon exports from Hero:
     import { GithubIcon, LinkedinIcon } from './Hero'; each row: icon + handle label + arrow ↗, target _blank rel noopener noreferrer.
   - Card "AHORA": three dot-rows exactly: explorando repos en GitHub / leyendo sobre IA / noticias tech internacionales
   - Card "BASE": title `${identity.location.city}, ${identity.location.code}`; sub `${identity.location.region} · ${identity.location.country}`
   - Card "INTERESES": five chip spans hardcoded: Informática IA Tech Open Source Linux
   Every card base class: rounded-[18px] border border-line bg-ink-2 p-6 transition-transform duration-300 hover:-translate-y-1.
   Card tag pattern: flex justify-between items-center mb-3 font-mono text-[10px] tracking-[0.18em]; tag text accent; suffix italic muted.

### 4. src/components/sections/About.test.jsx
Tests must assert: school name rendered; github and linkedin hrefs present; five interest chips present; signature text present.

### 5. src/components/sections/Contact.jsx
Imports identity + social. Structure:
- centered section: h2 huge uppercase "¿Hablamos?" font-display font-bold leading-none tracking-tight text-[clamp(3rem,11vw,9rem)] where the "?" is a span text-accent. The words ¿Hablamos may be hardcoded (brand copy).
- paragraph hardcode allowed: "Abierto a prácticas profesionales, proyectos y colaboraciones. Escríbeme y conversamos." (muted max-w-md mx-auto)
- email copy button: button data-email={identity.email}, mono, border border-line rounded-xl px-7 py-4, inner span shows email text plus glyph ⧉. onClick: navigator.clipboard.writeText(identity.email) then setState copied -> span text "copiado al portapapeles ✓" then revert after 2200ms setTimeout; on failure show `${identity.email} (copia manual)`. aria-live="polite" on status span.
- links row: github ↗ linkedin ↗ x ↗ using social.x — small mono links hover:text-accent.

### 6. src/components/sections/Contact.test.jsx
Asserts: email visible in button; clicking button switches label to copied state (stub navigator.clipboard.writeText as vi.fn resolving); x link has href social.x.

## ACCEPTANCE
Compiles under repo ESLint rules (no unused vars). No console.log left behind.
