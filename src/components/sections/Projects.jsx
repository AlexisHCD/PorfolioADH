import { useRef } from 'react';
import { projects } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useRevealGroup } from '../../hooks/useReveal';

/**
 * Single project card — the <a class="proj"> itself is the card, exactly like
 * the mockup: ghost number, index tag, title, description, chips and meta row.
 * Hover behavior (lift -5px, accent border, arrow nudge) lives in the ported
 * `.proj` CSS — deliberately NOT magnetic.
 *
 * @param {object} props
 * @param {object} props.p - Project record from profile.js.
 */
function ProjectCard({ p }) {
  const isSelfLink = p.repo.startsWith('#');

  return (
    <a
      href={p.repo}
      target={isSelfLink ? undefined : '_blank'}
      rel={isSelfLink ? undefined : 'noopener noreferrer'}
      data-reveal
      data-hover
      className={`proj h-full ${p.featured ? 'span-2' : ''}`}
    >
      <span className="proj-ghost">{p.num}</span>

      <div className="proj-index">{`// ${p.num} — ${p.tag}`}</div>
      <h3 className="proj-title">{p.title}</h3>
      <p className="proj-desc">{p.description}</p>

      <div className="chips">
        {p.tech.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <div className="proj-meta">
        <span className="proj-repo">{p.meta}</span>
        <span className="proj-arrow">↗</span>
      </div>
    </a>
  );
}

/**
 * // 04 Proyectos — bento grid, 1:1 with the mockup: featured project spans
 * both columns and renders first; cards reveal on scroll with a soft rise.
 */
export default function Projects() {
  const sectionRef = useRef(null);
  useRevealGroup(sectionRef, '.proj', { dy: 38, duration: 1 });

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="mx-auto max-w-[1240px] px-6 py-[clamp(90px,12vh,150px)] md:px-12"
    >
      <SectionHead num="04" title="Proyectos" />
      <p className="mt-4 text-muted">
        Lo más representativo de mi trabajo — académico y personal.
      </p>

      <div className="proj-grid">
        {[featured, ...rest].map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
