/**
 * Day/night switcher pill. Shows the DESTINATION mode: sun + "día" while dark,
 * moon + "noche" while light. Icons are crisp stroked SVGs (lucide-style) so
 * both symbols read clearly at pill size in either theme.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  const SunIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M5.2 18.8l1.7-1.7M17.1 6.9l1.7-1.7" />
    </svg>
  );

  const MoonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.7 14.9A8.5 8.5 0 0 1 9.1 3.3a.7.7 0 0 0-.9-.9 9.9 9.9 0 1 0 13.4 13.4.7.7 0 0 0-.9-.9z" />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={(e) => onToggle(e.currentTarget)}
      aria-label={isDark ? 'cambiar a modo día' : 'cambiar a modo noche'}
      title="prender la luz / apagarla"
      data-hover
      className="inline-flex h-[38px] cursor-pointer items-center gap-2.5 rounded-full border border-accent-line bg-accent-soft pr-4 pl-1.5 font-mono text-[10.5px] font-bold tracking-[0.22em] text-accent uppercase transition-shadow duration-300 hover:shadow-[0_0_24px_var(--accent-glow)]"
    >
      <span className="grid size-[25px] place-items-center rounded-full bg-accent text-accent-contrast shadow-[0_0_14px_var(--accent-glow)]">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      <span className="translate-y-[0.5px]">{isDark ? 'día' : 'noche'}</span>
    </button>
  );
}
