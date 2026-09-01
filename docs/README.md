# AlexDev_OS — Documentación del proyecto

Portafolio personal de **Alexis Hernández Camus** (AIEP · San Antonio, CL).
GitHub: [`AlexisHCD/PorfolioADH`](https://github.com/AlexisHCD/PorfolioADH).

> ⚡ Portafolio estático (Vite + React) con sección de actividad **en vivo desde GitHub**,
> terminal interactiva, DOOM jugable en desktop, certificados verificables y tema día/noche.

## Índice

| Documento | Contenido |
|---|---|
| [`arquitectura.md`](arquitectura.md) | Stack, estructura de carpetas, flujos clave, easter eggs |
| [`contenido.md`](contenido.md) | Cómo editar textos y datos (capa SSOT) |
| [`github-live.md`](github-live.md) | La sección de actividad en vivo: qué lee, fallbacks y el token |
| [`deploy.md`](deploy.md) | Runbook completo de despliegue en Vercel |
| [`qa.md`](qa.md) | Cómo probar el proyecto (unit + E2E + accesibilidad) |

## Estado (2026-08-30)

- Fases 0–4 completas (mockup → build → features → QA). Siguiente: **deploy en Vercel**.
- Suite: **30 tests unitarios + 22 E2E + 9 auditorías axe**, todo en verde.
- Pendiente del autor: PAT de GitHub + access key de Web3Forms (ver [`deploy.md`](deploy.md)).

## Comandos rápidos

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo en :5173
npm run build        # build de producción a dist/
npm test             # tests unitarios (30)
npm run test:e2e     # suite E2E Playwright (22) — corre contra el build
npm run lint         # eslint
```
