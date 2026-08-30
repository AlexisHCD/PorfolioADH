import { useRef } from 'react';
import { identity, about, social, roadmap } from '../../data/profile';
import { GithubIcon, LinkedinIcon } from './Hero';
import SectionHead from '../ui/SectionHead';
import { useReveal } from '../../hooks/useReveal';

const cardBase =
  'rounded-[18px] border border-line bg-ink-2 p-6 transition-transform duration-300 hover:-translate-y-1';

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
      className="mx-auto max-w-6xl px-6 py-20 md:px-12"
    >
      <SectionHead num="01" title="Sobre mí" />

      {/* a) ID card row */}
      <div className="relative mb-12 flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-ink-2 p-3.5">
        <div
          className="shrink-0"
          style={{ background: 'linear-gradient(160deg, var(--accent-soft), transparent 70%)' }}
        >
          <img
            src={identity.photo}
            alt={identity.photoAlt}
            width={86}
            height={86}
            className="h-[86px] w-[86px] rounded-xl object-cover grayscale contrast-125 brightness-95 mix-blend-luminosity"
          />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold uppercase leading-tight">{identity.fullName}</p>
          <p className="font-mono text-xs text-accent">{`// ${identity.role}`}</p>
          <p className="font-mono text-[10px] text-muted">foto temporal · la real llega pronto</p>
        </div>
        <span className="id-scan pointer-events-none absolute inset-x-0 top-0 h-1/3" />
      </div>

      {/* b) Main grid */}
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
              {`${roadmap.career} — San Antonio · ${roadmap.sct} SCT`}
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
            {cardTag('// REDES', 'social')}
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-1.5 text-sm hover:text-accent"
            >
              <GithubIcon /> <span>{social.githubUser}</span>
              <span className="ml-auto text-muted">↗</span>
            </a>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-1.5 text-sm hover:text-accent"
            >
              <LinkedinIcon /> <span>linkedin</span>
              <span className="ml-auto text-muted">↗</span>
            </a>
          </div>

          {/* AHORA */}
          <div className={cardBase} data-reveal>
            {cardTag('// AHORA', 'live')}
            {[
              'explorando repos en GitHub',
              'leyendo sobre IA',
              'noticias tech internacionales',
            ].map((line) => (
              <p key={line} className="flex items-center gap-2 py-1 text-sm text-muted">
                <span className="text-accent">●</span> {line}
              </p>
            ))}
          </div>

          {/* BASE */}
          <div className={cardBase} data-reveal>
            {cardTag('// BASE', 'ubicación')}
            <p className="font-display text-lg font-bold">
              {`${identity.location.city}, ${identity.location.code}`}
            </p>
            <p className="mt-1 text-sm text-muted">
              {`${identity.location.region} · ${identity.location.country}`}
            </p>
          </div>

          {/* INTERESES */}
          <div className={cardBase} data-reveal>
            {cardTag('// INTERESES', 'tags')}
            <div className="flex flex-wrap gap-2">
              {['Informática', 'IA', 'Tech', 'Open Source', 'Linux'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
