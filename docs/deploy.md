# Deploy — Vercel (runbook)

## Paso 0 — Requisitos previos (los dos tokens)

1. **`GITHUB_TOKEN`** (calendario real): crear en github.com → Settings → Developer
   settings → Personal access tokens. **Debe crearse logueado como AlexisHCD**
   (classic, sin scopes — solo lectura pública alcanza). Copiar el valor.
2. **`VITE_WEB3FORMS_ACCESS_KEY`**: crear el form en [web3forms.com](https://web3forms.com)
   (gratis, 250 envíos/mes, hCaptcha incluida) con el email `adhcamus@gmail.com`.
   Esta key es pública por diseño; lo sensible es el token de GitHub.

## Paso 1 — Push del repo

El push necesita aprobación explícita del autor. Remote ya configurado:
`github.com/AlexisHCD/PorfolioADH` (branch `main`).

## Paso 2 — Importar en Vercel

1. vercel.com → Add New → Project → importar `PorfolioADH`.
2. Framework: detecta **Vite** automáticamente. Build `npm run build`,
   output `dist/` — no cambiar.
3. **Environment Variables** (Production + Preview):
   - `GITHUB_TOKEN` = (valor del paso 0.1) — solo server-side, nunca al navegador
   - `VITE_WEB3FORMS_ACCESS_KEY` = (valor del paso 0.2)
4. Deploy. `api/github.js` se detecta automáticamente como serverless function y
   `vercel.json` ya trae las rewrites SPA + security headers.

## Paso 3 — Checklist post-deploy

- [ ] `GET https://<dominio>/api/github?year=2026` → JSON con `calendar.length > 0`
- [ ] Home: badges `● live` en Actividad; calendario muestra el total real (≈ el de tu perfil)
- [ ] Selector de año 2026/2025 cambia el grid
- [ ] Formulario: envío de prueba llega al correo (revisar spam la primera vez)
- [ ] `/aviso-legal` y `/politica-de-privacidad` resuelven (no 404)
- [ ] Security headers presentes (`curl -I https://<dominio>` → CSP, X-Frame-Options…)
- [ ] Favicon y `og.png` accesibles

## Post-deploy opcional

- Dominio propio → añadir `og:url` + `<link rel="canonical">` en `index.html` y
  `Sitemap:` en `robots.txt`.
- Responder al comentario del deploy con la URL para preview en el README.
