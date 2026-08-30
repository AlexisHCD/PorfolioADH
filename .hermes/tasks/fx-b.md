# Bloque B — Hooks + global UI components (no wiring yet)

Repo: /home/alexdev/proyectos/Portfolio2Final
Model: opencode/hy3-free

## HARD RULES
- Touch ONLY the files listed in this brief. No npm install. No git. No edits to other files.
- GSAP is already available (Vite app) — use `import { gsap } from 'gsap'` directly. If GSAP is not yet installed, write hooks to import a stub from `src/lib/motion.js` that exports `gsapLike` with `gsap.from(target, vars)`, `gsap.to(target, vars)`, `gsap.fromTo`, `gsap.timeline`, `gsap.delayedCall`, `gsap.utils.toArray`, `gsap.killTweensOf`, `gsap.registerPlugin`, `gsap.ticker` — implement these as no-op wrappers that warn once in dev. The actual `src/lib/motion.js` will be replaced when GSAP is wired in Bloque C.
- Tests must be Vitest + @testing-library/react style consistent with `src/components/sections/Hero.test.jsx` and `src/hooks/useTheme.test.js` in this repo.
- The `index.css` from Bloque A already has `.scroll-progress`, `.overdrive-flash`, `.grain`, `.scanlines`, `.bg-field`, `.f-*`, `.regmark`, `.marquee`, `.loader`, `.term`, etc. The new components just render the right structure; CSS does the styling.

## STEP 1: PREP the motion helper

Create `src/lib/motion.js` exporting:
- `prefersReducedMotion()` returning boolean (SSR-safe: if typeof window === 'undefined' return false).
- `isFinePointer()` returning boolean (SSR-safe).
- `killAll(gsap, targets)` — kills tweens of an array of targets.
- `mountGsap()` — try-imports `gsap` and `ScrollTrigger` from 'gsap' and 'gsap/ScrollTrigger'. Returns `{ gsap, ScrollTrigger }` or `null` if not installed yet. Logs once on import failure.

If GSAP is not yet installed, also stub a `gsap` object inside the same file that supports `.from`, `.to`, `.fromTo`, `.timeline()`, `.delayedCall`, `.utils.toArray`, `.killTweensOf`, `.registerPlugin`, `.ticker.add`, `.ticker.lagSmoothing`, `.getById`, `.set` — all no-op with the right call shape so hooks can run without crashing during tests. Tests should be able to render components without GSAP installed.

## STEP 2: HOOKS

### 2.1 `src/hooks/useReveal.js`
Signature: `useReveal(ref, { y = 38, opacity = 0, duration = 1, ease = 'power3.out', start = 'top 88%', once = true } = {})`
On mount: if reduced motion OR no GSAP, do nothing. Otherwise:
- `gsap.from(el, { y, autoAlpha: 0, duration, ease, scrollTrigger: { trigger: el, start, once } })`
- return cleanup that kills the tween.

### 2.2 `src/hooks/useMagnetic.js`
Signature: `useMagnetic(ref, { strength = 0.32, ease = 'power3.out', duration = 0.4 } = {})`
On mousemove: `gsap.to(el, { x: (e.clientX - r.left - r.width/2) * strength, y: ..., duration, ease })`.
On mouseleave: spring back with `gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' })`.
No-op if !finePointer OR reduced.

### 2.3 `src/hooks/useScramble.js`
Signature: `useScramble({ text, duration = 1100, runKey = 0, glyphs = '!<>-_\\/[]{}=+*^?#' } = { text: '' })`
Returns a `display` string. On every `runKey` change (or mount), animate the displayed string from random glyphs → final `text` over `duration` ms using requestAnimationFrame. If reduced motion, return `text` immediately.
The function should be a hook that returns the current string state, not a callable.

### 2.4 `src/hooks/useSplitChars.js`
Signature: `useSplitChars(text = '')`
Returns an array of `{ ch, key }` where `ch` is the character (or `'\u00A0'` for spaces) and `key` is the stable index. Useful for rendering `<span class="ch-wrap"><span class="ch">{ch}</span></span>`.

