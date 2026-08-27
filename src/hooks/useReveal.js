import { useEffect } from 'react';
import { mountGsap, prefersReducedMotion } from '../lib/motion';

/**
 * Reveal an element on scroll using GSAP + ScrollTrigger.
 * No-op when reduced motion is requested or GSAP is unavailable.
 */
export function useReveal(
  ref,
  { y = 38, opacity = 0, duration = 1, ease = 'power3.out', start = 'top 88%', once = true } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) return undefined;

    let killed = false;
    let tween;
    mountGsap().then(({ gsap, ScrollTrigger }) => {
      if (killed || !gsap) return;
      tween = gsap.from(el, {
        y,
        autoAlpha: 0,
        duration,
        ease,
        scrollTrigger: { trigger: el, start, once: once && !!ScrollTrigger },
      });
    });

    return () => {
      killed = true;
      if (tween && tween.kill) tween.kill();
    };
  }, [ref, y, opacity, duration, ease, start, once]);
}
