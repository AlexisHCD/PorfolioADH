import { useEffect, useMemo, useRef } from 'react';
import { activitySeed } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useReveal } from '../../hooks/useReveal';
import { useInView } from '../../hooks/useInView';
import { mountGsap, prefersReducedMotion } from '../../lib/motion';

const LEVEL_COLORS = [0.04, 0.15, 0.28, 0.45, 0.75];
const LEGEND_ALPHAS = [0.12, 0.28, 0.45, 0.65, 0.9];
const WEEKS = 26;
const DAYS = 7;
const CELL_COUNT = WEEKS * DAYS;

// Language distribution for the "repos --por-lenguaje" panel (hard data).
const LANG_BARS = [
  { name: 'Python', w: 100, val: 3 },
  { name: 'C#', w: 72, val: 2 },
  { name: 'JavaScript', w: 60, val: 2 },
  { name: 'Dart', w: 34, val: 1 },
  { name: 'Java', w: 30, val: 1 },
];

/**
 * mulberry32 — tiny deterministic PRNG.
 * Given the same seed it always produces the same sequence, so the heatmap is
 * identical across renders and environments (no Math.random at render time).
 *
 * @param {number} seed - Integer seed.
 * @returns {() => number} Function returning floats in [0, 1).
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * // 03 Actividad — GitHub-style contribution heatmap + mono-charts, deterministic from seed.
 */
export default function Activity() {
  const sectionRef = useRef(null);
  const barsRef = useRef(null);
  const lineRef = useRef(null);
  const inView = useInView(sectionRef);

  useReveal(sectionRef);

  const cells = useMemo(() => {
    const rand = mulberry32(activitySeed);
    const out = [];
    for (let i = 0; i < CELL_COUNT; i += 1) {
      const r = rand();
      let level;
      if (r < 0.4) {
        // ~40% of days land in the quietest two buckets
        level = r < 0.2 ? 0 : 1;
      } else {
        level = 2 + Math.floor(rand() * 3);
      }
      out.push(level);
    }
    return out;
  }, []);

  // Animate the bar fills (scaleX 0 -> data-w) and the activity curve (dashoffset)
  // the first time the section enters view. No-op under reduced motion / no GSAP.
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return undefined;
    let killed = false;
    mountGsap().then(({ gsap }) => {
      if (killed || !gsap) return;
      const fills = barsRef.current?.querySelectorAll('.bar-fill');
      fills?.forEach((el, i) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: Number(el.dataset.w) / 100,
            duration: 1,
            ease: 'power3.out',
            delay: 0.12 + i * 0.06,
          },
        );
      });
      const line = lineRef.current;
      if (line && typeof line.getTotalLength === 'function') {
        const len = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' },
        );
      }
    });
    return () => {
      killed = true;
    };
  }, [inView]);

  return (
    <section
      id="actividad"
      ref={sectionRef}
      data-reveal
      className="mx-auto max-w-6xl px-6 py-20 md:px-12"
    >
      <SectionHead num="03" title="Actividad" />

      <div className="mt-10">
        <div className="panel" data-reveal>
          <div className="panel-head">
            <div className="panel-title">
              <b>$</b> git log --contribuciones · @AlexisHCD
            </div>
            <div className="heat-legend">
              <span>menos</span>
              {LEGEND_ALPHAS.map((alpha, i) => (
                <span
                  key={i}
                  className="hm-cell rounded-[3px]"
                  style={{ backgroundColor: `rgba(0,255,156,${alpha})` }}
                />
              ))}
              <span>más</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div
              className="grid grid-flow-col grid-rows-7 gap-[3px]"
              style={{ width: 'max-content' }}
            >
              {cells.map((level, i) => (
                <span
                  key={i}
                  data-testid="hm-cell"
                  title={`actividad nivel ${level}`}
                  className="h-[12px] w-[12px] rounded-[3px]"
                  style={{ backgroundColor: `rgba(0,255,156,${LEVEL_COLORS[level]})` }}
                />
              ))}
            </div>
          </div>

          <p className="mt-6 font-mono text-xs text-muted">
            182 días · consistencia &gt; intensidad
          </p>
        </div>

        <div className="act-grid">
          <div className="panel" data-reveal>
            <div className="panel-head">
              <div className="panel-title">
                <b>$</b> actividad --6-meses
              </div>
            </div>
            <svg className="chart-svg" viewBox="0 0 600 220" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.22 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path
                id="chartArea"
                d="M0,170 C60,150 90,118 140,128 S240,88 290,104 S390,38 440,66 S560,26 600,52 L600,220 L0,220 Z"
                fill="url(#areaFill)"
                opacity="0"
              />
              <path
                id="chartLine"
                ref={lineRef}
                className="chart-line"
                style={{ stroke: 'var(--accent)' }}
                d="M0,170 C60,150 90,118 140,128 S240,88 290,104 S390,38 440,66 S560,26 600,52"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle className="chart-end-pulse" cx="600" cy="52" r="4" />
              <circle className="chart-end" cx="600" cy="52" r="4" />
            </svg>
          </div>

          <div className="panel" data-reveal>
            <div className="panel-head">
              <div className="panel-title">
                <b>$</b> repos --por-lenguaje
              </div>
            </div>
            <div ref={barsRef}>
              {LANG_BARS.map((row) => (
                <div className="bar-row" key={row.name}>
                  <span className="bar-label">{row.name}</span>
                  <span className="bar-track">
                    <span className="bar-fill" data-w={row.w} />
                  </span>
                  <span className="bar-val">{String(row.val).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" data-reveal>
            <div className="panel-head">
              <div className="panel-title">
                <b>$</b> stats
              </div>
            </div>
            <div className="stat-cell">
              <div className="stat-num">09</div>
              <div className="stat-label">REPOS PÚBLICOS</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num">2025</div>
              <div className="stat-label">EN GITHUB DESDE</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num">
                <i>●</i> ACTIVO
              </div>
              <div className="stat-label">ESTADO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
