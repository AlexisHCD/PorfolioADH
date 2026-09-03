import { useCallback, useEffect, useRef, useState } from 'react';
import usePointerLockStatus from '../../hooks/usePointerLockStatus';

/**
 * Arch-window DOOM launcher. Wraps the webprboom WASM payload served at
 * /doom/doom1/doom1.html in the gruvbox window chrome and fixes the mockup-era
 * pointer-lock / focus / audio / quit issues.
 *
 * @param {object} props
 * @param {boolean} [props.open=true]
 * @param {() => void} props.onClose
 * @returns {JSX.Element | null}
 */
export default function DoomWindow({ open = true, onClose }) {
  const frameRef = useRef(null);
  const winRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, ox: 0, oy: 0 });
  const onCloseRef = useRef(onClose);
  const [showQuit, setShowQuit] = useState(false);

  const status = usePointerLockStatus(frameRef);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const refocus = useCallback(() => {
    try {
      frameRef.current?.focus();
      frameRef.current?.contentWindow?.focus();
    } catch {
      /* cross-origin safety */
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.active || !winRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    winRef.current.style.transform = `translate(${dragRef.current.ox + dx}px, ${dragRef.current.oy + dy}px)`;
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove]);

  const onTitlePointerDown = useCallback(
    (e) => {
      if (e.button !== 0 || e.target.closest('button')) return;
      dragRef.current.active = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      const t = winRef.current?.style.transform || '';
      const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(t);
      dragRef.current.ox = m ? parseFloat(m[1]) : 0;
      dragRef.current.oy = m ? parseFloat(m[2]) : 0;
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [onPointerMove, onPointerUp],
  );

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  const patchAudio = (win) => {
    try {
      const AC = win.AudioContext || win.webkitAudioContext;
      if (!AC) return;
      const guard = (win.__alexdevosAudioGuard = win.__alexdevosAudioGuard || new WeakSet());
      const patchContext = (ctx) => {
        if (!ctx || guard.has(ctx)) return;
        guard.add(ctx);
        const proto = Object.getPrototypeOf(ctx);
        const desc = Object.getOwnPropertyDescriptor(proto, 'destination');
        if (!desc || !desc.get) return;
        const realDest = desc.get.call(ctx);
        const master = ctx.createGain();
        master.gain.value = 0.08;
        master.connect(realDest);
        Object.defineProperty(ctx, 'destination', {
          configurable: true,
          get() {
            return master;
          },
        });
      };
      const Original = AC;
      function Patched(...args) {
        const ctx = new Original(...args);
        patchContext(ctx);
        return ctx;
      }
      Patched.prototype = Original.prototype;
      win.AudioContext = Patched;
      if (win.webkitAudioContext) win.webkitAudioContext = Patched;
    } catch {
      /* cross-origin safety */
    }
  };

  const onIframeLoad = () => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    try {
      const doc = win.document;
      const head = doc.head || doc.documentElement;
      if (head) {
        const style = doc.createElement('style');
        style.textContent =
          'a[href*="emscripten.org"]{display:none!important}' +
          '#output{display:none!important}' +
          '#controls{opacity:.45;font-size:10px}' +
          '#controls:hover{opacity:1}';
        head.appendChild(style);
      }

      patchAudio(win);

      doc.addEventListener('click', (e) => {
        try {
          if (e.target && e.target.closest && e.target.closest('#controls')) return;
          if (win.pointerLockElement || doc.pointerLockElement) return;
          const canvas = doc.querySelector('canvas');
          if (canvas && canvas.requestPointerLock) canvas.requestPointerLock();
        } catch {
          /* cross-origin safety */
        }
      });

        win.Module = win.Module || {};
        win.Module.onExit = () => onCloseRef.current?.();
        win.addEventListener('exit', () => onCloseRef.current?.());
        // hand keyboard focus to the game so controls respond immediately
        frameRef.current?.focus?.();
        win.focus?.();
      } catch {
        /* cross-origin safety */
      }
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setShowQuit((s) => !s);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // freeze page scroll while the game window is open
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9600] grid place-items-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) refocus();
      }}
    >
      <div
        ref={winRef}
        className="flex aspect-[4/3] w-[min(800px,94vw)] flex-col overflow-hidden rounded-xl border border-[#504945] bg-black shadow-2xl"
      >
        <div
          className="flex cursor-grab select-none items-center gap-2.5 bg-[var(--gruv-bar)] px-3.5 py-2 active:cursor-grabbing"
          onPointerDown={onTitlePointerDown}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z" fill="#83a598" />
          </svg>
          <span className="font-mono text-xs text-[#ebdbb2]">
            <b>alex@archlinux</b>: ~/doom — doom.exe
          </span>
          <span className="ml-auto font-mono text-[10px] text-[#928374]">esc: menú</span>
          <button
            type="button"
            aria-label="cerrar doom"
            onClick={() => setShowQuit(true)}
            className="font-mono px-2 hover:text-[#fb4934]"
          >
            ×
          </button>
        </div>

        <div className="relative flex-1 bg-black">
          <iframe
            ref={frameRef}
            title="DOOM — prboom wasm"
            src="/doom/doom1/doom1.html"
            allow="autoplay; fullscreen"
            className="absolute inset-0 h-full w-full border-0"
            onLoad={onIframeLoad}
          />

          {status !== 'locked' && (
            <span className="absolute left-1/2 top-3 z-[5] -translate-x-1/2 rounded-full border border-[#504945] bg-[rgba(29,32,33,.88)] px-3.5 py-1.5 font-mono text-[10px] tracking-widest text-[#ebdbb2]">
              click en el juego = capturar mouse · esc = liberar
            </span>
          )}

          {showQuit && (
            <div className="absolute inset-0 z-[6] grid place-items-center bg-black/55">
              <div className="rounded-xl border border-white/15 bg-[#1c1c1e] p-6 text-center">
                <p className="font-medium text-[#e8e8e3]">¿Salir del juego?</p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-[#ff5f57] px-4 py-2 text-[#1d2021]"
                  >
                    Sí, salir
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuit(false);
                      refocus();
                    }}
                    className="border border-white/20 px-4 py-2 text-[#e8e8e3]"
                  >
                    Seguir jugando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
