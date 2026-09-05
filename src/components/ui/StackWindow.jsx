import { useEffect, useRef } from 'react';
import readmeRaw from '../../../README.md?raw';
import { prefersReducedMotion } from '../../lib/motion';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * StackWindow — the `stack` terminal command opens this arch window with the
 * project README.md unfolding line by line (same live-write style as the
 * certificate viewer ledger). Reuses the ported .cert-win chrome (capped
 * height, so the titlebar never slides under the navbar). Escape / backdrop /
 * [×] close it.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @returns {JSX.Element | null}
 */
export default function StackWindow({ open, onClose }) {
  const preRef = useRef(null);
  const closeRef = useRef(null);
  const typeToken = useRef(0);

  // Escape closes; focus lands on the close button while open (deferred —
  // focusing synchronously during the opening Enter dispatch would let its
  // default action click the button and close the window instantly).
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Lock body scroll while the window is up.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Live-write the README line by line; bumping the token cancels.
  useEffect(() => {
    if (!open) return undefined;
    const pre = preRef.current;
    if (!pre) return undefined;
    const token = ++typeToken.current;
    const reduced = prefersReducedMotion();
    const lines = readmeRaw.split('\n');
    pre.textContent = '';

    (async () => {
      for (const line of lines) {
        if (token !== typeToken.current) return;
        pre.textContent += `${line}\n`;
        if (!reduced) {
          pre.scrollTop = pre.scrollHeight;
          await sleep(line.trim() ? 24 : 10);
        }
      }
    })();

    return () => {
      typeToken.current += 1;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9600] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-label="stack del sistema"
      data-lenis-prevent
      onClick={onClose}
    >
      <div
        className="cert-win flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* arch titlebar */}
        <div className="archbar cert-titlebar">
          <svg className="arch-logo" viewBox="0 0 16 16" aria-hidden="true">
            <path fill="#83a598" d="M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z" />
          </svg>
          <span className="arch-title">
            <b>alex@archlinux</b>: ~/stack — readme.md
          </span>
          <button
            type="button"
            ref={closeRef}
            className="arch-x"
            data-hover
            aria-label="cerrar stack"
            onClick={onClose}
          >
            [×]
          </button>
        </div>

        {/* full-width README, mouse-wheel scrollable */}
        <div className="h-full min-h-0 overflow-y-auto" data-lenis-prevent>
          <pre ref={preRef} className="cert-pre p-5" />
        </div>
      </div>
    </div>
  );
}
