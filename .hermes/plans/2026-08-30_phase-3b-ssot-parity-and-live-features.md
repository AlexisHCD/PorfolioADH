# Phase 3b — Mockup SSOT parity (done) + Live features plan

Date: 2026-08-30 · Status: A) DONE committed · B/C/D) APPROVED with decisions below, awaiting build

## User decisions (2026-08-30)

- **GitHub live (B):** user rejects per-IP-quota dependence → **serverless-first**: Vercel
  Function with `GITHUB_TOKEN` + CDN cache + optional cron pre-warm. Client-direct fetch stays
  only as the offline/fallback path. Details in section B.
- **Contact form (C):** approved on Web3Forms. **No classic `mailto:` fallback** — on failure
  show inline error + retry + "copiar correo" action instead. Validation model agreed (see C).
  Every new page/component MUST reuse the CSS-variable theme system so day/night + accents
  keep working everywhere (no hardcoded colors).
- **Legal pages (D):** approved. Disclaimer must link BOTH laws by official title: Ley N° 19.628
  "sobre Protección de la Vida Privada" and Ley N° 21.719 "Regula la protección y el tratamiento
  de los datos personales y crea la Agencia de Protección de Datos Personales" (links to BCN).

## A) Mockup as SSOT — text/data sync (DONE this session)

Site content now mirrors `mockups/phosphor.html` 1:1:

- `profile.js`: 5 projects (added `portfolio-v2`, new `tag`/`meta` fields, mockup descs/chips/repos),
  stack groups & items (HTML5/CSS3, `frameworks & web`, datos +Modelado de datos/SQL,
  `herramientas & os` full list), roadmap semesters 02–05 (mockup courses, sem 05 =
  "Práctica Profesional" + `→ Técnico…` chip), `careerShort`, certificates `ledger` lines
  (scene-style `$ verify --cert …`), identity.photoAlt, footer strings.
- Components: Projects (mockup markup, `.proj-grid`, desc line, index tags, no pills),
  Roadmap ("PRÓXIMO PASO" badge, desc period), About (REDES labels `github.com/AlexisHCD` /
  `in/alexis-hernández`, suffixes conecta/—, INTERESES single line, `.card` ported class),
  Stack ("Tech Stack" + desc), Activity (desc, dropped extra "182 días" line), Contact
  (`@Mkeled ↗`), Footer (mockup 3 lines, GPL webprboom link).
- Hover fix: project cards lost `useMagnetic` (mockup has plain lift); ported `.proj` CSS owns
  hover (translateY(-5px) + accent border + arrow nudge). `useRevealGroup` now `clearProps` so
  GSAP entrance doesn't leave inline transforms that would block `:hover` transforms.
- `Capturasyvideos/` gitignored (temp folder, user will delete).
- Gate: lint ✓ · build ✓ · 59/59 tests ✓ · browser-verified (5 cards, hover lift, roadmap).

## B) Feature: GitHub live activity (// 03 Actividad + auto-repos in // 04)

Goal: chart + stats + new public repos + recent commits, refreshed live from @AlexisHCD.

**Architecture (DECIDED: serverless-first).**

- `api/github.js` — one Vercel Function, ~40 lines. Holds `GITHUB_TOKEN` as env var (never in
  client). Token quota: 5,000 req/h.
- The function fans out to `/users/AlexisHCD`, `/users/AlexisHCD/repos?sort=created&per_page=100`,
  `/users/AlexisHCD/events/public?per_page=30`, reduces to one small JSON payload
  `{ repos, commits, stats, fetchedAt }` and answers with
  `Cache-Control: s-maxage=900, stale-while-revalidate=86400`.
- Effect: Vercel's edge CDN serves ONE cached response to every visitor worldwide; GitHub sees
  ~1 request per 15 min (~96/day) regardless of traffic. Expired window? The first visitor
  triggers revalidation but is served the stale copy instantly (SWR) — no cold first-visitor and
  no cron strictly needed (Vercel cron pre-warm optional; Hobby plan crons run max 1×/day, so
  SWR is the real mechanism).
- Fallback chain (site never breaks): edge cache → function last-good payload → client
  localStorage cache → committed snapshot (`src/data/githubSnapshot.js`). Panel badge:
  `● live` / `◍ cache` / `◌ offline`.
- Privacy bonus: visitor IPs never touch api.github.com — the function's egress IP does.
- UI (bento symmetry, user request):
  - New panel `// 03` `$ commits --live` — same-size rectangle next to/under the activity chart:
    last 6 commits (repo, short message, relative time), pulsing green dot rows.
  - Heatmap/chart/stats rehydrate from live events when available (same mono look, real data).
  - `// 04` new compact terminal-style block `$ ls ~/repos --nuevas` under the curated bento:
    public repos not already in `projects` (name, language, ★, created) auto-listed with links.
