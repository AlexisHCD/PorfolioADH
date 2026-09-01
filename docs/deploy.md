# Despliegue — Vercel

## Paso 0 — Requisitos previos (tokens)

1. **`GITHUB_TOKEN`** (calendario de contribuciones): crear en github.com → Settings → Developer settings → Personal access tokens, **con sesión iniciada como AlexisHCD** (classic sin scopes; solo lectura pública alcanza). Copiar el valor.
2. **`VITE_WEB3FORMS_ACCESS_KEY`**: dar de alta el formulario en [web3forms.com](https://web3forms.com) (capa gratuita: 250 envíos mensuales, hCaptcha incluida) asociado al correo `adhcamus@gmail.com`. La key es pública por diseño; el dato sensible es el token de GitHub.

## Paso 1 — Push del repositorio

El push requiere aprobación explícita del autor. El remote ya está configurado: `github.com/AlexisHCD/PorfolioADH` (rama `main`).

## Paso 2 — Importar en Vercel

1. vercel.com → Add New → Project → importar `PorfolioADH`.
2. Framework: Vercel detecta **Vite** automáticamente (build `npm run build`, salida `dist/`). No modificar.
3. **Environment Variables** (Production y Preview):
   - `GITHUB_TOKEN` = valor del paso 0.1 — solo server-side, nunca se expone al navegador.
   - `VITE_WEB3FORMS_ACCESS_KEY` = valor del paso 0.2.
4. Ejecutar el deploy. `api/github.js` se detecta automáticamente como función serverless y `vercel.json` incluye las rewrites SPA y los security headers.

## Paso 3 — Lista de verificación posterior

- [ ] `GET https://<dominio>/api/github?year=2026` devuelve JSON con `calendar.length > 0`
- [ ] Inicio: insignias `● live` en Actividad; el calendario muestra el total real (coincidente con el perfil)
- [ ] El selector de año 2026/2025 cambia la cuadrícula
- [ ] Formulario: envío de prueba llega al correo (verificar spam la primera vez)
- [ ] `/aviso-legal` y `/politica-de-privacidad` resuelven sin 404
- [ ] Security headers presentes (`curl -I https://<dominio>` → CSP, X-Frame-Options)
- [ ] Favicon y `og.png` accesibles

## Posterior al despliegue (opcional)

- Dominio propio: añadir `og:url` y `<link rel="canonical">` en `index.html`, y la directiva `Sitemap:` en `robots.txt`.
- Documentar la URL de producción en el README.
