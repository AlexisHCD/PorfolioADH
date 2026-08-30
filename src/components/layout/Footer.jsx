import { Link } from 'react-router-dom';
import { footerNote, footerCopyright, footerCredit } from '../../data/profile';

/**
 * Site footer, 1:1 with the mockup: copyright line, handmade/tech credit with
 * the DOOM webprboom GPL link (kept visible per license), legal page links
 * and the build tag.
 */
export default function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 border-t border-line px-6 py-7 font-mono text-[11px] tracking-wide text-muted md:px-11">
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
      </span>
    </footer>
  );
}
