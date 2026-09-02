import { Link } from 'react-router-dom';
import { footerNote, footerCopyright, footerCredit } from '../../data/profile';
import { lenisStore } from '../../hooks/useLenis';

/**
 * Site footer, 1:1 with the mockup: copyright line, tech credit with the DOOM
 * webprboom GPL link (kept visible per license), legal page links, build tag
 * and a back-to-top control in the site's own visual language.
 */
export default function Footer() {
  const toTop = () => {
    const lenis = lenisStore.current;
    if (lenis?.scrollTo) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-7 font-mono text-[11px] tracking-wide text-muted md:px-11">
      <span>{footerCopyright.replace('© ', `© ${new Date().getFullYear()} `)}</span>
      <span
        className="max-w-xl text-right [&_a]:transition-colors [&_a:hover]:text-accent [&_.p]:text-accent"
        dangerouslySetInnerHTML={{ __html: footerCredit }}
      />
      <span className="flex items-center gap-4">
        <Link to="/aviso-legal" data-hover className="transition-colors hover:text-accent">
          aviso legal
        </Link>
        <Link to="/politica-de-privacidad" data-hover className="transition-colors hover:text-accent">
          privacidad
        </Link>
        <span>{footerNote}</span>
        <button
          type="button"
          data-hover
          onClick={toTop}
          aria-label="volver al inicio"
          title="volver al inicio"
          className="grid size-[38px] cursor-pointer place-items-center rounded-lg border border-line font-mono text-[15px] text-accent transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-[0_0_18px_var(--accent-glow)]"
        >
          [↑]
        </button>
      </span>
    </footer>
  );
}
