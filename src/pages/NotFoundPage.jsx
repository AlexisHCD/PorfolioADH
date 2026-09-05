import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * 404 — unknown route. Terminal-style error page in the site's own visual
 * language: the visited path shown as a failed shell command, with the way
 * back home. Sets the page title while mounted.
 */
export default function NotFoundPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = '404 — comando no encontrado | Alexis Hernández';
    return () => {
      document.title = 'Alexis Hernández — Desarrollador & Ciberseguridad | Portafolio';
    };
  }, []);

  return (
    <main id="contenido" className="relative z-[1]">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center px-6 pt-24 md:px-12">
        <div className="w-full overflow-hidden rounded-xl border border-[#504945] bg-[#1d2021] shadow-2xl">
          {/* arch titlebar */}
          <div className="flex items-center gap-2.5 bg-[var(--gruv-bar)] px-3.5 py-2">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z" fill="#83a598" />
            </svg>
            <span className="font-mono text-xs text-[#ebdbb2]">
              <b>guest@arch</b>: ~ — 404
            </span>
          </div>

          {/* error shell */}
          <div className="p-6 font-mono text-[12.5px] leading-loose">
            <p className="text-[var(--gruv-green)]">[guest@arch ~]$ cd {pathname}</p>
            <p className="text-[#fb4934]">
              bash: cd: {pathname}: No existe el archivo o el directorio
            </p>
            <p className="mt-4 text-[var(--gruv-teal)]">código de error: 404 — not found</p>
            <p className="mt-4 text-muted">
              la ruta que buscas no existe (o se mudó de directorio).
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                data-hover
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-contrast transition-shadow hover:shadow-[0_0_28px_var(--accent-glow)]"
              >
                [↑] volver al inicio
              </Link>
              <Link
                to="/#contacto"
                data-hover
                className="btn-ghost inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-[13px] text-text transition-colors hover:border-accent-line hover:text-accent"
              >
                [✉] contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
