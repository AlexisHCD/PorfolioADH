/**
 * Day/night switcher pill. Shows the DESTINATION mode (sun+"día" while dark),
 * matching the approved mockup interaction.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'cambiar a modo día' : 'cambiar a modo noche'}
      title="prender la luz / apagarla"
      data-hover
      className="inline-flex h-[38px] cursor-pointer items-center gap-2.5 rounded-full border border-accent-line bg-accent-soft pr-4 pl-1.5 font-mono text-[10.5px] font-bold tracking-[0.22em] text-accent uppercase transition-shadow duration-300 hover:shadow-[0_0_24px_var(--accent-glow)]"
    >
      <span className="grid size-[25px] place-items-center rounded-full bg-accent text-[13px] text-accent-contrast shadow-[0_0_14px_var(--accent-glow)]">
        {isDark ? '☀' : '☾'}
      </span>
      <span className="translate-y-[0.5px]">{isDark ? 'día' : 'noche'}</span>
    </button>
  );
}
