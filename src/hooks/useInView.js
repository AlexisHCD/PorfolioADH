import { useEffect, useState } from 'react';

/**
 * Observe a DOM node and report the first time it scrolls into view.
 *
 * The returned flag starts `false` and flips to `true` exactly once after the
 * element intersects the viewport (threshold 0.3). The observer disconnects
 * immediately after firing, so re-entering the viewport does not re-trigger.
 * Environments without `IntersectionObserver` (e.g. some test runners) resolve
 * to `true` synchronously so content is never hidden.
 *
 * @param {React.RefObject<Element>} ref - The element to observe.
 * @param {Object} [options] - IntersectionObserver options (threshold default 0.3).
 * @param {number} [options.threshold=0.3] - Visibility ratio required to fire.
 * @returns {boolean} `true` once the element has been seen, otherwise `false`.
 */
export function useInView(ref, options = {}) {
  const { threshold = 0.3 } = options;
  const [inView, setInView] = useState(() => {
    if (typeof IntersectionObserver === 'undefined') return true;
    return false;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}
