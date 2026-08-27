import { useEffect } from 'react';
import { mountGsap, prefersReducedMotion, isFinePointer } from '../lib/motion';

/**
 * Magnetic hover: the element follows the cursor with a spring-back on leave.
 * No-op on coarse pointers (touch) or when reduced motion is requested.
 */
export function useMagnetic(
  ref,
  { strength = 0.32, ease = 'power3.out', duration = 0.4 } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!isFinePointer() || prefersReducedMotion()) return undefined;

    let cleanup = () => {};
    mountGsap().then(({ gsap }) => {
      if (!gsap) return;

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        gsap.to(el, { x, y, duration, ease });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' });
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanup = () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => cleanup();
  }, [ref, strength, ease, duration]);
}
