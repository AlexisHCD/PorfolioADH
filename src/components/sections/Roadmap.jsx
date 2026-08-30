import { useEffect, useRef, useState } from 'react';
import { roadmap } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useInView } from '../../hooks/useInView';
import { useReveal, useRevealGroup } from '../../hooks/useReveal';
import { prefersReducedMotion } from '../../lib/motion';

const FALLBACK_FRACTION = 0.75;

/**
 * // 05 Roadmap — fixed-progress vertical timeline.
 * The accent fill animates ONCE from scaleY(0) to scaleY(targetFraction) when the
 * timeline enters view, then stays fixed forever (never scroll-linked).
 * Markup uses the ported mockup classes (.tl / .tl-line / .tl-item / …): nodes
 * are solid-ink discs so the line never shows through them, the status badge
 * sits inline after the date and the current node glows + blinks.
 */
export default function Roadmap() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const countRef = useRef(null);
  const inView = useInView(listRef);
  const [targetFraction, setTargetFraction] = useState(null);

  useReveal(sectionRef);
  useRevealGroup(listRef, '.tl-item', {
    dx: -34,
    dy: 0,
    duration: 0.9,
    ease: 'power3.out',
    start: 'top 85%',
  });

  // Count-up for the summary percentage (rAF, reduced-motion aware).
  useEffect(() => {
    const el = countRef.current;
    if (!el) return undefined;
    const target = roadmap.progressPercent;
    if (prefersReducedMotion()) {
      el.textContent = String(target);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = String(Math.round(t * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
    <section
      id="roadmap"
      ref={sectionRef}
      data-reveal
      className="mx-auto max-w-[1240px] px-6 py-[clamp(90px,12vh,150px)] md:px-12"
    >
      <SectionHead num="05" title="Roadmap" />
      <p className="mt-4 text-muted">
        {`${roadmap.career} — ${roadmap.totalSemesters} semestres · ${roadmap.sct} SCT · Instituto Profesional AIEP.`}
      </p>

      <div ref={listRef} className="tl">
        {/* vertical line + animated fixed fill */}
        <div ref={lineRef} className="tl-line">
          <span
            className="tl-progress"
            style={{
              transform: `scaleY(${fraction})`,
              transition: 'transform 1600ms cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          />
        </div>

        {roadmap.semesters.map((s) => {
          const isDone = s.status === 'done';
          const isCurrent = s.status === 'current';
          const nodeGlyph = isDone ? '✓' : isCurrent ? '●' : '◇';
          return (
            <div
              key={s.n}
              className={`tl-item${isDone ? ' done' : isCurrent ? ' current' : ''}`}
            >
              <span className="tl-node" data-tl-node>
                <i>{nodeGlyph}</i>
              </span>

              <div className="tl-when">
                <span>{`SEMESTRE ${String(s.n).padStart(2, '0')} · ${s.year}`}</span>
                {isDone ? (
                  <span className="tl-badge">COMPLETADO</span>
                ) : isCurrent ? (
                  <span className="tl-badge">EN CURSO</span>
                ) : (
                  <span className="tl-badge">PRÓXIMO PASO</span>
                )}
              </div>

              <div className="tl-title">{s.title}</div>

              <div className="tl-courses">
                {s.courses.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel tl-summary" data-reveal>
        <div className="panel-head">
          <div className="panel-title">
            <b>$</b> career --progress
          </div>
          <span className="summary-pct">
            <span ref={countRef} data-count={roadmap.progressPercent}>
              0
            </span>
            %
          </span>
        </div>
        <div className="summary-bar">
          <span data-progress={roadmap.progressPercent} style={{ width: `${roadmap.progressPercent}%` }} />
        </div>
        <div className="progress-label">
          <span>3/5 SEMESTRES · PRÁCTICA PENDIENTE</span>
          <b>TÉCNICO EN 2027</b>
        </div>
      </div>
    </section>
  );
}
