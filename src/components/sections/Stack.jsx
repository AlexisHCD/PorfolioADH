import { useRef } from 'react';
import { stack } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useReveal } from '../../hooks/useReveal';

/**
 * // 02 Stack — grouped technologies rendered as gruvbox panels of chips.
 * Each panel staggers in on scroll via `data-reveal` + the global reveal hook.
 */
export default function Stack() {
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section
      id="stack"
      ref={sectionRef}
      data-reveal
      className="mx-auto max-w-6xl px-6 py-20 md:px-12"
    >
      <SectionHead num="02" title="Stack" />

      <div className="stack-grid mt-10">
        {stack.map((group) => (
          <div key={group.group} className="panel" data-reveal>
            <div className="panel-head">
              <div className="panel-title">
                <b>$</b> {group.group}
              </div>
            </div>
            <div className="chips">
              {group.items.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="stack-note" data-reveal>
        {'// certificaciones de la malla en camino: '}
        <b>aws</b> · <b>cisco</b> · <b>oracle</b>
      </p>
    </section>
  );
}
