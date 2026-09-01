# Actividad en vivo desde GitHub

La sección `// 03 Actividad` y el bloque `$ ls ~/repos --nuevas` en `// 04 Proyectos`
se alimentan de un payload que reduce tu cuenta `@AlexisHCD` a un JSON pequeño.

## Cadena de resolución (el sitio nunca se rompe)

1. **`/api/github`** — función Vercel con `GITHUB_TOKEN` (server-side). Edge-cached
   15 min con `stale-while-revalidate` → GitHub ve ~1 request/15 min sin importar el tráfico.
2. **Fetch directo** — `api.github.com` CORS sin token (dev / función caída).
3. **localStorage** — caché por año (`alexdevos-github-cache:2026`), 15 min TTL.
4. **Snapshot** — `src/data/githubSnapshot.js` (números curados del mockup, sin datos falsos).

Badge en los paneles: `● live` · `◍ cache` · `◌ local`.

## Qué alimenta cada panel

| Panel | Fuente |
|---|---|
| `$ git log --contribuciones` (calendario) | **GraphQL** `contributionsCollection` — requiere token **propio**. Selector de año (2026/2025) con `from`/`to` |
| `$ actividad --6-meses` (curva) | Sumas semanales del calendario real; sin él, los feeds de commits; sin nada, curva del mockup |
| `$ commits --live` | Feeds de commits de las 5 repos con push más reciente (la Events API ya no incluye commits) |
| `$ repos --por-lenguaje` | `language` de tus repos públicas reales |
| `$ stats` | `public_repos` + año de creación reales |
| `$ ls ~/repos --nuevas` | Repos públicas que no estén en el bento curado |

## El token (crítico)

El calendario real de contribuciones **solo existe vía GraphQL autenticado con un
token de tu propia cuenta**. Sin token, todo lo demás funciona (commits, lenguajes,
stats) pero el calendario muestra el grid del mockup y el selector se oculta.

- Crear el token logueado como **AlexisHCD** (classic, sin scopes; o fine-grained
  read-only público). La función valida `user.login === "AlexisHCD"` antes de aceptarlo.
- Configurarlo en Vercel como `GITHUB_TOKEN` — **nunca llega al navegador**.

## Revalidar

El hook refresca al montar, al volver a la pestaña (throttle 60s) y cada 5 min.
Caché por año en localStorage; cualquier caché malformada se descarta sola.
