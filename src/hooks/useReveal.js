import { useEffect } from 'react';
import { mountGsap, prefersReducedMotion, stubGsap } from '../lib/motion';

/**
 * Reveal an element on scroll using GSAP + ScrollTrigger.
 * With `immediate: true` the tween plays on mount instead of waiting for a
 * scroll trigger — required for elements inside the initial viewport (the
 * ScrollTrigger initial refresh does not auto-play already-satisfied starts
 * like `top top` when the page loads at scroll 0).
 * No-op when reduced motion is requested or GSAP is unavailable.
 */
export function useReveal(
  ref,
  { y = 38, opacity = 0, duration = 1, ease = 'power3.out', start = 'top 88%', once = true, immediate = false } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) return undefined;

    let killed = false;
    let tween;
    mountGsap().then(({ gsap, ScrollTrigger }) => {
      if (killed || !gsap) return;
      const vars = { y, autoAlpha: 0, duration, ease };
      if (!immediate && gsap !== stubGsap) {
        vars.scrollTrigger = { trigger: el, start, once: once && !!ScrollTrigger };
      }
      tween = gsap.from(el, vars);
    });

    return () => {
      killed = true;
      if (tween && tween.kill) tween.kill();
    };
  }, [ref, y, opacity, duration, ease, start, once, immediate]);
}
