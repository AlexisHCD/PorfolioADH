# AlexDev_OS — Portafolio Personal v2.0

Portafolio personal de **Alexis Hernández Camus**, estudiante de Técnico en Programación y Análisis de Sistemas (AIEP), San Antonio, Región de Valparaíso, Chile. Orientación profesional: desarrollo y ciberseguridad.

Repositorio: `github.com/AlexisHCD/PorfolioADH`

## Descripción

Portafolio estático construido alrededor de una idea central: el sitio completo es un escritorio Linux. La interfaz reproduce estética Arch Linux con tema gruvbox, una terminal interactiva en el hero, gráficos SVG animados de elaboración propia, certificados verificables con visor documental y el easter egg de DOOM 1993 ejecutándose mediante WebAssembly dentro de una ventana arrastrable (exclusivo de escritorio).

La sección de actividad se alimenta en tiempo real desde la API de GitHub mediante una función serverless con caché en el edge, con una cadena de respaldo de cuatro niveles que garantiza que el sitio nunca quede inoperativo.

## Metodología

El proyecto se desarrolla bajo **SDD (Spec-Driven Development)**: toda implementación está precedida por una especificación verificable. El mockup aprobado (`mockups/phosphor.html`) constituye la especificación visual; la capa de datos (`src/data/`) constituye la especificación de contenido; los tests de contrato validan ambas. No se emplea TDD.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Build | Vite 7 |
| Interfaz | React 19 (JavaScript, sin TypeScript) |
| Estilos | Tailwind CSS 4 + sistema de clases portado desde el mockup |
| Animación | GSAP 3.13 (ScrollTrigger) + Lenis (scroll suave) |
| Enrutamiento | react-router-dom 7 |
| Backend | Vercel Function (`api/github.js`) — proxy de GitHub con caché edge |
| Formulario | Web3Forms (servicio externo, sin backend propio) |
| Calidad | ESLint 9, Prettier, Vitest, Playwright, axe-core |

## Estructura del proyecto

```
api/github.js            Función serverless: proxy de GitHub con caché edge (15 min)
docs/                    Documentación del proyecto (español)
e2e/                     Suite E2E de Playwright
mockups/phosphor.html    Mockup aprobado (especificación visual de referencia)
public/                  Favicon, imagen social, robots.txt, certificados, CV, payload DOOM
src/
  data/                  Capa de contenido (fuente única de verdad): profile.js, legal.js,
                         githubSnapshot.js
  lib/                   Lógica pura: reductores de GitHub, cadena de fallbacks, utilidades
                         de animación y sonido
  hooks/                 useTheme, useLenis, useGitHubLive, useReveal, useMagnetic,
                         useScramble, useSplitChars, useInView, useKonami
  components/
    layout/              Nav (con menú móvil), Footer, fondos ambientales
    sections/            Hero+Terminal, About, Stack, Activity, Projects, Roadmap,
                         Certificates, Contact
    ui/                  Terminal, ThemeToggle, CertificateBadge, DoomWindow, Loader,
                         Marquee, ScrollProgress, OverdriveSurge, SectionHead
  pages/                 HomePage y LegalPage (rutas del router)
```

## Funcionalidades

- Tema día/noche con transición circular (View Transitions) y síntesis de audio; persistencia en localStorage.
- Terminal interactiva con arranque narrativo y comandos (`help`, `whoami`, `matrix`, `doom.exe`, entre otros).
- Sección de actividad en vivo: calendario de contribuciones con selector de año, commits recientes, lenguajes y estadísticas, con cadena de respaldo de cuatro niveles.
- Malla curricular con barra de progreso de llenado único (indicador, no scrollbar).
- Certificados con visor documental (revelado circular, ledger a máquina, marco arrastrable).
- Formulario de contacto con validación en cliente y protección anti-spam.
- Páginas legales conforme a la legislación chilena (Ley N° 19.628 y Ley N° 21.719).
- Accesibilidad: auditoría axe sin violaciones críticas en tres viewports; soporte de `prefers-reduced-motion`.
- Easter eggs: código Konami, lluvia Matrix y DOOM jugable (solo escritorio).

## Requisitos e instalación

- Node.js 20 o superior (el proyecto se desarrolló con Node 26).
- `npm install` para instalar dependencias.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 5173 |
| `npm run build` | Build de producción a `dist/` |
| `npm run preview` | Sirve el build de producción en el puerto 4173 |
| `npm test` | Suite unitaria (30 tests, lógica pura y contratos) |
| `npm run test:e2e` | Suite E2E de Playwright (22 tests) más 9 auditorías de accesibilidad |
| `npm run lint` | Análisis estático con ESLint |

## Despliegue

El despliegue se realiza en Vercel (configuración incluida: `vercel.json` con rewrites SPA, security headers y la función serverless). Requiere dos variables de entorno: `GITHUB_TOKEN` (calendario de contribuciones) y `VITE_WEB3FORMS_ACCESS_KEY` (formulario). El procedimiento completo está documentado en [`docs/deploy.md`](docs/deploy.md).

## Documentación

La documentación completa del proyecto, en español, se encuentra en [`docs/`](docs/README.md): arquitectura, gestión de contenido, sección de actividad en vivo, despliegue y pruebas. La documentación para agentes de desarrollo está en [AGENTS.md](AGENTS.md) y en `.hermes/plans/`.

## Licencias y créditos

El contenido del sitio es propiedad de Alexis Hernández Camus. DOOM es propiedad de id Software; se ejecuta localmente mediante el puerto de código abierto webprboom (licencia GPL), con el crédito correspondiente visible en el pie de página. Las marcas de terceros que aparecen pertenecen a sus respectivos titulares.
