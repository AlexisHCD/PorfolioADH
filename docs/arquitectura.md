# Arquitectura

## Stack

- **Build**: Vite 7 · React 19 (JavaScript, sin TS) · Tailwind CSS 4
- **Animación**: GSAP 3.13 (ScrollTrigger) + Lenis (smooth scroll) — ambos gratuitos
- **Router**: react-router-dom 7 (rutas `/`, `/aviso-legal`, `/politica-de-privacidad`)
- **Backend**: ninguno. Una única **Vercel Function** (`api/github.js`) hace de proxy
  cacheado hacia la API de GitHub. El formulario usa Web3Forms (tercero).

## Estructura

```
api/github.js            → función serverless: proxy GitHub + caché edge (15 min)
public/                  → favicon.svg, apple-touch-icon.png, og.png, robots.txt,
                           certs/, cv.pdf, doom/ (payload gitignoreado)
src/
  data/                  → ⭐ CAPA SSOT: profile.js (todo el contenido) + legal.js
  lib/                   → githubCore.js (reductores puros), github.js (fallbacks),
                           motion.js (GSAP + stubs), sound.js
  hooks/                 → useTheme, useLenis, useGitHubLive, useReveal(+Group),
                           useMagnetic, useScramble, useSplitChars, useInView, useKonami
  components/
    layout/              → Nav (con menú móvil), Footer, BgField, GrainScanlines
    sections/            → Hero+Terminal, About, Stack, Activity, Projects,
                           Roadmap, Certificates, Contact
    ui/                  → Terminal, ThemeToggle, CertificateBadge, DoomWindow,
                           Loader, Marquee, ScrollProgress, OverdriveSurge, SectionHead
  pages/                 → HomePage, LegalPage (rutas del router)
e2e/                     → specs Playwright (corren contra el build)
mockups/phosphor.html    → mockup aprobado (referencia visual histórica)
```

## Principios de diseño

1. **`src/data/` es la única fuente de verdad del contenido.** Los componentes no
   contienen textos: edita `profile.js` / `legal.js` y todo cambia.
2. **El mockup es el SSOT visual**: cada sección usa las clases CSS portadas
   1:1 de `mockups/phosphor.html` (`src/index.css`). No re-estilar con Tailwind lo que
   ya existe como clase portada.
3. **Tema día/noche** vía `data-theme` en `<html>` + variables CSS
   (`--accent`, `--line`, `--ink`…). Todo componente nuevo debe usar solo variables.
   Persistencia: `localStorage["alexdevos-theme"]` + transición circular + chime.

## Flujos clave

- **Tema**: `useTheme` → `data-theme` → CSS variables → todo el sitio responde.
- **Scroll**: Lenis (instancia viva en `lenisStore`, `hooks/useLenis.js`). Las
  animaciones entran con GSAP+ScrollTrigger (`useReveal`, `useRevealGroup` con
  `clearProps` para no bloquear `:hover`).
- **Router + scroll**: `RouteScroll` (App.jsx) salta a `/#seccion` usando Lenis
  (`immediate: true` si la pestaña está oculta — rAF congelado).
- **Konami** (`↑↑↓↓←→←→BA`): sobrecarga fósforo + chime. Desactivado con visor o DOOM abiertos.
- **Terminal**: boot narrativo, comandos `help · whoami · proyectos · roadmap ·
  contacto · certificados · matrix · rm -rf / · sudo · clear · doom.exe`.
  `doom.exe` se niega en pantallas táctiles/`<768px` (webprboom es desktop-only).
- **DOOM**: iframe same-origin a `public/doom/doom1/doom1.html` (webprboom, GPL,
  crédito en el footer). Cierre destruye el iframe (sin audio zombi). Volumen
  master inyectado: 0.15.

## Easter eggs

- Konami → surge fósforo + sonido (6s).
- `matrix` en la terminal → lluvia katakana 5s.
- `rm -rf /` → rechazo dramático. `sudo` →denegado con humor.
- Consola del navegador: NFO estilo SKIDROW al cargar.
