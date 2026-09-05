# AlexDev_OS — Documentación del proyecto

Portafolio personal de **Alexis Hernández Camus**, estudiante de Técnico en Programación y Análisis de Sistemas (AIEP), San Antonio, Región de Valparaíso, Chile.

Repositorio: `github.com/AlexisHCD/PorfolioADH`

## Descripción general

Portafolio estático construido con Vite y React, con sección de actividad en vivo desde la API de GitHub (mediante función serverless con caché edge), terminal interactiva, DOOM ejecutándose por WebAssembly en escritorio, certificados verificables y tema día/noche con persistencia.

## Metodología

El proyecto se desarrolla bajo **SDD (Spec-Driven Development)**: toda implementación está precedida por una especificación verificable. El mockup aprobado constituye la especificación visual; la capa de datos constituye la especificación de contenido; los tests de contrato validan ambas.

## Índice de documentos

| Documento | Contenido |
|---|---|
| [arquitectura.md](arquitectura.md) | Stack, estructura de directorios, flujos clave, elementos ocultos |
| [contenido.md](contenido.md) | Gestión de textos y datos (capa SSOT) |
| [github-live.md](github-live.md) | Sección de actividad en vivo: fuentes de datos, cadena de respaldo y token |
| [deploy.md](deploy.md) | Procedimiento de despliegue en Vercel |
| [qa.md](qa.md) | Estrategia de pruebas y comandos |

## Estado final (2026-09-05)

- **En producción**: [https://porfolio-adh.vercel.app](https://porfolio-adh.vercel.app) — desplegado en Vercel con tokens configurados.
- Todas las fases completas: concepto, build, funcionalidades, QA y despliegue.
- Suites en verde: 30 tests unitarios, 23 tests E2E, 9 auditorías de accesibilidad sin violaciones críticas.
- Lighthouse en producción: Accesibilidad 100 · Best Practices 100 · SEO 100 (Performance 99 escritorio / 66 móvil, ver [qa.md](qa.md)).
- Página 404 estilo terminal implementada; actividad 100% en vivo desde GitHub (calendario real con selector de año).

## Comandos

```bash
npm install          # instalación de dependencias
npm run dev          # servidor de desarrollo, puerto 5173
npm run build        # build de producción a dist/
npm test             # tests unitarios (30)
npm run test:e2e     # suite E2E de Playwright (22), contra el build
npm run lint         # análisis estático
```
