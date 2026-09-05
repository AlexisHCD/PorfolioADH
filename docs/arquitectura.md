# Arquitectura

## Stack tecnológico

- **Build**: Vite 7 · React 19 (JavaScript, sin TypeScript) · Tailwind CSS 4
- **Animación**: GSAP 3.13 (ScrollTrigger) + Lenis (scroll suave)
- **Enrutamiento**: react-router-dom 7 (rutas `/`, `/aviso-legal`, `/politica-de-privacidad`)
- **Backend**: ninguno. Una única función Vercel (`api/github.js`) actúa como proxy cacheado hacia la API de GitHub. El formulario utiliza Web3Forms como servicio externo.

## Estructura de directorios

```
api/github.js            Función serverless: proxy de GitHub con caché edge (15 min)
public/                  favicon.svg, apple-touch-icon.png, og.png, robots.txt,
                         certs/, cv.pdf, doom/ (payload excluido del repositorio)
src/
  data/                  Capa SSOT de contenido: profile.js, legal.js, githubSnapshot.js
  lib/                   githubCore.js (reductores puros), github.js (cadena de fallbacks),
                         motion.js (GSAP y stubs), sound.js
  hooks/                 useTheme, useLenis, useGitHubLive, useReveal (+useRevealGroup),
                         useMagnetic, useScramble, useSplitChars, useInView, useKonami
  components/
    layout/              Nav (con menú móvil), Footer, BgField, GrainScanlines
    sections/            Hero+Terminal, About, Stack, Activity, Projects,
                         Roadmap, Certificates, Contact
    ui/                  Terminal, ThemeToggle, CertificateBadge, DoomWindow, Loader,
                         Marquee, ScrollProgress, OverdriveSurge, SectionHead
  pages/                 HomePage, LegalPage (rutas del router)
e2e/                     Specs de Playwright (se ejecutan contra el build)
mockups/phosphor.html    Mockup aprobado (especificación visual de referencia)
```

## Principios de diseño

1. **Capa de datos como única fuente de verdad del contenido.** Los componentes no contienen textos; estos viven en `src/data/profile.js` y `src/data/legal.js`.
2. **El mockup es la especificación visual**: cada sección utiliza las clases CSS portadas uno a uno desde `mockups/phosphor.html` hacia `src/index.css`. No se re-estila con utilidades Tailwind lo que ya existe como clase portada.
3. **Tema día/noche** mediante `data-theme` en `<html>` y variables CSS (`--accent`, `--line`, `--ink`, entre otras). Todo componente nuevo debe emplear exclusivamente variables. Persistencia en `localStorage["alexdevos-theme"]`, con transición circular y síntesis de audio.
4. **Accesibilidad**: navegación por teclado, foco visible y retorno de foco en modales, soporte de `prefers-reduced-motion` en todas las animaciones.

## Flujos clave

- **Tema**: `useTheme` establece `data-theme`; las variables CSS propagan el cambio a todo el sitio.
- **Scroll**: Lenis (instancia viva expuesta en `lenisStore`, `hooks/useLenis.js`). Las animaciones de entrada usan GSAP con ScrollTrigger (`useReveal`, `useRevealGroup` con `clearProps` para no bloquear transformaciones `:hover`).
- **Router y scroll**: `RouteScroll` (App.jsx) desplaza a `/#seccion` mediante Lenis, con salto inmediato si la pestaña está oculta (el bucle rAF se congela sin visibilidad).
- **Terminal**: arranque narrativo y comandos `help`, `whoami`, `stack`, `proyectos`, `roadmap`, `contacto`, `certificados`, `matrix`, `rm -rf /`, `sudo`, `clear`, `doom.exe`. El comando `doom.exe` se deniega en pantallas táctiles o inferiores a 768 px (webprboom requiere teclado y ratón).
- **DOOM**: iframe de mismo origen a `public/doom/doom1/doom1.html` (webprboom, GPL, crédito visible en el pie de página). El cierre destruye el iframe para no dejar audio residual. Volumen master inyectado: 0.15.
- **Formulario**: validación en cliente (campos requeridos, formato de correo, longitudes, honeypot) y envío mediante Web3Forms. Ante fallo se muestra error en línea con acción de copiar correo; no existe fallback `mailto:`.

## Elementos ocultos (easter eggs)

| Easter egg | Dónde | Qué hace |
|---|---|---|
| Código Konami (`↑↑↓↓←→←→BA`) | cualquier parte | Sobrecarga fósforo con síntesis de audio; deshabilitada con el visor de certificados o DOOM abiertos |
| `doom.exe` | terminal | Lanza DOOM 1993 en una ventana arrastrable (solo escritorio) |
| `hack` | terminal | Secuencia falsa de intrusión que termina en "ACCESO CONCEDIDO — bienvenido al lado verde" |
| `rm -rf /` | terminal | Rechazo dramático ("este sistema es inmune a dedos traviesos") |
| `sudo` / `sudo ls` | terminal | "aquí manda alexis" / denegación con humor |
| Consola del navegador | automático | Bloque NFO estilo escena al cargar |

## Página 404

Las rutas desconocidas muestran una página 404 estilo terminal (`src/pages/NotFoundPage.jsx`):
la ruta visitada aparece como un comando fallido de shell, con enlaces de vuelta al
inicio y a contacto. Nota: al ser una SPA estática, la respuesta HTTP es 200 (decisión
de diseño documentada en la fase de despliegue).
