import { useRef } from 'react';
import { identity, about, social, roadmap } from '../../data/profile';
import { GithubIcon, LinkedinIcon } from './Hero';
import SectionHead from '../ui/SectionHead';
import { useReveal } from '../../hooks/useReveal';

const cardBase = 'card';

const cardTag = (label, suffix) => (
  <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.18em]">
    <span className="text-accent">{label}</span>
    <span className="italic text-muted">{suffix}</span>
  </div>
);

/**
 * // 01 Sobre mí — identity card, intro copy and a bento of quick facts.
 */
export default function About() {
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section
      id="sobre-mi"
      ref={sectionRef}
      data-reveal
      className="mx-auto max-w-[1240px] px-6 py-[clamp(90px,12vh,150px)] md:px-12"
    >
      <SectionHead num="01" title="Sobre mí" />

      {/* Main grid */}
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
        {/* LEFT: intro */}
        <div>
          <h3 className="font-display text-2xl font-bold leading-snug md:text-3xl">
            {about.headingParts[0]}
            <em className="not-italic text-accent">{about.headingParts[1]}</em>
            {about.headingParts[2]}
          </h3>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="mt-5 leading-relaxed text-muted">
              {p}
            </p>
          ))}
          <p className="mt-6 font-mono text-sm text-accent">{about.signature}</p>
        </div>

        {/* RIGHT: bento */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* ESTUDIO */}
          <div className={`${cardBase} sm:col-span-2`} data-reveal>
            {cardTag('// ESTUDIO', 'en curso')}
            <p className="font-display text-lg font-bold">{identity.school}</p>
            <p className="mt-1 text-sm text-muted">
              {`${roadmap.careerShort} — San Antonio`}
            </p>
            <div className="mt-4 h-[5px] w-full rounded bg-[var(--line)]">
              <span
                className="block h-full rounded bg-accent"
                data-progress={`${roadmap.progressPercent}`}
                style={{ width: `${roadmap.progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-muted">
              <span>{`SEMESTRE ${roadmap.currentSemester} / ${roadmap.totalSemesters}`}</span>
              <span>2° AÑO</span>
            </div>
          </div>

          {/* REDES */}
          <div className={cardBase} data-reveal>
            {cardTag('// REDES', 'conecta')}
            {[
              { icon: <GithubIcon />, label: 'github.com/AlexisHCD', href: social.github },
              { icon: <LinkedinIcon />, label: 'linkedin/alexis-hernández', href: social.linkedin },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="group flex items-center gap-2.5 border-b border-dashed border-[var(--line)] py-2 font-mono text-xs last:border-b-0"
              >
                <span className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent">
                  {s.icon}
                </span>
                <span className="text-muted transition-colors group-hover:text-accent">
                  {s.label}
                </span>
                <span className="ml-auto text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                  ↗
                </span>
              </a>
            ))}
          </div>

          {/* AHORA */}
          <div className={cardBase} data-reveal>
            {cardTag('// AHORA', 'live')}
            {[
              'Estudiando Testing y QA',
              'Preparando el TPE',
              'Estudiando Ciberseguridad',
            ].map((line) => (
              <p key={line} className="flex items-center gap-2 py-1 text-sm text-muted">
                <span className="text-accent">●</span> {line}
              </p>
            ))}
          </div>

          {/* BASE */}
          <div className={cardBase} data-reveal>
            {cardTag('// BASE')}
            <p className="font-display text-lg font-bold">
              {`${identity.location.city}, ${identity.location.code}`}
            </p>
            <p className="mt-1 text-sm text-muted">
              {`${identity.location.region} · ${identity.location.country}`}
            </p>
          </div>

          {/* INTERESES */}
          <div className={cardBase} data-reveal>
            {cardTag('// INTERESES')}
            <p className="text-sm text-muted">
              Informática · IA · Tech · Open Source · Linux
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
