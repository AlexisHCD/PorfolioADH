# TASK: Build Projects (bento grid) + Roadmap (fixed progress timeline)

You are working inside an existing Vite + React 19 + Tailwind v4 project (JavaScript, NO TypeScript).
Repo root: /home/alexdev/proyectos/Portfolio2Final

## HARD RULES
- Create ONLY the files listed below. Do NOT modify any other file.
- No git commands, no npm install, no new dependencies.
- All content from `src/data/profile.js` imports (projects, roadmap). Never hardcode content strings except structural labels noted.
- Code and comments in English. Functional components only. Tailwind utilities allowed.
- Style reference: read `src/components/sections/About.jsx`, `src/hooks/useInView.js` and `src/components/ui/SectionHead.jsx` first.
- Deterministic renders. No Math.random at render.

## FILES TO CREATE

### 1. src/components/sections/Projects.jsx
Section id="proyectos". SectionHead num="04" title="Proyectos".
Bento grid port of the mockup:
- Grid: md:grid-cols-2 gap-4, the FEATURED project card spans both columns (md:col-span-2).
  Derive featured from projects.find(p => p.featured); render it FIRST, then the rest in order.
- Card base: rounded-[18px] border border-line bg-ink-2 p-6 transition-transform duration-300 hover:-translate-y-1, wrapped in an <a> to p.repo with target _blank rel noopener noreferrer, className block h-full.
- Card content: top row flex justify-between: mono tag `{`// ${p.num}`}` accent text-[10px] tracking-[0.18em]
  + badge: if p.privateRepo show span "repo privado" (mono [10px] muted border border-line rounded-full px-2 py-0.5),
           else if p.featured show "destacado" styled with accent border/text instead of muted.
  Title: font-display text-xl font-bold mt-3.
  Description: text-sm text-muted mt-2 leading-relaxed.
  Tech chips row mt-4: each chip rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted.

### 2. src/components/sections/Projects.test.jsx
- renders all four project titles from data
- renders the "repo privado" badge exactly once
- renders the "destacado" badge exactly once
- every card links to its repo href

### 3. src/components/sections/Roadmap.jsx
Section id="roadmap". SectionHead num="05" title="Roadmap".
Sub-line under head (text-muted): `${roadmap.career} — ${roadmap.totalSemesters} semestres · ${roadmap.sct} SCT · Instituto Profesional AIEP`.
Timeline structure:
- Container relative with a vertical line: absolute left-[12px] top-2 bottom-2 w-[2px] rounded overflow-hidden, inner track uses var(--line) as background.
- Progress fill INSIDE the line container: absolute inset-x-0 top-0 bg-accent rounded, height computed as percentage of container height, width full.
  CRITICAL BEHAVIOR (user requirement, do not deviate):
  The fill animates ONCE when the timeline enters view (use useInView from ../../hooks/useInView on the list container)
  from scaleY(0) to scaleY(targetFraction), transform-origin top, transition duration-1600ms ease-out,
  and then STAYS FIXED forever (never scroll-linked).
  targetFraction = ((bottom of node 4 relative to the top of the line container) / container height),
  measured with getBoundingClientRect after mount inside a requestAnimationFrame; store in state.
  Fallback if measurement fails: roadmap.currentSemester / roadmap.totalSemesters = 0.8? NO — use 0.75 only as last resort.
  Node centers: query all elements with attribute data-tl-node inside the container; node index currentSemester-1 is node 4.
- Items: map roadmap.semesters. Each item: relative pl-12 pb-12 last:pb-0.
  Node circle: absolute left-0 top-1 size-6 rounded-full border grid place-items-center, data-tl-node attribute,
    styles per status: done -> border-accent-line text-accent with ✓ glyph;
    current -> bg-accent text-accent-contrast border-accent font-bold with ● glyph;
    next -> border-line text-muted with ◇ glyph.
  When: mono [10px] tracking wide: left `SEMESTRE ${String(s.n).padStart(2,'0')} · ${s.year}`,
        right a status pill (rounded-full border px-2.5 py-1 mono text-[9px] tracking-[0.14em]):
          done -> "COMPLETADO" accent border/text; current -> "EN CURSO" solid bg-accent text-accent-contrast font-bold; next -> "PENDIENTE" muted.
  Title: font-display text-xl font-bold mt-2.
  Courses: flex flex-wrap gap-2 mt-3, chip rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted.

### 4. src/components/sections/Roadmap.test.jsx
- renders all five semester titles
- renders exactly one "EN CURSO" pill
- renders the sub-line containing career name and SCT count
- renders exactly 5 nodes (query by data-tl-node)

## ACCEPTANCE
Compiles under repo ESLint rules. No console.log. No unused vars. The progress bar must NOT be scroll-scrubbed anywhere in the implementation.
