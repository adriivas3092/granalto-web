# Granalto — Guía del proyecto (para Claude)

Sitio corporativo de Granalto Costa Rica (piedra y superficies premium).
Lee esto primero para no re-explorar el repo en cada sesión.

## Stack
- Next.js 15 (App Router) · TypeScript strict · Tailwind v4 (`@theme` tokens: ink, ivory, charcoal, mineral, stone-beige) · Montserrat.
- `next/image`, lucide-react, framer-motion, Zustand + persist, React Hook Form + Zod v4.
- Supabase (Postgres, Auth, Storage, RLS) para tienda/admin. Deploy en Vercel.

## Comandos
- Typecheck (usar SIEMPRE antes de commit): `npx tsc --noEmit -p tsconfig.json`
- Tests del motor de cotización: `npx vitest run`
- Lint puntual: `npx eslint <archivo>`

## Flujo de git y deploy (IMPORTANTE)
- Se desarrolla en `/home/user/Granalto`.
- `origin` local apunta a `adriivas3092/Granalto`, que **NO** acepta push (404).
- El repo con push real es **`/workspace/granalto-web`** (`adriivas3092/granalto-web`).
- Rama de trabajo: **`claude/granalto-website-redesign-0z607s`**.
- Ciclo por cambio:
  1. Editar en `/home/user/Granalto`, `npx tsc --noEmit`, `git add`, `git commit`.
  2. `git format-patch -1 HEAD --stdout > /tmp/.../x.patch`
  3. `cd /workspace/granalto-web && git am x.patch`
  4. `git push -u origin claude/granalto-website-redesign-0z607s` (reintentos con backoff).
  5. Verificar el tip real con `git ls-remote origin <rama>` (el `git log origin/...` del proxy queda cacheado/desactualizado).
- Vercel auto-deploya `granalto-web` → **https://granalto-web.vercel.app** (equipo `latente-studio-cr`, proyecto `prj_OWHwaqLVTSrdKJvUaNwaiyOiLTU7`). La rama de trabajo es la de producción.
- **Caché de imágenes:** al reemplazar una foto, usar un **nombre de archivo nuevo** (no sobrescribir), o el navegador/CDN sigue mostrando la vieja.

## Contenido (data-driven)
Casi todo el contenido vive en `src/data/*.ts` (no en la base de datos):
- `materials.ts` — sección /materiales (9 materiales). Fotos reales en `public/images/materiales/<slug>.jpg`.
- `collections.ts` — Cocina, Baño, Hogar. Cada una: `coverImage` (hero) + `gallery`. Fotos en `public/images/photos/`.
- `projects.ts` — proyectos por colección. Ver "Sistema de proyectos".
- `blog.ts` — artículos reales. Portadas en `public/images/blog/`.
- `brands.ts`, `catalogs.ts`, `reviews.ts`, `locations.ts`, `hero.ts`, `faqs.ts`.
- Config de nav: `src/config/navigation.ts`.

### Sistema de proyectos (fichas en Colecciones)
- Tipo `Project` (en `src/types/index.ts`): además de lo básico, `partner?` y `credits?: {label,value}[]`.
- Componente `src/components/sections/ProjectShowcase.tsx`: título + línea "Trabajo realizado en conjunto con {partner}" + créditos, y a la par `ImageGallery` (miniaturas con lightbox, ya existente).
- La página `src/app/colecciones/[slug]/page.tsx` renderiza SOLO los proyectos con galería (`gallery.length > 0`) de la categoría (`cocina|bano|hogar`). Sin encabezado.
- Para agregar un proyecto: nuevo objeto al inicio de `projects` con `category`, `partner`, `credits`, `coverImage`, `gallery` (fotos en `public/images/proyectos/<slug>-N.jpg`). Los nuevos van arriba.

## Fotos que sube el usuario (workflow)
El usuario sube imágenes en el chat. Para colocarlas: extraerlas del transcript JSONL
(`/root/.claude/projects/-home-user-Granalto/<id>.jsonl`) con el script
`scratchpad/extract_imgs.py` (base64, excluye las de `tool_result`, dedup por md5,
guarda en orden 000..NNN). Las últimas N son las recién subidas. Copiarlas a la
carpeta pública que corresponda con nombre por slug.

## Supabase / tienda
- Config pública: `src/lib/supabase/config.ts` (url + anon key del proyecto del usuario).
- Cliente service_role: `src/lib/supabase/service.ts` (solo servidor; requiere `SUPABASE_SERVICE_ROLE_KEY` en Vercel).
- Endpoint de sync ERP/SAP: `src/app/api/sync/products/route.ts` (auth por header `x-api-key` = `SYNC_API_KEY`). Docs: `docs/sync-productos-sap.md`.
- **Seguridad:** NUNCA pedir ni pegar en el chat la `service_role` key. El `SYNC_API_KEY` lo inventa el usuario.

## Pendientes conocidos
- Tienda: 191 productos cargados ocultos y en precio 0 (falta lista SKU→precio y fotos).
- SQL de reducción de categorías (Todos/Tenax/Wilsonart/Granalto): entregado, sin confirmar ejecución.
- Google reviews: falta Place ID / API key para reseñas en vivo.
