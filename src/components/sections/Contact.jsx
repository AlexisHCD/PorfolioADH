import { useState } from 'react';
import { identity, social } from '../../data/profile';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// Web3Forms access keys are public-facing by design — configure via env:
//   VITE_WEB3FORMS_ACCESS_KEY=...  (.env.local locally, Vercel env in prod)
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const message = values.message.trim();
  if (!name || name.length > 80) errors.name = 'cuéntame tu nombre (máx. 80 caracteres)';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'correo inválido';
  if (message.length < 4 || message.length > 2000) {
    errors.message = 'el mensaje debe tener entre 4 y 2000 caracteres';
  }
  return errors;
}

/**
 * Contact form — Web3Forms transport (no backend of our own). Validation is
 * client-side (required fields, email format, length caps + honeypot);
 * Web3Forms validates the access key, runs hCaptcha/abuse checks and forwards
 * the message. No classic mailto fallback: on failure the panel shows an
 * inline error with retry + copy-email instead.
 */
function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [copied, setCopied] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === 'sending') return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          from_name: 'AlexDev_OS · portafolio',
          subject: `nuevo mensaje — ${values.name.trim()}`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        setStatus('success');
        setValues({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const fieldClass =
    'mt-1.5 w-full rounded-lg border border-line bg-ink-2 px-4 py-3 font-mono text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-accent';

  return (
    <div className="panel mx-auto mt-12 max-w-xl text-left" data-reveal>
      <div className="panel-head">
        <div className="panel-title">
          <b>$</b> enviar --mensaje
        </div>
        <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
          web3forms · hCaptcha
        </span>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <label
          htmlFor="cf-name"
          className="block font-mono text-[10px] tracking-[0.18em] text-muted"
        >
          NOMBRE
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          maxLength={80}
          autoComplete="name"
          placeholder="tu nombre"
          value={values.name}
          onChange={set('name')}
          className={fieldClass}
        />
        {errors.name && (
          <p className="mt-1 font-mono text-[10.5px] text-[#fb4934]">{errors.name}</p>
        )}

        <label
          htmlFor="cf-email"
          className="mt-4 block font-mono text-[10px] tracking-[0.18em] text-muted"
        >
          CORREO
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.cl"
          value={values.email}
          onChange={set('email')}
          className={fieldClass}
        />
        {errors.email && (
          <p className="mt-1 font-mono text-[10.5px] text-[#fb4934]">{errors.email}</p>
        )}

        <label
          htmlFor="cf-message"
          className="mt-4 block font-mono text-[10px] tracking-[0.18em] text-muted"
        >
          MENSAJE
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          maxLength={2000}
          placeholder="cuéntame del proyecto, la práctica o la colaboración…"
          value={values.message}
          onChange={set('message')}
          className={`${fieldClass} resize-y`}
        />
        {errors.message && (
          <p className="mt-1 font-mono text-[10.5px] text-[#fb4934]">{errors.message}</p>
        )}

        {/* honeypot — invisible to humans, catnip for bots */}
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="copy-btn mt-6 w-full justify-center disabled:cursor-wait disabled:opacity-60"
        >
          {status === 'sending' ? '$ enviando…' : '$ enviar'}
        </button>

        <p aria-live="polite" className="mt-3 min-h-[1.2em] font-mono text-xs">
          {status === 'success' && (
            <span className="text-accent">✓ mensaje enviado — te respondo pronto</span>
          )}
          {status === 'error' && (
            <span className="text-[#fb4934]">
              ✗ no se pudo enviar —{' '}
              <button
                type="button"
                onClick={copyEmail}
                className="underline decoration-dotted underline-offset-2 hover:text-accent"
              >
                {copied ? 'correo copiado ✓' : 'copia mi correo'}
              </button>{' '}
              y reintenta más tarde
            </span>
          )}
        </p>

        <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted">
          Al enviar aceptas el tratamiento de tus datos según la{' '}
          <a href="/politica-de-privacidad" className="text-accent hover:underline">
            política de privacidad
          </a>
          .
        </p>
      </form>
    </div>
  );
}

/**
 * Contact section — big CTA, copy-to-clipboard email, social row and the
 * modern Web3Forms-powered contact form.
 */
export default function Contact() {
  return (
    <section
      id="contacto"
      data-reveal
      className="contact mx-auto max-w-4xl px-6 py-[clamp(110px,14vh,140px)] text-center md:px-12"
    >
      <h2
        data-reveal
        className="contact-title font-display font-bold leading-none tracking-tight text-[clamp(3rem,11vw,9rem)]"
      >
        ¿Hablamos<span className="p">?</span>
      </h2>
      <p data-reveal className="contact-sub mx-auto mt-6 max-w-md text-muted">
        Abierto a prácticas profesionales, proyectos y colaboraciones. Escríbeme y conversamos.
      </p>

      <div data-reveal className="mt-10 flex justify-center">
        <CopyEmailButton />
      </div>

      <ContactForm />

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
          {social.xUser} ↗
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
