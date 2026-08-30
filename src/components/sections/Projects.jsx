import { useRef } from 'react';
import { projects } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useMagnetic } from '../../hooks/useMagnetic';

/**
 * Single project card: featured cards span both columns. Each card is a full
 * link with a magnetic hover, a giant outline ghost number and a meta row.
 *
 * @param {object} props
 * @param {object} props.p - Project record from profile.js.
 */
function ProjectCard({ p }) {
  const ref = useRef(null);
  useMagnetic(ref);

  return (
    <a
      ref={ref}
      href={p.repo}
      target="_blank"
      rel="noopener noreferrer"
      data-reveal
      data-magnetic
      className={`block h-full ${p.featured ? 'md:col-span-2' : ''}`}
    >
      <article className="rounded-[18px] border border-line bg-ink-2 p-6 transition-transform duration-300 hover:-translate-y-1 proj h-full">
        <span className="proj-ghost">{p.num}</span>

        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] tracking-[0.18em] text-accent">
            {`// ${p.num}`}
          </span>
          {p.privateRepo ? (
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
              repo privado
            </span>
          ) : p.featured ? (
            <span className="rounded-full border border-accent-line px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-accent">
              destacado
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3>
        <p className="mt-2 max-w-[520px] text-sm leading-relaxed text-muted">{p.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="proj-meta">
          <span className="proj-repo">{p.repo}</span>
          <span className="proj-arrow">↗</span>
        </div>
      </article>
    </a>
  );
}

/**
 * // 04 Proyectos — bento grid port of the mockup.
 * The featured project spans both columns and renders first; the rest follow
 * in source order. Each card links out to its repo.
 */
export default function Projects() {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <section id="proyectos" className="mx-auto max-w-6xl px-6 py-20 md:px-12">
      <SectionHead num="04" title="Proyectos" />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[featured, ...rest].map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
