import { useEffect, useRef, useState } from 'react';
import { roadmap } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useInView } from '../../hooks/useInView';

const FALLBACK_FRACTION = 0.75;

/**
 * // 05 Roadmap — fixed-progress vertical timeline.
 * The accent fill animates ONCE from scaleY(0) to scaleY(targetFraction) when the
 * timeline enters view, then stays fixed forever (never scroll-linked).
 */
export default function Roadmap() {
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const inView = useInView(listRef);
  const [targetFraction, setTargetFraction] = useState(null);

  useEffect(() => {
    const line = lineRef.current;
    const list = listRef.current;
    if (!line || !list) {
      setTargetFraction(FALLBACK_FRACTION);
      return;
    }

    const measure = () => {
      const nodes = list.querySelectorAll('[data-tl-node]');
      const targetIndex = roadmap.currentSemester - 1;
      const node = nodes[targetIndex];
      if (!node) {
        setTargetFraction(FALLBACK_FRACTION);
        return;
      }
      const lineRect = line.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      // stop exactly at the VERTICAL CENTER of the target node (user requirement:
      // the bar must end at node 4 itself, never overshoot toward node 5)
      const nodeCenterY = nodeRect.top + nodeRect.height / 2;
      const fraction = (nodeCenterY - lineRect.top) / lineRect.height;
      setTargetFraction(
        Number.isFinite(fraction) ? Math.min(Math.max(fraction, 0), 1) : FALLBACK_FRACTION,
      );
    };

    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fraction = inView && targetFraction != null ? targetFraction : 0;

  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-20 md:px-12">
      <SectionHead num="05" title="Roadmap" />
      <p className="mt-4 text-muted">
        {`${roadmap.career} — ${roadmap.totalSemesters} semestres · ${roadmap.sct} SCT · Instituto Profesional AIEP`}
      </p>

      <div ref={listRef} className="relative mt-12">
        {/* vertical line + animated fixed fill */}
        <div
          ref={lineRef}
          className="absolute left-[12px] top-2 bottom-2 w-[2px] overflow-hidden rounded"
          style={{ background: 'var(--line)' }}
        >
          <span
            className="absolute inset-x-0 top-0 w-full rounded bg-accent"
            style={{
              height: '100%',
              transform: `scaleY(${fraction})`,
              transformOrigin: 'top',
              transition: 'transform 1600ms ease-out',
            }}
          />
        </div>

        <ul className="flex flex-col">
          {roadmap.semesters.map((s) => {
            const isDone = s.status === 'done';
            const isCurrent = s.status === 'current';
            const nodeGlyph = isDone ? '✓' : isCurrent ? '●' : '◇';
            return (
              <li key={s.n} className="relative pb-12 pl-12 last:pb-0">
                <span
                  data-tl-node
                  className={`absolute left-0 top-1 grid size-6 place-items-center rounded-full border ${
                    isDone
                      ? 'border-accent-line text-accent'
                      : isCurrent
                        ? 'border-accent bg-accent font-bold text-accent-contrast'
                        : 'border-line text-muted'
                  }`}
                >
                  {nodeGlyph}
                </span>

                <div className="flex items-center justify-between font-mono text-[10px] tracking-wide">
                  <span>{`SEMESTRE ${String(s.n).padStart(2, '0')} · ${s.year}`}</span>
                  {isDone ? (
                    <span className="rounded-full border border-accent-line px-2.5 py-1 text-[9px] tracking-[0.14em] text-accent">
                      COMPLETADO
                    </span>
                  ) : isCurrent ? (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-accent-contrast">
                      EN CURSO
                    </span>
                  ) : (
                    <span className="rounded-full border border-line px-2.5 py-1 text-[9px] tracking-[0.14em] text-muted">
                      PENDIENTE
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-display text-xl font-bold">{s.title}</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {s.courses.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
