# Pruebas y calidad

## Metodología

El proyecto sigue **SDD (Spec-Driven Development)**: el mockup aprobado es la especificación visual y la capa de datos la especificación de contenido; las pruebas validan ambas especificaciones y los flujos del usuario. La suite es deliberadamente reducida: la capa principal es **E2E** (flujos reales de punta a punta) y los tests unitarios cubren únicamente **lógica pura y contratos de datos**. Cada test representa un riesgo real de regresión; no existe test decorativo.

## Comandos

```bash
npm test            # unitarios — 5 archivos, 30 tests (sin red)
npm run test:e2e    # Playwright — 22 tests + 9 auditorías axe (contra el build)
npm run lint        # análisis estático sobre src/
```

Nota: los tests unitarios requieren `NODE_OPTIONS=--no-experimental-webstorage` (ya incluido en el script `npm test`), debido a un conflicto entre Node 26 y jsdom.

## Tests unitarios (alcance y justificación)

| Archivo | Protege |
|---|---|
| `src/data/profile.test.js` | Contrato de contenido: identificadores únicos, un proyecto destacado, semestres, formato de `sealText` |
| `src/lib/githubCore.test.js` | Reductores puros de GitHub (calendario, feeds, deduplicación, curva) |
| `src/lib/github.test.js` | Cadena de fallbacks: función → directo → caché → snapshot |
| `src/hooks/useTheme.test.js` | Persistencia del tema |
| `src/hooks/useKonami.test.js` | Secuencia del código Konami |

## Tests E2E (`e2e/`, Playwright contra build de producción)

| Spec | Cubre |
|---|---|
| `app.spec.js` | Render de secciones, rutas legales, menú móvil, persistencia del tema, progreso fijo del roadmap (no ligado al scroll), visor de certificados (mecanografía y retorno de foco), terminal y DOOM (apertura y cierre) |
| `activity.spec.js` | Fixtures de red: calendario, selector de año, bloque de repos nuevas; fallo total → snapshot honesto |
| `contact.spec.js` | Validación, envío a Web3Forms, fallo → copiar correo (sin `mailto:`) |
| `a11y.spec.js` | axe WCAG 2A/2AA — 3 páginas × 3 viewports, puerta en cero violaciones críticas o serias |

## Accesibilidad y rendimiento

- Puerta de accesibilidad: **cero violaciones críticas o serias** (verificado el 2026-08-30 en las nueve combinaciones de página y viewport).
- `prefers-reduced-motion`: todas las animaciones se degradan correctamente.
- Lighthouse CI con presupuestos de rendimiento: pendiente de conectar al pipeline después del despliegue.
