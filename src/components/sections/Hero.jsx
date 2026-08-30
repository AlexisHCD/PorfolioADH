import { useRef } from 'react';
import { identity, social } from '../../data/profile';
import Terminal from '../ui/Terminal';
import { useReveal } from '../../hooks/useReveal';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useSplitChars } from '../../hooks/useSplitChars';

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z"
    />
  </svg>
);

/**
 * Hero section — kinetic name, mission chips, CTAs and the interactive terminal.
 *
 * @param {object} props
 * @param {() => void} [props.onLaunchDoom] - Fired by the terminal's `doom.exe`.
 */
export default function Hero({ onLaunchDoom = () => {} }) {
  const headerRef = useRef(null);
  const ctaA = useRef(null);
  const ctaB = useRef(null);
  const ctaC = useRef(null);
  const splitFirst = useSplitChars(identity.firstName);
  const splitLast = useSplitChars(identity.lastName);

  // Reveal the hero once on mount (it sits at the very top of the page).
  useReveal(headerRef, { start: 'top top' });
  useMagnetic(ctaA);
  useMagnetic(ctaB);
  useMagnetic(ctaC);

  return (
    <header
      id="top"
      ref={headerRef}
      data-reveal
      className="relative flex min-h-svh items-center overflow-hidden px-6 pt-32 pb-24 md:px-12"
    >
      {/* inner hero fx layers */}
      <div className="bg-halftone" aria-hidden="true" />
      <div className="bg-ruler" aria-hidden="true" />
      <span className="regmark reg-tl" aria-hidden="true" />
      <span className="regmark reg-br" aria-hidden="true" />
      <div className="glow glow-1" aria-hidden="true" />
      <div className="glow glow-2" aria-hidden="true" />
      <aside className="hero-side" aria-hidden="true">
        ALEXDEV_OS · v2.0 — AHC · 2026
      </aside>

      <div className="grid w-full items-center gap-10 lg:grid-cols-[1.02fr_.98fr]">
        <div>
          <p className="mb-6 font-mono text-xs tracking-[0.28em] text-accent">
            {'// AIEP · SAN ANTONIO · CHILE — 2026'}
          </p>
          <h1
            className="font-display leading-[0.94] font-bold tracking-tight uppercase"
            data-reveal
          >
            <span className="block text-[clamp(2.7rem,7.2vw,6.2rem)]" data-split>
              {splitFirst.map((c) => (
                <span className="ch-wrap" key={c.key}>
                  <span className="ch">{c.ch}</span>
                </span>
              ))}
            </span>
            <span
              className="block text-[clamp(2.7rem,7.2vw,6.2rem)] text-transparent [-webkit-text-stroke:1.5px_var(--stroke-outline)]"
              data-split
            >
              {splitLast.map((c) => (
                <span className="ch-wrap" key={c.key}>
                  <span className="ch">{c.ch}</span>
                </span>
              ))}
            </span>
          </h1>
          <p className="mt-7 font-mono text-sm text-muted md:text-[15.5px]">
            <span className="text-accent">&gt;</span> {identity.tagline}
            <span className="ml-1 inline-block h-[1.15em] w-[9px] translate-y-0.5 animate-pulse bg-accent" />
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ['◉', 'MISIÓN: FULLSTACK DEV'],
              ['◉', 'ESTADO: 4° SEMESTRE · S4/5'],
              ['◉', 'BASE: SAN ANTONIO, CL'],
            ].map(([dot, text]) => (
              <span
                key={text}
                className="rounded-full border border-line bg-ink-2 px-3.5 py-2 font-mono text-[10.5px] tracking-[0.18em] text-muted"
              >
                <i className="mr-2 not-italic text-accent">{dot}</i>
                {text}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <a
              ref={ctaA}
              href="#proyectos"
              data-hover
              data-magnetic
              className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-6 py-3.5 font-mono text-[13px] font-medium tracking-wide text-accent-contrast shadow-none transition-shadow hover:shadow-[0_0_38px_var(--accent-glow)]"
            >
              ver proyectos ↓
            </a>
            <a
              ref={ctaB}
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              data-magnetic
              className="btn-ghost inline-flex items-center gap-2.5 rounded-lg border border-line px-6 py-3.5 font-mono text-[13px] font-medium tracking-wide transition-colors hover:border-accent-line hover:text-accent"
            >
              <GithubIcon /> github ↗
            </a>
            <a
              ref={ctaC}
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              data-magnetic
              className="btn-ghost inline-flex items-center gap-2.5 rounded-lg border border-line px-6 py-3.5 font-mono text-[13px] font-medium tracking-wide transition-colors hover:border-accent-line hover:text-accent"
            >
              <LinkedinIcon /> linkedin ↗
            </a>
          </div>

          <p className="scroll-hint">
            scroll <span className="arrow">↓</span>
          </p>
        </div>

        {/* interactive terminal (Phase 3) */}
        <Terminal onLaunchDoom={onLaunchDoom} />
      </div>
    </header>
  );
}

// Re-export so tests can assert icon presence without importing internals.
Hero.icons = { GithubIcon, LinkedinIcon };
export { GithubIcon, LinkedinIcon };