### 2.5 `src/hooks/useLenis.js`
Signature: `useLenis({ duration = 1.15 } = {})` returns a `lenis` ref (or null if not present).
On mount: try-import `Lenis` from 'lenis' (optional dep). If present and not reduced, instantiate Lenis, wire `lenis.on('scroll', () => ScrollTrigger.update())`, add `gsap.ticker.add((t) => lenis.raf(t * 1000))` and `gsap.ticker.lagSmoothing(0)`. Cleanup: stop and destroy lenis on unmount.
If Lenis or GSAP not installed, return null silently (no crash). Don't throw.

### 2.6 `src/hooks/useKonami.js` already exists at src/hooks/useKonami.js — DO NOT TOUCH.

## STEP 3: GLOBAL UI COMPONENTS

### 3.1 `src/components/ui/Loader.jsx`
Renders a fixed-position overlay covering the viewport with the markup that matches `index.css`:
```jsx
<div className="loader" id="loader">
  <div className="loader-inner">
    <div className="loader-tag">// PORTFOLIO v2.0 — ALEXDEV_OS</div>
    <div className="loader-name">
      <span id="loaderScramble">ALEXIS_HCD</span><span className="tick">_</span>
    </div>
  </div>
  <div className="loader-count"><span id="loaderPct">000</span></div>
  <div className="loader-bar" id="loaderBar" />
</div>
```
Behavior: on mount, run a self-correcting `setInterval` (33ms) that fills a counter 0..100 and the bar width over 2000ms (`LOADER_MS = 2000`). Also run a `setInterval` every 520ms that re-scrambles the loader text between `['ALEXIS_HCD', 'ALEXDEV_OS', 'INIT_MODULES', 'ALEXIS_HCD']` using the `useScramble` hook (or its own logic).
After the counter hits 100, wait 60ms, then animate `transform: translateY(-100%)` over 900ms with cubic-bezier(.7,0,.2,1) and `setTimeout(1000)` to set `display: none`.
Failsafe: if after 6000ms the counter is not done, force-finish and hide.
After hiding, call `onDone?.()` once.
Props: `{ onDone? }` — called after hide completes.

Test: render with `vi.useFakeTimers()`, advance time, assert the loader element has `display: none` after 3000ms.

### 3.2 `src/components/ui/Marquee.jsx`
A simple horizontal scrolling strip.
Markup: `<div className="marquee" aria-hidden="true"><div className="marquee-track" id="marqueeTrack"><span>INTELIGENCIA ARTIFICIAL // TECNOLOGÍA // LINUX // OPEN SOURCE // DESARROLLO WEB // ANÁLISIS DE SISTEMAS // TERMINAL // FULLSTACK //&nbsp;</span></div></div>`
On mount, in `useEffect`, clone the inner `<span>` and append it to the track so the animation can loop seamlessly.

Test: render, assert the track has 2 `<span>` children after mount.

### 3.3 `src/components/layout/BgField.jsx`
A `<div className="bg-field" aria-hidden="true">` containing:
- `<div className="f-halftone" />`
- `<div className="f-ruler" />`
- `<div className="f-ruler r" />`
- `<div className="f-glow f-g1" />`
- `<div className="f-glow f-g2" />`
- `<div className="f-glow f-g3" />`
- `<div className="f-glow f-g4" />`

Test: render, assert 7 children (1 halftone + 2 rulers + 4 glows).

### 3.4 `src/components/layout/GrainScanlines.jsx`
Two siblings:
- `<div className="grain" />`
- `<div className="scanlines" />`

Test: render, assert both nodes present.

### 3.5 `src/components/layout/Regmarks.jsx`
Two siblings with the same CSS as the mockup (lines 184-186 of phosphor.html):
- `<span className="regmark reg-tl" />`
- `<span className="regmark reg-br" />`

Test: render, assert 2 regmarks.

### 3.6 `src/components/ui/ScrollProgress.jsx` already exists — DO NOT TOUCH.

### 3.7 `src/components/ui/OverdriveSurge.jsx` already exists — DO NOT TOUCH.

## STEP 4: SCSS-LEVEL SANITY

After all files written, do NOT run npm test. Just report what you created and how many lines each file has.

Reply with one line per file: path → lines. Total 8 new files (1 motion lib + 5 hooks + 3 components; one hook `useKonami` is already there, three other components are already there).
