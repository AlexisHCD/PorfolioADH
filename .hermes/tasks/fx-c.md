# Bloque C — Wire the global FX + GSAP reveal + animation hooks into App and each section

Repo: /home/alexdev/proyectos/Portfolio2Final
Model: opencode/hy3-free

## HARD RULES
- Touch ONLY the files listed below. No npm install. No git. No edits to other files.
- All the components (`Loader`, `Marquee`, `BgField`, `GrainScanlines`, `Regmarks`, `ScrollProgress`, `OverdriveSurge`, `DoomWindow`) and hooks (`useReveal`, `useMagnetic`, `useScramble`, `useSplitChars`, `useLenis`, `useKonami`) are already built.
- The CSS is already in `src/index.css` with all the selectors (`.loader`, `.marquee`, `.bg-field`, `.f-*`, `.grain`, `.scanlines`, `.regmark`, `.scroll-progress`, `.overdrive-flash`, `.hero-side`, `.bento`, `.card`, `.card-tag`, `.card-title`, `.card-sub`, `.now-row`, `.social-row`, `.panel`, `.panel-head`, `.chart-svg`, `.bar-row`, `.bar-fill`, `.stat-cell`, `.proj`, `.proj-ghost`, `.tl`, `.tl-line`, `.tl-progress`, `.tl-item`, `.tl-node`, `.tl-badge`, `.certs-row`, `.badge-seal`, `.badge-beam`, `.badge-arc`, `.arc-text`, `.badge-core`, `.badge-label`, `.contact`, `.contact-title`, `.contact-sub`, `.copy-btn`, `.contact-links`, `.ch-wrap`, `.ch`, `.sec-head`, `.sec-tag`, `.sec-title`, `.sec-line`, `.sec-desc`, `.hero-first`, `.hero-last`).
- The "data reveal" attribute should be `data-reveal`. The magnetic should be `data-magnetic`. The split should be `data-split`. The progress bar should be `data-progress="NN"` on a child span. The counter should be `data-count="NN"`. The bar fill should be `data-w="NN"`. The timeline node should be `data-tl-node` (the Roadmap component already uses this).
- DO NOT modify the `useTheme` or `useKonami` hooks. DO NOT modify the `DoomWindow` component. DO NOT modify the `ScrollProgress` or `OverdriveSurge` components. DO NOT modify `index.css`.
- `playSurgeChime` is already exported from `src/lib/sound.js` — use it for the Konami overdrive.

## STEP 1: WIRING IN `src/App.jsx`

Read the current `src/App.jsx` first, then modify it to:
1. Import and mount `<Loader onDone={() => setLoaded(true)} />` at the top of the page.
2. Mount `<GrainScanlines />` right after the loader.
3. Mount `<BgField />` (decorative layers go BEHIND content but at z-index 0; the existing AmbientField may stay or you may drop it — your call, whichever keeps the background richer).
4. Mount `<Marquee />` right after the `<header className="hero">` and before the `<main>`.
5. Keep `<ScrollProgress />` mounted.
6. Initialize Lenis via `useLenis()` so smooth scroll is active.
7. Set up the Konami listener: when sequence completes, call `setSurgeActive(true)` AND `playSurgeChime()`. Guard with `if (doomOpen || certOpen) return;`.
8. Mount `<OverdriveSurge active={surgeActive} onDone={...} />` somewhere near the top of the layout (after the loader, before the DoomWindow).
9. `useCallback` for `onSurgeDone` that flips `setSurgeActive(false)`.
10. Keep the existing `DoomWindow` mount at the bottom.
11. Keep the existing AmbientField if removing it breaks the visual.

Important: do NOT render the sections differently — they remain inside `<main>`. The wiring is just adding the wrapper components and the effects.

## STEP 2: ENHANCE `src/components/sections/Hero.jsx`