- Refresh cadence: on section enter + `visibilitychange` + 5-min idle interval.
- `src/lib/github.js` normalizes payloads; `useGitHubLive.js` hook with
  `{ source: 'live' | 'cache' | 'snapshot' }`.
- Tests: `github.js` unit (mock fetch, cache TTL, fallback), hook test, contract keeps working
  offline (snapshot shipped).

## C) Feature: modern contact form (// 07)

**Recommended: Web3Forms** — free 250 submissions/month, unlimited forms/domains, hCaptcha on
free tier, no backend (Formspree free is only 50/month; both fine to swap later — same POST
contract). Access key lives in client code by design (Web3Forms keys are public-facing).

- UI: terminal/bento panel under the email copy button in `// 07`: nombre · email · mensaje,
  floating labels mono-style, submit → `$ enviar --mensaje`, states enviando/✓/error
  (aria-live), honeypot field, link to the privacy page next to the submit button.
- Validation (user question, agreed): **client-side** required fields + email format + length
  caps + honeypot (instant UX feedback); **Web3Forms server-side** validates access key, runs
  hCaptcha + abuse rate-limits, forwards sanitized content. No custom server logic — junk that
  passes both simply lands in the inbox, same as email.
- NO classic `mailto:` fallback (user decision): on fetch failure show inline error state with
  retry button + "copiar correo" copy action — same visual language as the form.
- Alternative (more control, needs email domain): Vercel Function + Resend (free ~100/day) —
  defer until a custom domain exists.

## D) Feature: legal pages (aviso legal + política de privacidad, Chile/LatAM)

- Routing: add `react-router-dom`; routes `/aviso-legal` and `/politica-de-privacidad` +
  catch-all → home. ScrollRestoration to top. Keep hash anchors working (nav `#/…` → same page
  anchors need `HashLink`-style handling or keep nav as-is with `to="/#seccion"`).
  Lighter alternative if we want zero deps: query-param/hash page switch — NOT recommended;
  router is standard and cheap.
- Content (es-CL, written for a personal non-commercial portfolio):
  - **Aviso legal**: titular (Alexis Hernández Camus · San Antonio, CL · adhcamus@gmail.com),
    propósito del sitio, propiedad intelectual (contenido propio; DOOM © id Software vía
    webprboom — GPL, crédito visible; logo/derechos de terceros), enlaces externos
    (GitHub/LinkedIn/X), limitación de responsabilidad, uso aceptable, ley aplicable y
    tribunales chilenos.
  - **Política de privacidad**: datos tratados (formulario: nombre/email/mensaje → Web3Forms
    como encargado, con link a su política), datos técnicos (hosting Vercel logs; peticiones a
    api.github.com exponen IP a GitHub), localStorage (solo preferencia de tema
    `alexdevos-theme` — sin tracking/cookies propias), conservación, derechos
    acceso/rectificación/cancelación/oposición (Ley 19.628), y nota de alineación con
    **Ley 21.719** (publicada 13-dic-2024, entrada en vigor plena prevista 1-dic-2026:
    Agencia de Protección de Datos, multas hasta 20.000 UTM) — 3 meses después del deploy,
    conviene nacer cumpliendo. Ambas leyes se enlazan por título oficial al texto BCN:
    Ley N° 19.628 "sobre Protección de la Vida Privada" (leychile.navegar?idNorma=29512) y
    Ley N° 21.719 "Regula la protección y el tratamiento de los datos personales y crea la
    Agencia de Protección de Datos Personales" (leychile.navegar?idNorma=1209272).
    Contacto del responsable: adhcamus@gmail.com.
- Design: documentation-style page (prose, mono section tags `// 01`), theme-aware, same nav.
- Footer: two new links between the credit and build lines.

## Proposed order

1. B (GitHub live) — biggest value, pure client-side, no external accounts.
2. C (form) — needs one Web3Forms access key from the user (2 min signup).
3. D (legal pages) — copy review by user before shipping.
After all three → Phase 4 QA (Playwright + axe + Lighthouse) per master plan.

## Sources

- GitHub REST rate limits: docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- Web3Forms pricing: web3forms.com/pricing · Formspree free tier comparisons (splitforms.com, merginit.com)
- Ley 21.719: bcn.cl/leychile idNorma=1209272 · wikiguias.digital.gob.cl (published 13-12-2024) ·
  xmslatam.com / codigolegal.cl (full force 1-12-2026, postponement under discussion)
