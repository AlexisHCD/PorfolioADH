import { useRef } from 'react';
import { projects } from '../../data/profile';
import SectionHead from '../ui/SectionHead';
import { useRevealGroup } from '../../hooks/useReveal';
import { useGitHubLive } from '../../hooks/useGitHubLive';

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

  // Live GitHub repos not present in the curated bento — the `$ ls
  // ~/repos --nuevas` block. Empty payload (snapshot) hides the block so the
  // offline page stays exactly the mockup.
  const { data, source } = useGitHubLive();
  const curated = new Set(
    projects.map((p) => p.repo.toLowerCase().replace(/\/+$/, '')),
  );
  const freshRepos = data.repos
    .filter((r) => !curated.has((r.url ?? '').toLowerCase().replace(/\/+$/, '')))
    .slice(0, 6);
  const badge = source === 'live' ? { label: '● live', color: 'var(--accent)' } : { label: '◍ cache', color: 'var(--muted)' };

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

      {freshRepos.length > 0 && (
        <div className="panel mt-14" data-reveal>
          <div className="panel-head">
            <div className="panel-title">
              <b>$</b> ls ~/repos --nuevas
            </div>
            <span
              className="font-mono text-[10px] tracking-[0.16em]"
              style={{ color: badge.color }}
            >
              {badge.label}
            </span>
          </div>
          <div className="flex flex-col">
            {freshRepos.map((r) => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="group flex items-baseline gap-3 border-b border-dashed border-[var(--line)] py-2 font-mono text-[11px] last:border-b-0"
              >
                <span className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
                <b className="shrink-0 text-text transition-colors group-hover:text-accent">
                  {r.name}
                </b>
                <span className="truncate text-muted">{r.language ?? '—'}</span>
                <span className="ml-auto shrink-0 text-muted">
                  {`★ ${r.stars} · ${(r.createdAt ?? '').slice(0, 10)}`}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
