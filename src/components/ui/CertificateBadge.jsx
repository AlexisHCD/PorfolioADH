/**
 * CertificateBadge — round rotating seal button for a single certificate.
 *
 * Layers: rotating conic beam ring, dashed inner seal, curved SVG seal text
 * and a centered core column. Clicking the badge asks the parent to open the
 * arch-frame viewer via `onSelect`.
 *
 * @param {object} props
 * @param {object} props.cert - Certificate record from profile.js.
 * @param {(cert: object) => void} props.onSelect - Opens the viewer for `cert`.
 * @returns {JSX.Element}
 */
export default function CertificateBadge({ cert, onSelect }) {
  return (
    <button
      type="button"
      aria-label={`ver certificado ${cert.course}`}
      data-hover
      onClick={() => onSelect(cert)}
      className="group relative size-[176px] cursor-pointer rounded-full border border-line bg-ink-2 grid place-items-center transition-shadow will-change-transform hover:shadow-[0_0_44px_var(--accent-glow)]"
    >
      {/* a) rotating conic beam ring, masked to a thin outer ring */}
      <span
        className="animate-spin absolute -inset-[1.5px] rounded-full pointer-events-none group-hover:[animation-duration:1.6s]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0 72%, var(--accent) 88%, #b4ffe1 94%, transparent 100%)',
          animationDuration: '7s',
          WebkitMaskImage:
            'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))',
          maskImage:
            'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))',
        }}
      />

      {/* b) dashed inner seal */}
      <span className="absolute inset-2 rounded-full border border-dashed border-line transition-transform duration-[1400ms] group-hover:rotate-[135deg] group-hover:border-accent-line" />

      {/* c) curved seal text around the ring */}
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full pointer-events-none"
      >
        <defs>
          <path id={`arc-${cert.id}`} d="M60 60 m-45 0 a45 45 0 1 1 90 0" fill="none" />
        </defs>
        <text
          className="arc-seal-text"
          fill="var(--muted)"
          fontSize="9"
          letterSpacing="2"
          fontFamily="monospace"
          textAnchor="middle"
        >
          <textPath
            href={`#arc-${cert.id}`}
            startOffset="50%"
            textLength="138"
            lengthAdjust="spacingAndGlyphs"
          >
            {cert.sealText}
          </textPath>
        </text>
      </svg>

      {/* d) core column */}
      <span className="flex flex-col items-center gap-[5px]">
        <span className="font-mono text-[15px] text-muted">{cert.glyph}</span>
        <span className="font-mono text-[21px] font-bold tracking-[0.1em] text-text">
          {cert.issuer}
        </span>
        <span className="font-mono text-[9.5px] tracking-[0.34em] text-muted">2026</span>
      </span>
    </button>
  );
}
