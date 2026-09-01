# Actividad en vivo desde GitHub

La sección `// 03 Actividad` y el bloque `$ ls ~/repos --nuevas` en `// 04 Proyectos` se alimentan de un payload que reduce la cuenta `@AlexisHCD` a un JSON compacto.

## Cadena de resolución

El sitio permanece operativo en todo escenario mediante cuatro capas, evaluadas en orden:

1. **`/api/github`** — función Vercel con `GITHUB_TOKEN` (server-side). Caché edge de 15 minutos con `stale-while-revalidate`: GitHub recibe aproximadamente una petición cada 15 minutos, independientemente del tráfico.
2. **Fetch directo** — `api.github.com` mediante CORS sin token (desarrollo local o función caída).
3. **localStorage** — caché por año (`alexdevos-github-cache:2026`), TTL de 15 minutos.
4. **Snapshot** — `src/data/githubSnapshot.js` (números curados del mockup, sin datos inventados).

Los paneles muestran una insignia de origen: `● live`, `◍ cache` o `◌ local`.

## Fuente de cada panel

| Panel | Fuente |
|---|---|
| `$ git log --contribuciones` (calendario) | **GraphQL** `contributionsCollection` — requiere token propio. Selector de año (2026/2025) mediante `from`/`to` |
| `$ actividad --6-meses` (curva) | Sumas semanales del calendario real; sin él, los feeds de commits; sin ninguno, la curva del mockup |
| `$ commits --live` | Feeds de commits de las cinco repos con push más reciente (la Events API ya no incluye commits en su payload) |
| `$ repos --por-lenguaje` | Campo `language` de las repos públicas reales |
| `$ stats` | `public_repos` y año de creación reales |
| `$ ls ~/repos --nuevas` | Repos públicas ausentes del bento curado |

## Token de GitHub

El calendario real de contribuciones **solo está disponible vía GraphQL autenticado con un token de la propia cuenta**. Sin token, el resto de los paneles funciona (commits, lenguajes, estadísticas), pero el calendario muestra la cuadrícula del mockup y el selector de años se oculta. No se muestran datos inventados bajo ninguna circunstancia.

- Crear el token con sesión iniciada como **AlexisHCD** (classic sin scopes, o fine-grained de solo lectura pública). La función valida `user.login === "AlexisHCD"` antes de aceptar el calendario.
- Configurarlo en Vercel como `GITHUB_TOKEN` — nunca se expone al navegador.

## Revalidación

El hook refresca al montar el componente, al regresar a la pestaña (limitado a 60 segundos) y cada cinco minutos. La caché es por año en localStorage; toda caché malformada se descarta automáticamente.
