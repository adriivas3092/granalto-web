# Granalto — Sitio web corporativo

Sitio web premium de **Granalto Costa Rica**, empresa especializada en
superficies, materiales y acabados premium para arquitectura, diseño de
interiores y construcción.

## Objetivo

Permitir a los visitantes conocer Granalto, explorar colecciones por tipo
de espacio (cocina, baño, hogar), descubrir materiales, consultar marcas,
descargar catálogos, leer contenido editorial, encontrar los showrooms y
solicitar asesoría — con una experiencia rápida, accesible y fácil de
administrar.

## Tecnologías

- [Next.js 15](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com) (tokens de diseño en `src/app/globals.css`)
- [Framer Motion](https://www.framer.com/motion/) (disponible para animaciones discretas)
- [Lucide Icons](https://lucide.dev)
- `next/font` (Fraunces para titulares, Inter para textos)

## Instalación

```bash
npm install
```

## Variables de entorno

Copie `.env.example` a `.env.local` y complete los valores:

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (para SEO, sitemap, canonical) |
| `NEXT_PUBLIC_GA_ID` | ID de Google Analytics 4 (opcional) |
| `NEXT_PUBLIC_GTM_ID` | ID de Google Tag Manager (opcional) |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID de Meta Pixel (opcional) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp (formato internacional sin `+`) |
| `CONTACT_WEBHOOK_URL` | Webhook que recibe las solicitudes del formulario |
| `CONTACT_EMAIL` | Correo receptor (integración futura) |

## Ejecución local

```bash
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run lint     # ESLint
npx tsc --noEmit # validación de TypeScript
npm run build    # build de producción
npm start        # servir el build
```

## Despliegue

El proyecto es un sitio Next.js estándar: puede desplegarse en Vercel,
Netlify, o cualquier servidor Node. Configure las variables de entorno de
producción y ejecute `npm run build && npm start`.

## Edición de contenido

Todo el contenido empresarial vive en archivos de datos tipados — los
componentes visuales no contienen información importante. Esto permite
migrar después a un CMS (Sanity, Strapi, Contentful, Supabase) sin tocar
los componentes.

| Archivo | Contenido |
| --- | --- |
| `src/config/site.ts` | Nombre, dominio, teléfonos, WhatsApp, correo, redes, SEO base, mensajes |
| `src/config/navigation.ts` | Menús de navegación |
| `src/data/collections.ts` | Colecciones (cocina, baño, hogar) y subcategorías |
| `src/data/materials.ts` | Materiales y su ficha completa |
| `src/data/catalogs.ts` | Catálogos descargables |
| `src/data/brands.ts` | Marcas representadas |
| `src/data/blog.ts` | Artículos del blog |
| `src/data/locations.ts` | Showrooms y ubicaciones |
| `src/data/projects.ts` | Proyectos destacados |
| `src/data/faqs.ts` | Preguntas frecuentes |

### Cómo agregar un material

1. Agregue las imágenes a `public/images/` (portada + galería).
2. Añada un objeto `Material` a `src/data/materials.ts` (copie uno
   existente como plantilla; el `slug` define la URL `/materiales/[slug]`).
3. La página, el sitemap y el muestrario se generan automáticamente.

### Cómo agregar una colección

Añada un objeto `Collection` a `src/data/collections.ts`. La URL será
`/colecciones/[slug]`. Las subcategorías son texto editable.

### Cómo agregar un catálogo

1. Coloque el PDF en `public/catalogs/`.
2. Añada un objeto `Catalog` a `src/data/catalogs.ts` con
   `fileUrl: "/catalogs/archivo.pdf"`. Sin `fileUrl`, la tarjeta muestra
   "Disponible próximamente".

### Cómo agregar una entrada de blog

Añada un objeto `BlogPost` a `src/data/blog.ts`. El campo `content` acepta
párrafos separados por línea en blanco y subtítulos con `## `.

### Cómo modificar ubicaciones

Edite `src/data/locations.ts`. Los campos sin validar (horario, mapa,
coordenadas) pueden dejarse vacíos y la interfaz los omite; el CTA
"Cómo llegar" aparece solo cuando `mapUrl` existe.

### Cómo configurar WhatsApp

- Número: `NEXT_PUBLIC_WHATSAPP_NUMBER` (o `src/config/site.ts`).
- Mensajes predeterminados: `siteConfig.whatsappMessages` en
  `src/config/site.ts`.

### Cómo configurar analítica

Defina los IDs en `.env.local`. La capa de eventos (`src/lib/analytics.ts`)
ya registra: clic en WhatsApp/teléfono/correo, envío de formulario,
apertura/descarga de catálogo, "cómo llegar", vistas de material y clics en
"Solicitar asesoría". Los eventos se envían a `dataLayer` (GTM), `gtag`
(GA4) y `fbq` (Meta Pixel) cuando esos scripts están presentes.

### Cómo conectar un CMS posteriormente

Los componentes consumen datos a través de funciones (`getMaterials()`,
`getCollectionBySlug()`, …) exportadas por `src/data/*`. Para migrar a un
CMS, reimplemente esas funciones para leer del CMS (pueden volverse
`async`) manteniendo los tipos de `src/types` — los componentes no
necesitan cambios estructurales.

### Formulario de contacto

`/api/contact` valida la solicitud (misma validación que el frontend,
`src/lib/validation.ts`, con honeypot anti-spam) y:

- si `CONTACT_WEBHOOK_URL` está configurado, reenvía el payload JSON a ese
  webhook (Kommo, Make, Zapier o API propia);
- si no, opera en modo prueba (registra en la consola del servidor).

## Contenido pendiente

Ver [`CONTENT_TODO.md`](./CONTENT_TODO.md): fotografías, logos, catálogos,
horarios, coordenadas, redes sociales y textos que Granalto debe validar
antes de producción. En el código, los datos por confirmar están marcados
con `PENDIENTE_VALIDAR`.
