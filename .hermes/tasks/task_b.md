# TASK: Build Stack (mono-charts) + Activity (heatmap) sections

You are working inside an existing Vite + React 19 + Tailwind v4 project (JavaScript, NO TypeScript).
Repo root: /home/alexdev/proyectos/Portfolio2Final

## HARD RULES
- Create ONLY the files listed below. Do NOT modify any other file.
- No git commands, no npm install, no new dependencies.
- All content text comes from `src/data/profile.js` imports (stack, activitySeed).
- Code and comments in English. Functional components only. Tailwind utilities allowed.
- Style reference: read `src/components/ui/SectionHead.jsx` and `src/components/sections/About.jsx` first.
- SVG must be hand-rolled inline (no chart library). Deterministic output from activitySeed — no Math.random at render.

## FILES TO CREATE

### 1. src/components/sections/Stack.jsx
Section id="stack". Uses SectionHead num="02" title="Stack".
Renders `stack` groups from profile.js as horizontal bar rows (mono-charts style):
- For each group: group name (mono, small, accent) then one row per item:
  label left (mono, muted, fixed min-width), track bar (flex-1 h-[6px] rounded bg-[var(--line)])
  with inner fill span bg-accent rounded, width computed deterministically:
  width = 35 + ((index of item within its group * 13 + group index * 7) % 60)  → gives 35–94%.
- Bars animate on scroll into view using an IntersectionObserver in a small hook you create:

### 2. src/hooks/useInView.js
`useInView(ref, options)` returns boolean started=false until the element intersects once
(threshold 0.3, fire once, disconnect after). Handle missing IntersectionObserver by returning true immediately.
JSDoc the hook.

### 3. src/components/sections/Activity.jsx
Section id="actividad". Uses SectionHead num="03" title="Actividad".
GitHub-style contribution heatmap, deterministic pseudo-random from activitySeed:
- Implement mulberry32 seeded PRNG (tiny helper function with comment) seeded with activitySeed.
- Grid: 26 weeks x 7 days = 182 cells, each cell a 12px rounded-[3px] square, gap 3px, rendered as CSS grid grid-flow-col grid-rows-7.
- Intensity levels 0-4 mapped to colors via inline style backgroundColor using rgba(0,255,156,x) where x = [0.04,0.15,0.28,0.45,0.75][level]; level derived from prng(): level = floor(rand()*5) but weighted so ~40% are level 0-1.
- Cell title attribute: `actividad nivel ${level}` (accessibility).
- Below the grid: summary line "182 días · consistencia > intensidad" (hardcode allowed, structural copy) in mono muted text-xs, plus a legend row: five swatches (same colors) labeled "menos" ... "más".
- Wrap grid in overflow-x-auto for mobile.

### 4. Tests

#### src/components/sections/Stack.test.jsx
- renders every group name and every item label from stack data
- renders SectionHead title "Stack"

#### src/components/sections/Activity.test.jsx
- renders 182 cells (query all cells via data-testid="hm-cell")
- renders the legend words "menos" and "más"

## ACCEPTANCE
Compiles under repo ESLint rules. No console.log. No unused vars. Deterministic renders (two renders produce identical DOM).
