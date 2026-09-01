# Gestión de contenido — capa SSOT

La totalidad del texto del sitio reside en **dos archivos**. Los componentes no contienen textos: se editan exclusivamente en la capa de datos y la interfaz se actualiza en consecuencia.

## `src/data/profile.js`

| Export | Alimenta |
|---|---|
| `identity` | nombre, rol, correo `adhcamus@gmail.com`, fotografía (reservada para la imagen definitiva), CV |
| `social` | GitHub / LinkedIn / X (identificador y URL) |
| `mission` | chips del hero (MISIÓN / ESTADO / BASE) |
| `about` | encabezado, párrafos, firma `$ whoami → …` |
| `stack` | grupos de Tech Stack (`lenguajes`, `frameworks & web`, `datos`, `herramientas & os`) |
| `roadmap` | malla completa: 5 semestres, `currentSemester` (gobierna la barra de progreso), `progressPercent`, `careerShort` |
| `projects` | las cinco tarjetas (`tag` = DESTACADO/GRUPO/PERSONAL/ESTUDIO/EN CONSTRUCCIÓN, `meta` = línea inferior, `repo` admite `#top` como enlace interno) |
| `certificates` | sellos, etiquetas y `ledger` (líneas que mecanografía el visor) |
| `footerNote` / `footerCredit` / `footerCopyright` | pie de página |

## `src/data/legal.js`

Contenido de `/aviso-legal` y `/politica-de-privacidad` en secciones estructuradas (`{ h, p[], links[] }`). Las leyes se enlazan por título oficial al texto de la Biblioteca del Congreso Nacional: Ley N° 19.628 y Ley N° 21.719.

## Reglas

1. **Idioma**: contenido del sitio en español de Chile; código, comentarios, commits y documentación para agentes en inglés.
2. El test de contrato (`src/data/profile.test.js`) valida invariantes: identificadores únicos, un único proyecto destacado, cinco semestres con uno en estado `current` y el formato de `sealText`. Si una edición de datos rompe este test, el contenido quedó inconsistente.
3. El semestre en estado `next` muestra la insignia **PRÓXIMO PASO**; los completados, **COMPLETADO**; el actual, **EN CURSO**.

## Snapshot de GitHub

`src/data/githubSnapshot.js` constituye el último eslabón de la cadena de respaldo de la sección de actividad: refleja los números curados del mockup y **no contiene datos falsos** (repos y commits vacíos; los bloques en vivo se ocultan automáticamente sin conexión).
