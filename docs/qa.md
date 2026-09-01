# QA y testing

## Filosofía (revisada 2026-08-30)

Suite **lean**: la capa principal es **E2E** (flujos reales de punta a punta). Los
tests unitarios existen solo para **lógica pura y contratos de datos** — los tests de
render por componente se eliminaron porque duplicaban lo que E2E ya cubría.
Regla: cada test debe representar un riesgo real de regresión. Cero test theater.

## Comandos

```bash
npm test            # unitarios — 5 archivos, 30 tests (rápidos, sin red)
npm run test:e2e    # Playwright — 22 tests + 9 auditorías axe (corre contra el build)
npm run lint        # eslint sobre src/
```

> ⚠️ Los unitarios requieren `NODE_OPTIONS=--no-experimental-webstorage`
> (ya está en el script `npm test`). Si corres `npx vitest` directo, expórtalo.

## Unitarios (qué queda y por qué)

| Archivo | Protege |
|---|---|
| `src/data/profile.test.js` | Contrato de contenido: IDs únicos, 1 destacado, semestres, sealText |
| `src/lib/githubCore.test.js` | Reductores puros de GitHub (calendario, feeds, dedup, chart) |
| `src/lib/github.test.js` | Cadena de fallbacks función→directo→caché→snapshot |
| `src/hooks/useTheme.test.js` | Persistencia del tema |
| `src/hooks/useKonami.test.js` | Secuencia del easter egg |

## E2E (`e2e/`, Playwright sobre build de producción)

| Spec | Cubre |
|---|---|
| `app.spec.js` | Smoke de secciones, rutas legales, menú móvil, tema persistente, progreso fijo del roadmap, visor de certs (typewriter + foco), terminal + DOOM open/quit |
| `activity.spec.js` | Fixtures de red: calendario + selector de año + repos nuevas; fallo total → snapshot honesto |
| `contact.spec.js` | Validación, envío a Web3Forms, fallo → copy-email (cero `mailto:`) |
| `a11y.spec.js` | axe WCAG 2A/2AA — 3 páginas × 3 viewports, gate cero crítico/serio |

## Accesibilidad y rendimiento

- Gate de axe: **cero violaciones críticas/serias** (verificado 2026-08-30 en las 9 combinaciones).
- Reduced-motion: todas las animaciones respetan `prefers-reduced-motion`.
- Lighthouse CI con presupuestos: pendiente de conectar al pipeline (post-deploy).
