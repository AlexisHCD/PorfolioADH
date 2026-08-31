import { Link } from 'react-router-dom';
import { legalDocs } from '../data/legal';
import { useReveal } from '../hooks/useReveal';
import { useEffect, useRef } from 'react';

/**
 * Legal route (aviso legal / política de privacidad) — documentation-style
 * page using the site's theme variables, so day/night keeps working.
 *
 * @param {object} props
 * @param {'aviso' | 'privacidad'} props.doc - Which legal document to render.
 */
export default function LegalPage({ doc }) {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { immediate: true });
  const data = legalDocs[doc];

  useEffect(() => {
    if (data) document.title = `${data.title} | Alexis Hernández`;
    return () => {
      document.title = 'Alexis Hernández — Desarrollador & Ciberseguridad | Portafolio';
    };
  }, [data]);

  if (!data) return null;

  return (
    <main id="contenido" className="relative z-[1]">
      <section
        ref={sectionRef}
        className="mx-auto max-w-3xl px-6 pt-40 pb-28 md:px-12"
      >
        <p className="font-mono text-sm tracking-[0.2em] text-accent">{`// ${data.num}`}</p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-muted">
          {`última actualización · ${data.updated}`}
        </p>

        {data.sections.map((s) => (
          <div key={s.h} className="mt-12">
            <h2 className="font-mono text-[13px] font-bold tracking-[0.12em] text-text">
              {s.h}
            </h2>
            {s.p.map((t, i) => (
              <p key={i} className="mt-3 leading-relaxed text-muted">
                {t}
              </p>
            ))}
            {s.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="mt-3 block font-mono text-[11.5px] text-accent transition-colors hover:text-text"
              >
                {`${l.label} ↗`}
              </a>
            ))}
          </div>
        ))}

        <Link
          to="/"
          data-hover
          className="mt-16 inline-block font-mono text-[12px] tracking-[0.12em] text-accent transition-colors hover:text-text"
        >
          ← volver al inicio
        </Link>
      </section>
    </main>
  );
}
