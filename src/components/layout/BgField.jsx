/** Full-page ambient background field (decorative). */
export function BgField() {
  return (
    <div className="bg-field" aria-hidden="true">
      <div className="f-halftone" />
      <div className="f-ruler" />
      <div className="f-ruler r" />
      <div className="f-glow f-g1" />
      <div className="f-glow f-g2" />
      <div className="f-glow f-g3" />
      <div className="f-glow f-g4" />
    </div>
  );
}
