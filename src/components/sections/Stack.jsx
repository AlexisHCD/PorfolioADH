import { useRef } from 'react';
import { stack } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useInView } from '../../hooks/useInView';

/**
 * Deterministic fill width (35–94%) for a stack bar.
 * Index within the group and the group position keep output stable across renders.
 *
 * @param {number} itemIndex - Position of the item inside its group.
 * @param {number} groupIndex - Position of the group inside the stack list.
 * @returns {number} Percentage width to apply to the inner fill.
 */
function barWidth(itemIndex, groupIndex) {
  return 35 + ((itemIndex * 13 + groupIndex * 7) % 60);
}

/**
 * // 02 Stack — grouped technologies rendered as mono-charts horizontal bars.
 * Bars animate from 0 to their target width the first time the section is seen.
 */
export default function Stack() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 py-20 md:px-12"
    >
      <SectionHead num="02" title="Stack" />

      <div className="mt-10 flex flex-col gap-8">
        {stack.map((group, groupIndex) => (
          <div key={group.group}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {group.group}
            </p>
            <div className="flex flex-col gap-2.5">
              {group.items.map((item, itemIndex) => (
                <div key={item} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 truncate font-mono text-sm text-muted">
                    {item}
                  </span>
                  <div className="h-[6px] flex-1 rounded bg-[var(--line)]">
                    <span
                      className="block h-full rounded bg-accent transition-[width] duration-700 ease-out"
                      style={{ width: inView ? `${barWidth(itemIndex, groupIndex)}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
