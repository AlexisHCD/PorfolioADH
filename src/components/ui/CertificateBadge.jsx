import { useEffect, useRef } from 'react';
import { isFinePointer, mountGsap, prefersReducedMotion } from '../../lib/motion';

/**
 * CertificateBadge — round rotating seal button for a single certificate.
 *
 * Visuals come from the ported mockup CSS (.cert-badge / .badge-beam /
 * .badge-seal / .badge-arc / .badge-core): the beam ring spins via a CSS
 * animation that honors `--beam-speed` (Konami surge) and accelerates on
 * hover, the dashed seal rotates 135°, and arc/core colors shift to the
 * accent. A GSAP 3D tilt (desktop, motion-safe) is layered on top with an
 * elastic return.
 *
 * @param {object} props
 * @param {object} props.cert - Certificate record from profile.js.
 * @param {(cert: object, origin?: Element) => void} props.onSelect - Opens the
 *   viewer for `cert`; receives the badge element so the viewer can reveal
 *   with a circle expand from it.
 * @returns {JSX.Element}
 */
export default function CertificateBadge({ cert, onSelect }) {
  const ref = useRef(null);

  // 3D tilt tracking the cursor, elastic snap-back on leave (mockup parity).
  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return undefined;

    let cleanup = () => {};
    mountGsap().then(({ gsap }) => {
      if (!gsap) return;

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, {
          rotateY: dx * 16,
          rotateX: -dy * 16,
          transformPerspective: 520,
          duration: 0.35,
          ease: 'power2.out',
        });
      };
      const onLeave = () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanup = () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => cleanup();
  }, [ref]);

  return (
    <button
      type="button"
      ref={ref}
      aria-label={`ver certificado ${cert.course}`}
      data-hover
      onClick={(e) => onSelect(cert, e.currentTarget)}
      className="cert-badge"
    >
      {/* rotating conic beam ring, masked to a thin outer ring */}
      <span className="badge-beam" />

      {/* dashed inner seal */}
      <span className="badge-seal" />

      {/* curved seal text around the ring */}
      <svg className="badge-arc" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id={`arc-${cert.id}`} d="M60 60 m-45 0 a45 45 0 1 1 90 0" fill="none" />
        </defs>
        <text className="arc-text">
          <textPath
            href={`#arc-${cert.id}`}
            startOffset="50%"
            textAnchor="middle"
            textLength="138"
            lengthAdjust="spacingAndGlyphs"
          >
            {cert.sealText}
          </textPath>
        </text>
      </svg>

      {/* core column */}
      <span className="badge-core">
        <span className="g">{cert.glyph}</span>
        <span className="org">{cert.issuer}</span>
        <span className="y">2026</span>
      </span>
    </button>
  );
}
