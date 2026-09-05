import { useEffect, useRef, useState } from 'react';
import { certificates } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import CertificateBadge from '../ui/CertificateBadge';
import { useRevealGroup } from '../../hooks/useReveal';
import { mountGsap, prefersReducedMotion } from '../../lib/motion';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TYPE_CHAR_MS = 13;
const TYPE_LINE_PAUSE_MS = 150;

/**
 * // 06 Certificados — gruvbox-style badge seals that open an arch-frame viewer.
 *
 * Badges reveal on scroll and tilt in 3D on hover; clicking one opens the
 * arch-window viewer with a clip-path circle reveal expanding from the badge
 * itself, a typewriter ledger on the left and the certificate image on the
 * right (hover zoom via CSS). The titlebar is draggable.
 * Escape / backdrop / close button all dismiss it.
 *
 * @param {object} props
 * @param {(open: boolean) => void} [props.onViewerOpenChange] - Fires when the
 *   viewer modal opens (true) or closes (false). Used by the parent to disable
 *   the Konami overdrive surge while a certificate is being inspected.
 */
export default function Certificates({ onViewerOpenChange = () => {} }) {
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);
  const closeRef = useRef(null);
  const preRef = useRef(null);
  const winRef = useRef(null);
  const titlebarRef = useRef(null);
  const typeToken = useRef(0);
  // the badge that opened the viewer — focus returns to it on close
  const originRef = useRef(null);

  useRevealGroup(sectionRef, '.cert-badge-wrap', { dy: 38, duration: 1 });

  const closeViewer = () => {
    const origin = originRef.current;
    setSelected(null);
    // hand focus back to the opening badge so keyboard flow isn't dropped
    requestAnimationFrame(() => origin?.focus?.());
  };

  // Close on Escape and focus the close button when the viewer opens.
  useEffect(() => {
    if (!selected) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
    };
    window.addEventListener('keydown', onKey);

    // defer focus — see StackWindow: synchronous focus would let the opening
    // Enter keydown's default action click the close button
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
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

  // Typewriter ledger — types the certificate lines into the viewer <pre>
  // character by character (mockup parity). Writes go straight to the DOM
  // node (no per-keystroke re-render); bumping the token cancels the run.
  useEffect(() => {
    if (!selected) return undefined;
    const pre = preRef.current;
    if (!pre) return undefined;

    const token = ++typeToken.current;
    const lines = selected.cert.ledger ?? [];
    const reduced = prefersReducedMotion();

    const type = async () => {
      pre.textContent = '';
      for (const line of lines) {
        if (token !== typeToken.current) return;
        if (reduced) {
          pre.textContent += `${line}\n`;
          await sleep(30);
          continue;
        }
        for (const ch of line) {
          if (token !== typeToken.current) return;
          pre.textContent += ch;
          await sleep(TYPE_CHAR_MS);
        }
        pre.textContent += '\n';
        await sleep(TYPE_LINE_PAUSE_MS);
      }
      if (token === typeToken.current) {
        pre.textContent += '\nestado ......... ✓ verificado\n';
      }
    };
    type();

    return () => {
      typeToken.current += 1;
    };
  }, [selected]);

  // Clip-path circle reveal expanding from the clicked badge (mockup parity).
  // No-op with reduced motion — the overlay simply appears fully revealed.
  useEffect(() => {
    if (!selected) return undefined;
    const win = winRef.current;
    if (!win) return undefined;
    if (prefersReducedMotion()) return undefined;

    let killed = false;
    let tween;
    mountGsap().then(({ gsap }) => {
      if (killed || !gsap || !winRef.current) return;
      const overlay = win.parentElement;
      const wr = win.getBoundingClientRect();
      const br = selected.origin ? selected.origin.getBoundingClientRect() : null;
      const x = br ? br.left + br.width / 2 - wr.left : wr.width / 2;
      const y = br ? br.top + br.height / 2 - wr.top : wr.height / 2;
      const r = Math.hypot(Math.max(x, wr.width - x), Math.max(y, wr.height - y)) + 40;
      win.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
      tween = gsap.to(win, {
        clipPath: `circle(${r}px at ${x}px ${y}px)`,
        duration: 0.75,
        ease: 'power3.out',
        onComplete: () => {
          win.style.clipPath = '';
        },
      });
    });

    return () => {
      killed = true;
      if (tween) tween.kill();
    };
  }, [selected]);

  // Drag the viewer window by its titlebar (pointer capture, mockup parity).
  useEffect(() => {
    if (!selected) return undefined;
    const bar = titlebarRef.current;
    const win = winRef.current;
    if (!bar || !win) return undefined;

    let dragging = false;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;

    const onDown = (e) => {
      if (e.target.closest('.arch-x')) return;
      dragging = true;
      const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(win.style.transform || '');
      ox = m ? parseFloat(m[1]) : 0;
      oy = m ? parseFloat(m[2]) : 0;
      sx = e.clientX;
      sy = e.clientY;
      bar.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      win.style.transform = `translate(${ox + e.clientX - sx}px, ${oy + e.clientY - sy}px)`;
    };
    const onUp = () => {
      dragging = false;
    };

    bar.addEventListener('pointerdown', onDown);
    bar.addEventListener('pointermove', onMove);
    bar.addEventListener('pointerup', onUp);
    bar.addEventListener('pointercancel', onUp);
    return () => {
      bar.removeEventListener('pointerdown', onDown);
      bar.removeEventListener('pointermove', onMove);
      bar.removeEventListener('pointerup', onUp);
      bar.removeEventListener('pointercancel', onUp);
      win.style.transform = '';
    };
  }, [selected]);

  return (
    <section
      id="certificados"
      ref={sectionRef}
      className="mx-auto max-w-[1240px] px-6 py-[clamp(90px,12vh,150px)] md:px-12"
    >
      <SectionHead num="06" title="Certificados" />
      <p className="mt-4 text-muted">
        Formalización de lo aprendido — chapas verificables. Click para inspeccionarlas.
      </p>

      <div className="certs-row">
        {certificates.map((c) => (
          <div key={c.id} className="cert-badge-wrap">
            <CertificateBadge
              cert={c}
              onSelect={(cert, origin) => {
                originRef.current = origin ?? null;
                setSelected({ cert, origin });
              }}
            />
            <span className="badge-label">{c.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div
          id="certOverlay"
          role="dialog"
          aria-label="visor de certificados"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeViewer();
          }}
        >
          <div ref={winRef} className="cert-win">
            {/* arch titlebar — draggable */}
            <div ref={titlebarRef} className="archbar cert-titlebar">
              <svg className="arch-logo" viewBox="0 0 16 16" aria-hidden="true">
                <path fill="#83a598" d="M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z" />
              </svg>
              <span className="arch-title">
                <b>alex@archlinux</b>: ~/certificados/{selected.cert.image.split('/').pop()} — zathura
              </span>
              <button
                type="button"
                ref={closeRef}
                className="arch-x"
                data-hover
                aria-label="cerrar visor"
                onClick={closeViewer}
              >
                [×]
              </button>
            </div>

            {/* body — typewriter ledger left, certificate image right */}
            <div className="cert-body">
              <div className="cert-left" data-lenis-prevent="true">
                <pre ref={preRef} className="cert-pre" />
              </div>
              <div className="cert-right">
                <img
                  src={selected.cert.image}
                  alt={`certificado ${selected.cert.course}`}
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
