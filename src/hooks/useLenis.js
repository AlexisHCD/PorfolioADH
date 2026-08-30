import { useEffect, useRef } from 'react';
import { mountGsap, prefersReducedMotion } from '../lib/motion';

/**
 * Module-level store for the live Lenis instance, so non-hook code (e.g. the
 * router's scroll controller) can drive programmatic scrolls through Lenis
 * instead of fighting its raf loop with native scrolling.
 */
export const lenisStore = { current: null };

/**
 * Smooth-scroll controller powered by Lenis (optional dependency). Wires Lenis
 * into GSAP's ticker so ScrollTrigger stays in sync. Returns a ref holding the
 * Lenis instance (or `null` if Lenis/GSAP are unavailable). Never throws.
 */
export function useLenis({ duration = 1.15 } = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let cancelled = false;
    let lenis;
    let gsapInst;
    let raf;

    (async () => {
      const motion = await mountGsap();
      if (cancelled || !motion.gsap) return;
      gsapInst = motion.gsap;

      let Lenis;
      try {
        Lenis = (await import('lenis')).default;
      } catch {
        return; // Lenis not installed — silent no-op
      }
      if (cancelled) return;

      lenis = new Lenis({ duration });
      lenisRef.current = lenis;
      lenisStore.current = lenis;
      if (motion.ScrollTrigger) {
        lenis.on('scroll', () => motion.ScrollTrigger.update());
      }
      raf = (t) => lenis.raf(t * 1000);
      gsapInst.ticker.add(raf);
      gsapInst.ticker.lagSmoothing(0);
    })();

    return () => {
      cancelled = true;
      if (lenis) {
        lenis.destroy && lenis.destroy();
        lenis.stop && lenis.stop();
      }
      if (gsapInst && raf && gsapInst.ticker.remove) gsapInst.ticker.remove(raf);
      lenisRef.current = null;
      lenisStore.current = null;
    };
  }, [duration]);

  return lenisRef;
}
