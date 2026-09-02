import { useEffect, useRef } from 'react';
import { stack } from '../../data/profile';
import readmeRaw from '../../../README.md?raw';
import { prefersReducedMotion } from '../../lib/motion';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * StackWindow — the `stack` terminal command opens this arch window:
 * the technology groups on the left and the project README.md unfolding
 * line by line on the right, in the same live-write style as the
 * certificate viewer ledger. Escape / backdrop / [×] close it.
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

  // Escape closes; focus lands on the close button while open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => window.removeEventListener('keydown', onKey);
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
      onClick={onClose}
    >
      <div
        className="w-[min(980px,94vw)] overflow-hidden rounded-xl border border-[#504945] bg-[#1d2021] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* arch titlebar */}
        <div className="flex items-center gap-2.5 bg-[var(--gruv-bar)] px-3.5 py-2">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z" fill="#83a598" />
          </svg>
          <span className="font-mono text-xs text-[#ebdbb2]">
            <b>alex@archlinux</b>: ~/stack — readme.md
          </span>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            aria-label="cerrar stack"
            className="ml-auto font-mono px-2 text-[#ebdbb2] hover:text-[#fb4934]"
          >
            ×
          </button>
        </div>

        {/* stack ledger left · readme.md live-write right */}
        <div className="grid md:grid-cols-[300px_1fr]">
          <div
            className="border-b border-[#3c3836] p-5 font-mono text-[11px] leading-loose md:border-b-0 md:border-r"
            style={{ color: '#ebdbb2' }}
          >
            <p className="mb-3 text-[var(--gruv-green)]">$ cat ~/stack/*</p>
            {stack.map((group) => (
              <div key={group.group} className="mb-3">
                <p className="text-[var(--gruv-teal)]">{`$ ${group.group}`}</p>
                {group.items.map((item) => (
                  <p key={item} className="pl-3 text-[#928374]">{`· ${item}`}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="bg-black/20 p-4">
            <pre
              ref={preRef}
              className="cert-pre max-h-[52vh] overflow-y-auto whitespace-pre-wrap text-left"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
