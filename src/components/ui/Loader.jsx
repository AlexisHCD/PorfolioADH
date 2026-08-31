import { useEffect, useRef, useState } from 'react';
import { useScramble } from '../../hooks/useScramble';

const LOADER_MS = 2000;
const WORDS = ['ALEXIS_HCD', 'ALEXDEV_OS', 'INIT_MODULES', 'ALEXIS_HCD'];

/**
 * Boot loader overlay. Runs a self-correcting counter (timer-tick driven so it
 * reaches 100% reliably even under main-thread stalls), re-scrambles the name
 * tag, then slides the overlay up and hides it. `onDone` fires once after hide.
 */
export function Loader({ onDone }) {
  const loaderRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [hidden, setHidden] = useState(false);
  const scrambleText = useScramble({ text: WORDS[wordIdx], runKey: wordIdx, duration: 480 });

  useEffect(() => {
    let counter;
    let wordTimer;
    let failsafe;
    let hideTimer;
    let doneTimer;
    const calledDone = { current: false };

    const finish = () => {
      const el = loaderRef.current;
      if (!el) {
        if (!calledDone.current) {
          calledDone.current = true;
          onDone && onDone();
        }
        setHidden(true);
        return;
      }
      el.style.transition = 'transform 900ms cubic-bezier(.7,0,.2,1)';
      el.style.transform = 'translateY(-100%)';
      doneTimer = setTimeout(() => {
        el.style.display = 'none';
        if (!calledDone.current) {
          calledDone.current = true;
          onDone && onDone();
        }
        setHidden(true);
      }, 1000);
    };

    const tickCount = Math.ceil(LOADER_MS / 33);
    const inc = 100 / tickCount;
    let pct = 0;
    counter = setInterval(() => {
      pct = Math.min(100, pct + inc);
      if (pctRef.current) pctRef.current.textContent = String(Math.round(pct)).padStart(3, '0');
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (pct >= 100) {
        clearInterval(counter);
        clearInterval(wordTimer);
        clearTimeout(failsafe);
        hideTimer = setTimeout(finish, 60);
      }
    }, 33);

    wordTimer = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 520);
    failsafe = setTimeout(() => {
      clearInterval(counter);
      clearInterval(wordTimer);
      pct = 100;
      if (pctRef.current) pctRef.current.textContent = '100';
      if (barRef.current) barRef.current.style.width = '100%';
      hideTimer = setTimeout(finish, 60);
    }, 6000);

    return () => {
      clearInterval(counter);
      clearInterval(wordTimer);
      clearTimeout(failsafe);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  if (hidden) return null;

  return (
    <div className="loader" id="loader" ref={loaderRef} role="status" aria-label="cargando el sitio">
      <div className="loader-inner">
        <div className="loader-tag">{'// PORTFOLIO v2.0 — ALEXDEV_OS'}</div>
        <div className="loader-name">
          <span id="loaderScramble">{scrambleText}</span>
          <span className="tick">_</span>
        </div>
      </div>
      <div className="loader-count">
        <span id="loaderPct" ref={pctRef}>
          000
        </span>
      </div>
      <div className="loader-bar" id="loaderBar" ref={barRef} />
    </div>
  );
}
