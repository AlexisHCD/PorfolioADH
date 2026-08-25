/**
 * Full-page ambient background: halftone field with variable density,
 * technical rulers on both edges and scroll-distributed glows.
 * Ported 1:1 from the approved mockup (.bg-field).
 */
export default function AmbientField() {
  const glow = 'absolute rounded-full blur-[10px] pointer-events-none';
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* halftone dots, denser near hero and contact */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(var(--halftone-dot) 1px, transparent 1.3px)',
          backgroundSize: '5px 5px',
          maskImage:
            'linear-gradient(180deg, transparent 0%, #000 9%, rgba(0,0,0,.55) 34%, rgba(0,0,0,.26) 62%, rgba(0,0,0,.5) 87%, #000)',
          WebkitMaskImage:
            'linear-gradient(180deg, transparent 0%, #000 9%, rgba(0,0,0,.55) 34%, rgba(0,0,0,.26) 62%, rgba(0,0,0,.5) 87%, #000)',
        }}
      />
      {/* technical rulers, both edges */}
      {['left', 'right'].map((side) => (
        <div
          key={side}
          className="absolute top-0 bottom-0 hidden w-[26px] opacity-55 md:block"
          style={{
            [side]: 0,
            backgroundImage: `repeating-linear-gradient(to bottom, var(--tick-line) 0 1px, transparent 1px 12px), repeating-linear-gradient(to bottom, var(--tick-line) 0 1px, transparent 1px 60px)`,
            backgroundPosition: side === 'left' ? '18px top, 10px top' : 'calc(100% - 8px) top, calc(100% - 16px) top',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
      {/* glows distributed along the scroll */}
      <div className={`${glow} -top-[16%] right-[-14%] size-[min(52vw,680px)] bg-accent/12`} />
      <div className={`${glow} top-[165vh] left-[-14%] size-[min(36vw,470px)] bg-white/5`} />
      <div className={`${glow} top-[270vh] right-[-16%] size-[min(46vw,600px)] bg-accent/10`} />
      <div className={`${glow} bottom-[-8%] left-[-10%] size-[min(38vw,500px)] bg-white/4`} />
    </div>
  );
}