Read the current Hero. Add:
1. A `<div className="bg-halftone" aria-hidden="true" />`, `<div className="bg-ruler" aria-hidden="true" />`, `<span className="regmark reg-tl" aria-hidden="true" />`, `<span className="regmark reg-br" aria-hidden="true" />`, `<div className="glow glow-1" aria-hidden="true" />`, `<div className="glow glow-2" aria-hidden="true" />`, and `<aside className="hero-side" aria-hidden="true">ALEXDEV_OS · v2.0 — AHC · 2026</aside>` — these are the inner hero fx layers.
2. Use `useSplitChars` to split the two name lines (h1 has `<span data-split>Alexis</span>` and `<span data-split>Hernández</span>`). Render each character wrapped in `<span className="ch-wrap"><span className="ch">{ch}</span></span>`.
3. Add `data-reveal` to the outer hero `<header>` (it'll be revealed by ScrollTrigger on mount with `start: 'top top'`).
4. Add `data-magnetic` to the 3 hero CTAs.
5. Add a `<p className="scroll-hint">scroll <span className="arrow">↓</span></p>` at the bottom of the hero.

Use `useReveal(headerRef, { start: 'top top' })` for the hero (so it reveals when it enters).

## STEP 3: ENHANCE `src/components/sections/About.jsx`

1. Wrap the entire section in `useReveal`. Add `data-reveal` to the section root.
2. The progress bar in the ESTUDIO card already exists as inline Tailwind. Add a `data-progress` attribute and use `useReveal` so it animates its width when in view. Easier: leave the inline width but add a `gsap.fromTo` on the inner bar element. Or just attach `data-progress="70"` to the inner span (where 70 is `roadmap.progressPercent`) and ensure CSS uses `[data-progress]`. The CSS already has `.progress span { width: 0; }` — we'll change it to read `data-progress` attribute. Actually: keep it simple — just add `data-progress={`${roadmap.progressPercent}`}` to the inner span. The CSS rule below already targets this. Read mockups/phosphor.html lines 369-374 — `.progress span { display: block; height: 100%; width: 0%; background: var(--bar); border-radius: 4px }` and the JS does `gsap.to(el, { width: el.dataset.progress + '%', ... })`. In our setup, use `useReveal` or a one-shot effect.
3. Add `data-reveal` to each bento card.

## STEP 4: ENHANCE `src/components/sections/Stack.jsx`

1. Add `data-reveal` to the section root.
2. Replace the current inline bar layout with the mockup's `.panel .panel-head` + chips. The mockup has 4 panels: `lenguajes`, `frameworks & web`, `datos`, `herramientas & os`. Each panel has a `.panel-head` with a `.panel-title` containing `<b>$</b> <group-name>`, and a body with `.chips` (a flex of `.chip` spans).
3. Below the panels, add `<p className="stack-note">{'// certificaciones de la malla en camino: '}<b>aws</b> · <b>cisco</b> · <b>oracle</b></p>`.
4. Each panel gets `data-reveal` so it staggers in.
5. The data `stack` array in `src/data/profile.js` may need to be reshaped to match: `[{ group: 'lenguajes', items: ['C#', 'Python', ...] }, ...]`. If it's already in that shape, do not modify. If it's flat, add a tiny adapter or just hardcode the 4 groups inside the component (NOT preferred — keep data-driven).

## STEP 5: ENHANCE `src/components/sections/Activity.jsx`

1. Add `data-reveal` to the section root.
2. Wrap the heatmap in a `.panel` with `.panel-head` containing `.panel-title` with `<b>$</b> git log --contribuciones · @AlexisHCD` and a `.heat-legend` showing the 5 levels of the heatmap.
3. After the heatmap, add a `.act-grid` with 3 more `.panel` items:
   - Panel 1: `<svg className="chart-svg" viewBox="0 0 600 220">` with the curve from mockups/phosphor.html lines 478-485 (the area chart). Use a `useReveal` to animate the `stroke-dashoffset` from total length to 0.
   - Panel 2: `// repos --por-lenguaje` with 5 `.bar-row` items (Python, C#, JavaScript, Dart, Java) using `data-w` attribute.
   - Panel 3: `// stats` with 3 `.stat-cell` items (09 REPOS PÚBLICOS, 2025 EN GITHUB DESDE, ● ACTIVO ESTADO).
4. Each panel gets `data-reveal`.
5. Use a single `useReveal` to stagger all 3 panels and the heatmap.

## STEP 6: ENHANCE `src/components/sections/Projects.jsx`

1. Add `data-reveal` to each project card.
2. Add `<span className="proj-ghost">{p.num}</span>` inside each card so the giant outline number renders.
3. Add a `.proj-meta` row at the bottom: left side `.proj-repo` with the GitHub URL, right side `.proj-arrow` with `↗`. Both already have CSS.
4. The featured card uses `proj.span-2` (CSS class). Apply via `p.featured ? 'md:col-span-2' : ''` — already done.
5. Use `data-magnetic` on each card (project cards are full links).
6. Add a description with max-width via inline `style={{ maxWidth: '520px' }}` or a `max-w-[520px]` class.

## STEP 7: ENHANCE `src/components/sections/Roadmap.jsx`

1. The bar fill already animates on `useInView`. Keep it.
2. Add `data-reveal` to the section root.
3. Add the summary card at the end:
   ```jsx
   <div className="panel tl-summary" data-reveal>
     <div className="panel-head">
       <div className="panel-title"><b>$</b> career --progress</div>
       <span className="summary-pct"><span data-count={roadmap.progressPercent}>0</span>%</span>
     </div>
     <div className="summary-bar"><span data-progress={roadmap.progressPercent} /></div>
     <div className="progress-label">
       <span>3/5 SEMESTRES · PRÁCTICA PENDIENTE</span>
       <b>TÉCNICO EN 2027</b>
     </div>
   </div>
   ```

## STEP 8: ENHANCE `src/components/sections/Certificates.jsx`

1. Add `data-reveal` to the section root and to each `cert-badge-wrap`.
2. Ensure the `.certs-row` uses justify-center (already there).
3. The `CertificateBadge` already has its own structure. Just add `data-reveal` to the wrapper.

## STEP 9: ENHANCE `src/components/sections/Contact.jsx`

1. Add `data-reveal` to the section root.
2. Add `data-reveal` to the title, the sub copy, the copy button, and the social links.
3. Add `data-magnetic` to the copy button.

## STEP 10: `src/components/ui/Loader.jsx`

Update so when `onDone` is called, the parent can remove it from the tree. The current implementation hides via `display: none`. After `onDone`, set a state to `false` so the component returns `null` instead of `display: none`. Or keep `display: none` and just call onDone — your call. Test will not care since they just check the timer finishes.

## STEP 11: VERIFY

Do NOT run npm test or git. Report what you touched.

Reply with one line per file: path → short summary of changes.
