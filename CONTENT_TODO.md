# Contenido pendiente de validación — Granalto

Este documento enumera los recursos y datos que Granalto debe aportar o
validar antes de publicar el sitio en producción. Los datos ya integrados
que requieren confirmación están marcados con `PENDIENTE_VALIDAR` en el
código (buscar ese texto en `src/`).

## Fotografías faltantes

Todos los archivos en `public/images/placeholders/` son SVG temporales que
deben reemplazarse por fotografías reales (formato JPG/WebP, mínimo 1600px
de ancho para imágenes de ambiente):

- [ ] Hero de portada (`hero-home`) — imagen o video de alto impacto
- [ ] Fotografía de showroom/planta para la introducción (`nosotros`)
- [ ] Colección Cocina: portada + 2 de galería
- [ ] Colección Baño: portada + 2 de galería
- [ ] Colección Hogar: portada + 2 de galería
- [ ] 10 materiales: portada + 1 ambiente por material (cuarcita, granito,
      mármol, cuarzo, porcelánico, superficie sólida, HPL, travertino,
      ónix, terrazzo)
- [ ] 3 showrooms (Lagunilla, Escazú, Liberia)
- [ ] Portadas de catálogos (Granalto, Tenax, Wilsonart)
- [ ] Imágenes de los 3 artículos del blog
- [ ] Imagen Open Graph definitiva 1200×630 (`public/images/og/`)

## Videos faltantes

- [ ] Video opcional para el hero de portada (optimizado, versión ligera
      para móvil o imagen estática de respaldo)

## Logos faltantes

- [ ] Logo oficial de Granalto (SVG vectorial + variantes claro/oscuro)
- [ ] Logos oficiales de marcas: Tenax, Wilsonart, ABK, Newform, Flaminia,
      Santa Margherita, Cambria (con autorización de uso)
- [ ] Favicon / ícono de la app (`src/app/` + `public/icons/`)

## Catálogos pendientes

Colocar los PDF en `public/catalogs/` y completar `fileUrl`, `year`,
`fileSize` en `src/data/catalogs.ts`:

- [ ] Catálogo de superficies Granalto
- [ ] Catálogo Tenax (mantenimiento)
- [ ] Catálogo Wilsonart (HPL)
- [ ] Otros catálogos de marcas (ABK, Newform, Flaminia, Santa Margherita, Cambria)

## URLs de redes sociales

Completar en `src/config/site.ts` (vacías = no se muestran):

- [ ] Instagram
- [ ] Facebook
- [ ] TikTok
- [ ] Pinterest
- [ ] YouTube
- [ ] LinkedIn

## Coordenadas y mapas de ubicaciones

Completar en `src/data/locations.ts` para cada sede:

- [ ] Coordenadas (latitud/longitud) — Lagunilla, Escazú, Liberia
- [ ] URL de Google Maps ("Cómo llegar") por sede
- [ ] Teléfono/WhatsApp directo por sede (si difiere del general)
- [ ] Imagen real de cada showroom

## Horarios por validar

- [ ] Horario de atención de Lagunilla, Heredia
- [ ] Horario de atención de Guachipelín, Escazú
- [ ] Horario de atención de Liberia, Guanacaste

## Textos que requieren aprobación

- [ ] Años de experiencia (la web anterior menciona "más de 15 años" —
      confirmar cifra antes de publicarla; hoy no se muestra)
- [ ] Descripciones de marcas en `src/data/brands.ts` (y confirmar la lista
      de marcas activas y sus sitios web oficiales)
- [ ] Artículos del blog (contenido de demostración en `src/data/blog.ts`)
- [ ] Respuestas de preguntas frecuentes (`src/data/faqs.ts`)
- [ ] Política de privacidad y términos y condiciones (revisión legal)
- [ ] Texto de la sección "Nosotros"

## Proyectos pendientes de documentar

Los 3 proyectos actuales son de demostración (`src/data/projects.ts`):

- [ ] Seleccionar 3–6 proyectos reales con fotografías profesionales
- [ ] Confirmar autorización del cliente para publicar ubicación
- [ ] Documentar material y marca utilizados en cada proyecto

## Materiales pendientes de fotografía

- [ ] Fotografías reales de láminas y ambientes por material
- [ ] Validar características/consideraciones técnicas por material con el
      equipo técnico de Granalto
- [ ] Confirmar qué marcas corresponden a cada material

## Integraciones pendientes

- [ ] Kommo CRM (conectar `CONTACT_WEBHOOK_URL` o API dedicada)
- [ ] Envío de correo del formulario (`CONTACT_EMAIL`)
- [ ] Google Analytics 4 (`NEXT_PUBLIC_GA_ID`)
- [ ] Google Tag Manager (`NEXT_PUBLIC_GTM_ID`)
- [ ] Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`)
- [ ] CAPTCHA opcional para el formulario
- [ ] CMS (Sanity/Strapi/Contentful/Supabase) cuando se decida

## Datos legales pendientes

- [ ] Razón social y cédula jurídica para las páginas legales
- [ ] Revisión de la política de privacidad por asesor legal
- [ ] Revisión de términos y condiciones por asesor legal

## Otros

- [ ] Inventario completo de URLs del sitio anterior para configurar
      redirecciones 301 (`next.config.ts` tiene las principales)
- [ ] Dominio final de producción (`NEXT_PUBLIC_SITE_URL`)
