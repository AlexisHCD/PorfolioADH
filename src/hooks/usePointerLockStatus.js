import { useEffect, useState } from 'react';

/**
 * Tracks whether an element inside a given iframe document currently holds
 * pointer lock. Polls the iframe document on an interval until it is available
 * (cross-origin iframes will never expose it, so we degrade to 'unlocked').
 *
 * @param {React.MutableRefObject<HTMLIFrameElement | null>} frameRef
 * @returns {'locked' | 'unlocked'}
 */
export default function usePointerLockStatus(frameRef) {
  const [status, setStatus] = useState('unlocked');

  useEffect(() => {
    let tries = 0;
    let intervalId = null;
    let cleanupDoc = null;
    let cancelled = false;

    const evaluate = () => {
      try {
        const win = frameRef.current?.contentWindow;
        const doc = win?.document;
        if (!doc || !doc.body) return false;
        const locked = !!(doc.pointerLockElement || win?.pointerLockElement);
        setStatus(locked ? 'locked' : 'unlocked');
        return true;
      } catch {
        return false;
      }
    };

    const onChange = () => evaluate();

    const attach = () => {
      if (cancelled) return;
      tries += 1;
      let doc = null;
      try {
        const win = frameRef.current?.contentWindow;
        doc = win?.document;
      } catch {
        doc = null;
      }
      if (doc && doc.body) {
        try {
          doc.addEventListener('pointerlockchange', onChange);
          cleanupDoc = () => {
            try {
              doc.removeEventListener('pointerlockchange', onChange);
            } catch {
              /* noop */
            }
          };
          evaluate();
        } catch {
          /* noop */
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return;
      }
      if (tries >= 20) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    attach();
    if (!cleanupDoc) {
      intervalId = setInterval(attach, 400);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (cleanupDoc) cleanupDoc();
    };
  }, [frameRef]);

  return status;
}
