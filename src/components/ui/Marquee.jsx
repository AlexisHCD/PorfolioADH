import { useEffect, useRef } from 'react';

/** Seamless horizontal marquee strip. Clones the inner span so it loops. */
export function Marquee() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector('span');
    if (first && !track.querySelector('span + span')) {
      track.appendChild(first.cloneNode(true));
    }
  }, []);

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" id="marqueeTrack" ref={trackRef}>
        <span>
          INTELIGENCIA ARTIFICIAL // TECNOLOGÍA // LINUX // OPEN SOURCE // DESARROLLO WEB // ANÁLISIS
          DE SISTEMAS // TERMINAL // FULLSTACK //&nbsp;
        </span>
      </div>
    </div>
  );
}
