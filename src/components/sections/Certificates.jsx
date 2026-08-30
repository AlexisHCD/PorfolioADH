import { useEffect, useRef, useState } from 'react';
import { certificates } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import CertificateBadge from '../ui/CertificateBadge';

/**
 * // 06 Certificados — gruvbox-style badge seals that open an arch-frame viewer.
 *
 * Each badge is a self-contained seal; clicking one opens a centered arch-window
 * overlay that shows a typewriter-style ledger on the left and the certificate
 * image on the right. Escape / backdrop / close button all dismiss it.
 *
 * @param {object} props
 * @param {(open: boolean) => void} [props.onViewerOpenChange] - Fires when the
 *   viewer modal opens (true) or closes (false). Used by the parent to disable
 *   the Konami overdrive surge while a certificate is being inspected.
 */
export default function Certificates({ onViewerOpenChange = () => {} }) {
  const [selected, setSelected] = useState(null);
  const closeRef = useRef(null);

  // Close on Escape and focus the close button when the viewer opens.
  useEffect(() => {
    if (!selected) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);

    if (closeRef.current) closeRef.current.focus();

    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  // Lock body scroll while the viewer is open.
  useEffect(() => {
    if (!selected) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  // Notify parent (App) whenever the viewer opens/closes — used to gate
  // the Konami overdrive surge so it doesn't fire mid-inspection.
  useEffect(() => {
    onViewerOpenChange(Boolean(selected));
  }, [selected, onViewerOpenChange]);

  // Cleanup on unmount: ensure parent knows the viewer is gone.
  useEffect(() => () => onViewerOpenChange(false), [onViewerOpenChange]);

  const ledgerLines = selected
    ? [
        `> emisor ......... ${selected.issuer}`,
        `> curso .......... ${selected.course}`,
        selected.platform ? `> plataforma ..... ${selected.platform}` : null,
        `> fecha .......... ${selected.date}`,
        selected.verifyId ? `> verificación ... ${selected.verifyId}` : null,
        selected.signedBy ? `> firmado por .... ${selected.signedBy}` : null,
      ].filter(Boolean)
    : [];

  return (
    <section id="certificados" className="mx-auto max-w-6xl px-6 py-20 md:px-12">
      <SectionHead num="06" title="Certificados" />
      <p className="mt-4 text-muted">
        Formalización de lo aprendido — chapas verificables. Click para inspeccionarlas.
      </p>

      <div className="mt-16 flex flex-wrap justify-center gap-x-[clamp(40px,6vw,96px)] gap-y-10">
        {certificates.map((c) => (
          <div key={c.id} className="flex flex-col items-center gap-3.5">
            <CertificateBadge cert={c} onSelect={setSelected} />
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted">{c.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[9500] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl overflow-hidden rounded-xl border border-line"
            style={{ background: 'var(--gruv-bg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* top bar */}
            <div
              className="flex items-center gap-3 px-4 py-2.5"
              style={{ background: 'var(--gruv-bar)' }}
            >
              <svg width="14" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z" fill="#83a598" />
              </svg>
              <span className="font-mono text-xs" style={{ color: '#ebdbb2' }}>
                {`${selected.course} — visor de certificados`}
              </span>
              <button
                type="button"
                ref={closeRef}
                aria-label="cerrar visor"
                onClick={() => setSelected(null)}
                className="ml-auto font-mono text-base leading-none text-[#ebdbb2] hover:text-[#fb4934]"
              >
                [×]
              </button>
            </div>

            {/* body */}
            <div className="grid md:grid-cols-[300px_1fr]">
              <div
                className="whitespace-pre-wrap p-5 font-mono text-[11px] leading-loose"
                style={{ color: '#ebdbb2' }}
              >
                {ledgerLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              <div className="grid place-items-center bg-black/20 p-4">
                <img
                  src={selected.image}
                  alt={`${selected.course} certificate`}
                  className="max-h-[420px] w-auto rounded-md shadow-lg transition-transform duration-500 hover:scale-[1.04]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
