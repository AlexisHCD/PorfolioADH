import { footerNote } from '../../data/profile';
import { doomCredit } from '../../data/profile';

/** Site footer: brand line + DOOM GPL credit (kept visible per license). */
export default function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 border-t border-line px-6 py-7 font-mono text-[11px] tracking-wide text-muted md:px-11">
      <span>
        <span className="text-accent">Sysop@alexdev</span>:~$ portfolio — {new Date().getFullYear()}
      </span>
      <span className="max-w-md text-right">{doomCredit}</span>
      <span>{footerNote}</span>
    </footer>
  );
}
