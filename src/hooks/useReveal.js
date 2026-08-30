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

/**
 * Reveal every element matching `selector` inside `ref`, each with its own
 * scroll trigger — mirrors the mockup's per-item (`[data-tl]`, badge wrap)
 * entrances. No-op when reduced motion is requested or GSAP is unavailable.
 */
export function useRevealGroup(
  ref,
  selector,
  { dx = 0, dy = 38, duration = 1, ease = 'power3.out', start = 'top 88%' } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) return undefined;

    let killed = false;
    const tweens = [];
    mountGsap().then(({ gsap, ScrollTrigger }) => {
      if (killed || !gsap) return;
      gsap.utils.toArray(el.querySelectorAll(selector)).forEach((target) => {
        // clearProps drops the inline transform once the entrance finishes so
        // stylesheet hover transforms (.proj:hover etc.) keep working
        const vars = { x: dx, y: dy, autoAlpha: 0, duration, ease, clearProps: 'all' };
        if (gsap !== stubGsap) {
          vars.scrollTrigger = { trigger: target, start, once: !!ScrollTrigger };
        }
        tweens.push(gsap.from(target, vars));
      });
    });

    return () => {
      killed = true;
      tweens.forEach((t) => t.kill && t.kill());
    };
  }, [ref, selector, dx, dy, duration, ease, start]);
}
