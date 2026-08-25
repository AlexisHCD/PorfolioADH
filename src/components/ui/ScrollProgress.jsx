import { useEffect, useRef } from 'react';

/**
 * Fixed hairline beam at the viewport top showing page scroll progress.
 * Pure DOM write on scroll (no state) so it never triggers React re-renders.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9500] h-[2px] w-0 bg-accent shadow-[0_0_12px_var(--accent-glow)]"
    />
  );
}
