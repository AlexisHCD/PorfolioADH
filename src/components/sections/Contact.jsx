import { useState } from 'react';
import { identity, social } from '../../data/profile';

/**
 * Contact section — big CTA, copy-to-clipboard email and social row.
 */
export default function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-4xl px-6 py-24 text-center md:px-12">
      <h2 className="font-display font-bold leading-none tracking-tight text-[clamp(3rem,11vw,9rem)]">
        ¿Hablamos<span className="text-accent">?</span>
      </h2>
      <p className="mx-auto mt-6 max-w-md text-muted">
        Abierto a prácticas profesionales, proyectos y colaboraciones. Escríbeme y conversamos.
      </p>

      <div className="mt-10 flex justify-center">
        <CopyEmailButton />
      </div>

      <div className="mt-10 flex items-center justify-center gap-6 font-mono text-xs">
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
      aria-label={`copiar correo ${identity.email}`}
      className="rounded-xl border border-line px-7 py-4 font-mono text-sm transition-colors hover:border-accent-line hover:text-accent"
    >
      <span aria-live="polite">
        {copied ? 'copiado al portapapeles ✓' : (status ?? `${identity.email} ⧉`)}
      </span>
    </button>
  );
}
