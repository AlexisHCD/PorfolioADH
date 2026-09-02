/**
 * Day/night switcher — iOS-style toggle. The sliding knob carries a
 * rays-only sun on dark (a filled circle reads as an eye in screenshots)
 * and a crescent moon on light; the label shows the destination mode in
 * small caps. Glow persists while applied; the knob slide + icon scale
 * crossfade add the extra flourish.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  const SunIcon = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* rays only — a filled circle here reads as an eye in screenshots */}
      <path d="M12 2.2v3M12 18.8v3M2.2 12h3M18.8 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
    </svg>
  );

  const MoonIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.7 14.9A8.5 8.5 0 0 1 9.1 3.3a.7.7 0 0 0-.9-.9 9.9 9.9 0 1 0 13.4 13.4.7.7 0 0 0-.9-.9z" />
    </svg>
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'cambiar a modo día' : 'cambiar a modo noche'}
      title="dark / white"
      data-hover
      onClick={(e) => onToggle(e.currentTarget)}
      className={`inline-flex h-[32px] w-[74px] cursor-pointer items-center rounded-full border pl-1 pr-2.5 transition-all duration-300 ${
        isDark
          ? 'border-line bg-ink-2'
          : 'border-[var(--accent-line)] bg-accent-soft shadow-[0_0_18px_var(--accent-glow)]'
      }`}
    >
      <span
        className={`relative grid size-[24px] place-items-center rounded-full text-accent-contrast shadow-[0_0_14px_var(--accent-glow)] transition-transform duration-300 ease-out ${
          isDark ? 'translate-x-0 bg-accent' : 'translate-x-[34px] bg-accent'
        }`}
      >
        <span
          className={`absolute transition-transform duration-300 ${
            isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
          }`}
        >
          <SunIcon />
        </span>
        <span
          className={`absolute transition-transform duration-300 ${
            isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0'
          }`}
        >
          <MoonIcon />
        </span>
      </span>
      <span className="ml-auto font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
        {isDark ? 'white' : 'dark'}
      </span>
    </button>
  );
}
