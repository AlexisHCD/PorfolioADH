import { useMemo } from 'react';
import { activitySeed } from '../../data/profile';
import SectionHead from '../ui/SectionHead';

const LEVEL_COLORS = [0.04, 0.15, 0.28, 0.45, 0.75];
const WEEKS = 26;
const DAYS = 7;
const CELL_COUNT = WEEKS * DAYS;

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
 * // 03 Actividad — GitHub-style contribution heatmap, deterministic from seed.
 */
export default function Activity() {
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

  return (
    <section id="actividad" className="mx-auto max-w-6xl px-6 py-20 md:px-12">
      <SectionHead num="03" title="Actividad" />

      <div className="mt-10">
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

        <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-muted">
          <span>menos</span>
          <div className="flex gap-1">
            {LEVEL_COLORS.map((alpha, i) => (
              <span
                key={i}
                className="h-[12px] w-[12px] rounded-[3px]"
                style={{ backgroundColor: `rgba(0,255,156,${alpha})` }}
              />
            ))}
          </div>
          <span>más</span>
        </div>
      </div>
    </section>
  );
}
