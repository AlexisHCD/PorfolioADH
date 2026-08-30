import { Link } from 'react-router-dom';
import { identity } from '../../data/profile';
import ThemeToggle from '../ui/ThemeToggle';

/** Fixed top navigation — brand prompt, section links, theme toggle, CV CTA. */
export default function Nav({ theme, onToggle }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-[9000] flex items-center justify-between border-b border-transparent px-6 py-4 transition-colors md:px-11">
      <Link to="/#top" data-hover className="font-mono text-[15.5px] font-bold hover:text-accent">
        Sysop<span className="text-accent">@alexdev</span>:~$
      </Link>

      <div className="hidden items-center gap-6 font-mono text-[11.5px] tracking-widest text-muted lg:flex">
        {[
          ['01', 'sobre-mi'],
          ['02', 'stack'],
          ['03', 'actividad'],
          ['04', 'proyectos'],
          ['05', 'roadmap'],
          ['06', 'certificados'],
          ['07', 'contacto'],
        ].map(([n, label]) => (
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
          className="nav-cta inline-flex items-center rounded-lg px-[17px] py-[10px] font-mono text-[11.5px] tracking-widest text-accent"
        >
          cv.pdf ↓
        </a>
      </div>
    </nav>
  );
}
