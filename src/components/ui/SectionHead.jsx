/**
 * Generic section header used by every section.
 *
 * @param {object} props
 * @param {string} props.num - Zero-padded section number (e.g. "01").
 * @param {string} props.title - Section title (rendered as an h2).
 * @returns {JSX.Element}
 */
export default function SectionHead({ num, title }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-sm tracking-[0.2em] text-accent">
        {`// ${num}`}
      </span>
      <h2 className="font-display font-bold uppercase text-[clamp(2rem,5vw,3.4rem)] leading-none">
        {title}
      </h2>
      <span className="flex-1 h-px bg-gradient-to-r from-[var(--line)] to-transparent" />
    </div>
  );
}
