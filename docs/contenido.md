# Contenido — capa SSOT

Todo el texto del sitio vive en **dos archivos**. Nunca edites textos dentro de los
componentes: cámbialos acá y la app (y los tests de contrato) se actualizan solos.

## `src/data/profile.js`

| Export | Alimenta |
|---|---|
| `identity` | nombre, rol, email `adhcamus@gmail.com`, foto (para cuando exista la real), CV |
| `social` | GitHub / LinkedIn / X (handle + URL) |
| `mission` | chips del hero (MISIÓN / ESTADO / BASE) |
| `about` | heading, párrafos, firma `$ whoami → …` |
| `stack` | grupos del Tech Stack (`lenguajes`, `frameworks & web`, `datos`, `herramientas & os`) |
| `roadmap` | malla completa: 5 semestres, `currentSemester` (drive la barra), `progressPercent`, `careerShort` |
| `projects` | las 5 cards (`tag` = DESTACADO/GRUPO/…, `meta` = línea inferior, `repo` acepta `#top` para self-link) |
| `certificates` | sellos, labels y `ledger` (líneas que escribe el visor) |
| `footerNote` / `footerCredit` / `footerCopyright` | pie de página |

## `src/data/legal.js`

Contenido de `/aviso-legal` y `/politica-de-privacidad` en secciones estructuradas
(`{ h, p[], links[] }`). Las leyes van enlazadas por título oficial a la BCN.

## Reglas

1. **Idioma**: contenido en español (Chile); código, commits y esta carpeta de código en inglés.
2. `test:data contract` (`profile.test.js`) valida invariants: IDs únicos, 1 proyecto
   destacado, 5 semestres con uno "current", formato de `sealText`. Si editas datos y
   ese test falla, el contenido quedó inconsistente.
3. El semestre "next" muestra el badge **PRÓXIMO PASO**; los done, **COMPLETADO**.

## GitHub snapshot

`src/data/githubSnapshot.js` es el último eslabón del fallback de la sección de
actividad: refleja los números curados del mockup y **no contiene datos falsos**
(repos/commits vacíos → los bloques "live" se ocultan solos).
