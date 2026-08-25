import { useEffect, useRef, useState } from 'react';
import { identity, social, stack, projects, roadmap, certificates } from '../../data/profile';

const COLOR_VAR = {
  ok: 'var(--gruv-green)',
  err: 'var(--gruv-red)',
  accent: 'var(--gruv-teal)',
  def: 'var(--gruv-fg)',
  red: 'var(--gruv-red)',
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function span(cls, text) {
  return `<span style="color:${COLOR_VAR[cls] || COLOR_VAR.def}">${escapeHtml(text)}</span>`;
}

const MATRIX_GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾋﾌﾍﾎ0123456789';

function randomMatrixLine() {
  let out = '';
  const len = 18 + Math.floor(Math.random() * 22);
  for (let i = 0; i < len; i += 1) {
    out += MATRIX_GLYPHS.charAt(Math.floor(Math.random() * MATRIX_GLYPHS.length));
  }
  return out;
}

const NEOFETCH_ART = [
  '        /\\',
  '       /  \\',
  '      /    \\    os: alexdev os v2.0',
  '     /  /\\  \\   host: portfolio 2026',
  '    /  /  \\  \\  shell: react-sh 1.0',
  '   /__/    \\__\\ uptime: 2° año y contando',
];

/**
 * Arch-window terminal used in the hero right column.
 *
 * @param {object} props
 * @param {() => void} [props.onToggleTheme]
 * @param {() => void} [props.onLaunchDoom]
 * @returns {JSX.Element}
 */
export default function Terminal({ onToggleTheme = () => {}, onLaunchDoom = () => {} }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const timersRef = useRef([]);
  const mountedRef = useRef(true);
  const historyRef = useRef([]);
  const histIdxRef = useRef(-1);

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      if (mountedRef.current) fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  };

  const pushLine = (html) => {
    setLines((prev) => [...prev, { id: `${prev.length}-${Date.now()}`, html }]);
  };

  useEffect(() => {
    mountedRef.current = true;
    const steps = [
      { d: 280, html: span('def', 'alexdev os v2.0 — tty1') },
      { d: 560, html: span('ok', 'montando /dev/portfolio ......... ok') },
      { d: 560, html: span('ok', 'iniciando shell alexdev ........ ok') },
      { d: 360, html: '' },
    ];
    let acc = 0;
    steps.forEach((step) => {
      acc += step.d;
      later(() => pushLine(step.html), acc);
    });
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const runCommand = (raw) => {
    const trimmed = raw.trim();
    const token = trimmed.toLowerCase().split(/\s+/)[0];

    pushLine(span('def', `[guest@arch ~]$ ${escapeHtml(trimmed)}`));

    if (trimmed === '') return;

    historyRef.current.push(trimmed);
    histIdxRef.current = historyRef.current.length;

    if (token === 'matrix') {
      pushLine(span('ok', 'entrando a la matrix...'));
      let ticks = 0;
      const iv = setInterval(() => {
        if (!mountedRef.current || ticks >= 18) {
          clearInterval(iv);
          return;
        }
        ticks += 1;
        pushLine(span('ok', randomMatrixLine()));
      }, 110);
      timersRef.current.push(iv);
      return;
    }

    const out = [];
    switch (token) {
      case 'help':
        out.push(span('accent', 'comandos disponibles:'));
        out.push(span('def', '  help        muestra esta ayuda'));
        out.push(span('def', '  whoami      datos del operador'));
        out.push(span('def', '  stack       tecnologías que uso'));
        out.push(span('def', '  proyectos   mis repositorios'));
        out.push(span('def', '  roadmap     avance de la carrera'));
        out.push(span('def', '  contacto    email y redes'));
        out.push(span('def', '  certificados  certs obtenidos'));
        out.push(span('def', '  neofetch    info del sistema'));
        out.push(span('def', '  theme       alterna el tema'));
        out.push(span('def', '  ls          lista archivos'));
        out.push(span('def', '  date        fecha y hora'));
        out.push(span('def', '  clear       limpia la terminal'));
        out.push(span('def', '  doom        lanza doom.exe'));
        break;
      case 'whoami':
        out.push(span('accent', identity.fullName));
        out.push(span('def', `${identity.role} · ${identity.location.city}`));
        break;
      case 'stack':
        stack.forEach((g) => {
          out.push(span('def', `${g.group}: ${g.items.join(' · ')}`));
        });
        break;
      case 'proyectos':
        projects.forEach((p) => {
          out.push(span('def', `${p.num} ${p.title} → ${p.repo}`));
        });
        break;
      case 'roadmap':
        roadmap.semesters.forEach((s) => {
          if (s.status === 'done') {
            out.push(span('ok', `✓✓✓ ${s.year} — ${s.title} [listo]`));
          } else if (s.status === 'current') {
            out.push(span('accent', `● ${s.year} — ${s.title} [en curso]`));
          } else {
            out.push(span('def', `◇ ${s.year} — ${s.title} [próximo]`));
          }
        });
        out.push(span('def', `progreso de carrera: ${roadmap.currentSemester}/${roadmap.totalSemesters} semestres`));
        break;
      case 'contacto':
        out.push(span('accent', `email: ${identity.email}`));
        out.push(span('def', `github: ${social.github}`));
        out.push(span('def', `linkedin: ${social.linkedin}`));
        break;
      case 'certificados':
        certificates.forEach((c, i) => {
          out.push(span('def', `[${i + 1}] ${c.label.replace('// ', '')} · ${c.date}`));
        });
        break;
      case 'neofetch':
        NEOFETCH_ART.forEach((l) => out.push(span('accent', l)));
        break;
      case 'theme':
        onToggleTheme();
        out.push(span('ok', 'tema alternado'));
        break;
      case 'clear':
        setLines([]);
        return;
      case 'ls':
        out.push(span('def', 'proyectos/  intereses/  cv.pdf  doom.exe*'));
        break;
      case 'date':
        out.push(span('def', new Date().toLocaleString('es-CL')));
        break;
      case 'sudo':
        out.push(span('red', 'permiso denegado: aquí manda alexis.'));
        break;
      case 'doom':
      case 'doom.exe':
        out.push(span('ok', 'ejecutando ./doom.exe ...'));
        onLaunchDoom();
        break;
      default:
        if (trimmed === 'rm -rf /') {
          out.push(span('red', 'jajaja no. este sistema es inmune a dedos traviesos.'));
        } else {
          out.push(span('red', `comando no encontrado: ${token} — prueba help`));
        }
    }

    out.forEach((html) => pushLine(html));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = historyRef.current;
      if (h.length === 0) return;
      histIdxRef.current = Math.max(0, histIdxRef.current - 1);
      setInput(h[histIdxRef.current] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const h = historyRef.current;
      if (h.length === 0) return;
      histIdxRef.current = Math.min(h.length, histIdxRef.current + 1);
      setInput(h[histIdxRef.current] ?? '');
    }
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-[#504945]"
      style={{ background: 'var(--gruv-bg)', boxShadow: '0 10px 40px -12px rgba(0,0,0,0.55)' }}
    >
      <div className="flex items-center gap-2.5 border-b border-black/30 bg-[var(--gruv-bar)] px-3.5 py-2">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 .6 14.9 15h-4.7L8 10.4 5.8 15H1.1L8 .6z" fill="#83a598" />
        </svg>
        <span className="font-mono text-[11px] text-[var(--gruv-fg)]">
          <b>alex@archlinux</b>: ~/portfolio — kitty
        </span>
        <div className="ml-auto flex items-center gap-2" aria-hidden="true">
          <span className="flex items-center gap-1 text-[var(--gruv-green)]">
            <svg width="12" height="12" viewBox="0 0 16 16"><rect x="1" y="5" width="12" height="7" rx="1" fill="#b8bb26" /></svg>
            <span className="text-[10px]">100%</span>
          </span>
          <span className="flex items-center gap-1 text-[var(--gruv-teal)]">
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M2 6h3l2-3v10l-2-3H2z" fill="#83a598" /></svg>
            <span className="text-[10px]">67</span>
          </span>
          <span className="flex items-center gap-1 text-[var(--gruv-purple)]">
            <svg width="12" height="12" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="9" rx="1" fill="#d3869b" /></svg>
            <span className="text-[10px]">42%</span>
          </span>
          <span className="flex items-center gap-1 text-[var(--gruv-yellow)]">
            <svg width="12" height="12" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#fabd2f" /></svg>
            <span className="text-[10px]">61%</span>
          </span>
          <span className="flex items-center gap-1 text-[var(--gruv-orange)]">
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M8 1l6 4v6l-6 4-6-4V5z" fill="#fe8019" /></svg>
            <span className="text-[10px]">14%</span>
          </span>
          <span className="flex items-center gap-1 text-[var(--gruv-red)]">
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M8 2a6 6 0 016 6c0 3-3 4-6 4s-6-1-6-4a6 6 0 016-6z" fill="#fb4934" /></svg>
            <span className="text-[10px]">45°</span>
          </span>
        </div>
      </div>

      <div
        ref={bodyRef}
        onClick={focusInput}
        className="h-[300px] overflow-y-auto bg-transparent p-3.5 font-mono text-[12.5px] leading-relaxed md:h-[340px]"
      >
        {lines.map((line) => (
          <div key={line.id} dangerouslySetInnerHTML={{ __html: line.html }} />
        ))}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--gruv-green)]">[guest@arch ~]$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="entrada de comandos de la terminal"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent font-mono text-[var(--gruv-fg)] outline-none"
          />
          <span className="h-[15px] w-[9px] animate-pulse bg-[var(--accent)]" />
        </div>
      </div>
    </div>
  );
}
