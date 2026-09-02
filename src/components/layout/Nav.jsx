import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { identity } from '../../data/profile';
import ThemeToggle from '../ui/ThemeToggle';

const SECTIONS = [
  ['01', 'sobre-mi'],
  ['02', 'stack'],
  ['03', 'actividad'],
  ['04', 'proyectos'],
  ['05', 'roadmap'],
  ['06', 'certificados'],
  ['07', 'contacto'],
];

/** Fixed top navigation — brand prompt, section links, theme toggle, CV CTA. */
export default function Nav({ theme, onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while the overlay menu is open; close on Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <nav className="fixed inset-x-0 top-0 z-[9000] flex items-center justify-between border-b border-transparent px-6 py-4 transition-colors md:px-11">
      <Link to="/#top" data-hover className="font-mono text-[15.5px] font-bold hover:text-accent">
        Sysop<span className="text-accent">@alexdev</span>:~$
      </Link>

      <div className="hidden items-center gap-6 font-mono text-[11.5px] tracking-widest text-muted whitespace-nowrap xl:flex">
        {SECTIONS.map(([n, label]) => (
          <Link
            key={label}
            to={`/#${label}`}
            data-hover
            className="transition-colors hover:text-text"
          >
            <b className="mr-0.5 font-medium text-accent">{n}.</b>
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle theme={theme} onToggle={onToggle} />
        <a
          href={identity.cvHref ?? '#'}
          data-hover
          className="nav-cta inline-flex items-center whitespace-nowrap rounded-lg px-[17px] py-[10px] font-mono text-[11.5px] tracking-widest text-accent"
        >
          cv.pdf ↓
        </a>
        <button
          type="button"
          data-hover
          aria-label={menuOpen ? 'cerrar menú' : 'abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="grid size-[38px] cursor-pointer place-items-center rounded-lg border border-line font-mono text-[15px] text-accent transition-colors hover:border-accent-line xl:hidden"
        >
          {menuOpen ? '[×]' : '[≡]'}
        </button>
      </div>

      {/* mobile section menu — full-screen terminal-style overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[9500] flex flex-col px-8 pt-24 backdrop-blur-sm xl:hidden"
          style={{ background: 'color-mix(in srgb, var(--ink) 92%, transparent)' }}
          role="dialog"
          aria-label="menú de secciones"
        >
          <button
            type="button"
            aria-label="cerrar menú"
            onClick={() => setMenuOpen(false)}
            className="absolute right-6 top-4 cursor-pointer font-mono text-lg text-accent hover:text-[#fb4934]"
          >
            [×]
          </button>
          <ul className="flex flex-col gap-1">
            {SECTIONS.map(([n, label]) => (
              <li key={label}>
                <Link
                  to={`/#${label}`}
                  data-hover
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 font-mono text-lg tracking-wide text-muted transition-colors hover:bg-[var(--accent-soft)] hover:text-accent"
                >
                  <b className="mr-2 font-medium text-accent">{n}.</b>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-auto pb-8 font-mono text-[10px] tracking-[0.16em] text-muted">
            {`// ${identity.brand} · ${new Date().getFullYear()}`}
          </p>
        </div>
      )}
    </nav>
  );
}
