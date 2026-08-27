// Motion helper: bridges GSAP + ScrollTrigger (installed in this Vite app) with a
// no-op stub fallback so hooks/components render safely in tests or before wiring.

let _warned = false;
function warnOnce(msg) {
  if (_warned) return;
  _warned = true;
  if (typeof console !== 'undefined') console.warn(msg);
}

/** SSR-safe check for the user's reduced-motion preference. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** SSR-safe check for a fine pointer (mouse/trackpad) vs coarse (touch). */
export function isFinePointer() {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(pointer: fine)').matches;
}

/** Kill every tween attached to the given array of targets. */
export function killAll(gsap, targets) {
  if (!gsap || !targets) return;
  targets.forEach((t) => gsap.killTweensOf && gsap.killTweensOf(t));
}

// --- No-op stub used when GSAP is not installed -----------------------------
const _stubTimeline = () => ({
  from: () => _stubTimeline(),
  to: () => _stubTimeline(),
  fromTo: () => _stubTimeline(),
  set: () => _stubTimeline(),
  add: () => _stubTimeline(),
  play: () => _stubTimeline(),
  kill: () => _stubTimeline(),
});

export const stubGsap = {
  from: () => {},
  to: () => {},
  fromTo: () => {},
  set: () => {},
  timeline: () => _stubTimeline(),
  delayedCall: () => ({ kill: () => {} }),
  utils: {
    toArray: (t) =>
      typeof t === 'string'
        ? typeof document !== 'undefined'
          ? Array.from(document.querySelectorAll(t))
          : []
        : Array.isArray(t)
          ? t
          : t
            ? [t]
            : [],
  },
  killTweensOf: () => {},
  registerPlugin: () => {},
  getById: () => null,
  ticker: { add: () => {}, remove: () => {}, lagSmoothing: () => {} },
};

// Module-level cache so the real GSAP is only imported once.
let _motionPromise = null;
let _gsap = stubGsap;
let _ScrollTrigger = null;
let _resolved = false;

/**
 * Try to load GSAP + ScrollTrigger. Returns `{ gsap, ScrollTrigger }` or
 * `null` if GSAP is not installed. Once resolved, `_gsap` is the real
 * instance (or the stub on failure) so synchronous callers still work.
 */
export function mountGsap() {
  if (_motionPromise) return _motionPromise;
  _motionPromise = (async () => {
    try {
      const g = await import('gsap');
      const st = await import('gsap/ScrollTrigger');
      const gsap = g.gsap || g.default;
      const ScrollTrigger = st.ScrollTrigger || st.default;
      gsap.registerPlugin(ScrollTrigger);
      _gsap = gsap;
      _ScrollTrigger = ScrollTrigger;
    } catch {
      _gsap = stubGsap;
      _ScrollTrigger = null;
      warnOnce('[motion] GSAP not installed — using no-op stub.');
    } finally {
      _resolved = true;
    }
    return { gsap: _gsap, ScrollTrigger: _ScrollTrigger };
  })();
  return _motionPromise;
}

/** Synchronous accessor for the currently active gsap (real or stub). */
export function getGsap() {
  return _gsap;
}
