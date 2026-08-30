import { useState } from 'react';
import { identity, social } from '../../data/profile';

/**
 * Contact section — big CTA, copy-to-clipboard email and social row.
 */
export default function Contact() {
  return (
    <section id="contacto" data-reveal className="contact mx-auto max-w-4xl px-6 py-[clamp(110px,14vh,140px)] text-center md:px-12">
      <h2 data-reveal className="contact-title font-display font-bold leading-none tracking-tight text-[clamp(3rem,11vw,9rem)]">
        ¿Hablamos<span className="p">?</span>
      </h2>
      <p data-reveal className="contact-sub mx-auto mt-6 max-w-md text-muted">
        Abierto a prácticas profesionales, proyectos y colaboraciones. Escríbeme y conversamos.
      </p>

      <div data-reveal className="mt-10 flex justify-center">
        <CopyEmailButton />
      </div>

      <div data-reveal className="contact-links mt-10 flex items-center justify-center gap-6 font-mono text-xs">
        <a href={social.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
          github ↗
        </a>
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent"
        >
          linkedin ↗
        </a>
        <a href={social.x} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
          x ↗
        </a>
      </div>
    </section>
  );
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
      setStatus(`${identity.email} (copia manual)`);
    }
  };

  return (
    <button
      type="button"
      data-email={identity.email}
      onClick={handleCopy}
      data-magnetic
      aria-label={`copiar correo ${identity.email}`}
      className="copy-btn rounded-xl border border-line px-7 py-4 font-mono text-sm transition-colors hover:border-accent-line hover:text-accent"
    >
      <span aria-live="polite">
        {copied ? 'copiado al portapapeles ✓' : (status ?? `${identity.email} ⧉`)}
      </span>
    </button>
  );
}
