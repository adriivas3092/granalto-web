-- =====================================================================
-- Granalto — Blog gestionable desde el Admin
-- Ejecutar una sola vez en: Supabase → SQL Editor → New query → Run
-- (requiere que ya exista el esquema base: public.is_admin() y
--  public.set_updated_at() se crean en supabase/schema.sql)
-- =====================================================================

-- ---------- Tabla: blog_posts ----------
create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text not null default '',
  content         text not null default '',
  category        text not null default 'Novedades',
  author          text not null default 'Equipo Granalto',
  published_at    date not null default current_date,
  reading_time    int  not null default 1,
  cover_image_url text,
  cover_image_alt text not null default '',
  featured        boolean not null default false,
  published       boolean not null default false,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts(published);
create index if not exists blog_posts_published_at_idx on public.blog_posts(published_at desc);

-- trigger updated_at (reutiliza la función del esquema base)
drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------- RLS ----------
alter table public.blog_posts enable row level security;

-- público ve solo publicados; admin ve/edita todo
drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
  for select using (published = true or public.is_admin());

drop policy if exists blog_posts_admin_write on public.blog_posts;
create policy blog_posts_admin_write on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage: imágenes de portada del blog ----------
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists blog_images_public_read on storage.objects;
create policy blog_images_public_read on storage.objects
  for select using (bucket_id = 'blog-images');

drop policy if exists blog_images_admin_write on storage.objects;
create policy blog_images_admin_write on storage.objects
  for all
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());

-- =====================================================================
-- Seed: importa los artículos que estaban en el código (src/data/blog.ts).
-- Idempotente: no duplica si el slug ya existe.
-- =====================================================================
insert into public.blog_posts
  (slug, title, excerpt, content, category, author, published_at, reading_time,
   cover_image_url, cover_image_alt, featured, published, seo_title, seo_description)
values
  ('cuarcita-la-opcion-perfecta-para-cocinas', 'Cuarcita: la opción perfecta para cocinas que combinan lujo y durabilidad', 'La estética del mármol con una resistencia muy superior: por qué la cuarcita es ideal para cocinas modernas, funcionales y de alto uso.', 'La cuarcita es una piedra natural que ha ganado terreno por su estética parecida al mármol, pero con una resistencia muy superior. Es ideal para quienes desean una cocina moderna, funcional y que se mantenga impecable con el paso del tiempo.

## Beneficios de la cuarcita

- Tolerancia extrema al calor y a los rayones.
- Apariencia elegante y sofisticada.
- Excelente para áreas de alto uso, como cocinas familiares.
- Diseños exclusivos.

## ¿Por qué elegirla?

Si te gusta el aspecto del mármol pero necesitas la durabilidad del granito, la cuarcita ofrece el equilibrio perfecto. En Granalto, seleccionamos cuidadosamente las mejores planchas y garantizamos un trabajo de instalación de alta precisión.

Elegir cuarcita es apostar por la combinación de lujo y resistencia. Consúltanos para conocer nuestras opciones disponibles en Costa Rica.', 'Materiales', 'Equipo Granalto', '2026-08-05', 3, '/images/blog/cuarcita-lujo-y-durabilidad.jpg', 'Cocina moderna con sobre e isla en cuarcita de vetas doradas y frente de listones de madera', false, true, 'Cuarcita: la opción perfecta para cocinas que combinan lujo y durabilidad', 'La cuarcita une la estética del mármol con la resistencia del granito: tolerancia al calor y rayones, diseños exclusivos e instalación de precisión en Granalto Costa Rica.'),
  ('granito-en-costa-rica-elegancia-natural-y-resistencia', 'Granito en Costa Rica: elegancia natural y resistencia para tu cocina', 'Durabilidad, belleza natural y bajo mantenimiento: por qué el granito sigue siendo una de las mejores opciones para sobres de cocina, islas y baños.', 'El granito ha sido durante décadas uno de los materiales más valorados para sobres de cocina, y no es casualidad. En Costa Rica, cada vez más hogares apuestan por su durabilidad, belleza natural y fácil mantenimiento. En Granalto, somos especialistas en la venta de granito para cocina, con soluciones a la medida de cada proyecto.

## Ventajas del granito

- Alta resistencia al calor, golpes y rayones.
- Vetas únicas: cada plancha es diferente y exclusiva.
- Bajo mantenimiento.

## Aplicaciones recomendadas

- Sobres de cocina
- Islas centrales
- Sobres de baño

Elegir granito en Costa Rica para tu cocina no es solo una decisión estética, es una inversión en calidad de vida, durabilidad y valor para tu hogar. En Granalto, combinamos experiencia, materiales premium y pasión por el diseño para que cada cocina que entregamos sea única y funcional.

## ¿Listo para transformar tu cocina con granito?

Contactanos hoy y recibí una asesoría sin compromiso. También podés visitar nuestra galería de proyectos para inspirarte.

## Nuestros showrooms

**Escazú** — Guachipelín de Escazú, diagonal a Distrito Cuatro.
Lunes a viernes: 8:00 a.m. a 5:00 p.m. · Sábados: 9:00 a.m. a 2:00 p.m.

**Heredia** — Lagunilla de Heredia, Bodegas Lagunilla #2.
Lunes a viernes: 8:00 a.m. a 5:00 p.m. · Sábados: 8:00 a.m. a 1:00 p.m.

**Guanacaste** — Liberia, Parque Industrial Solarium, bodega 9.
Lunes a viernes: 8:30 a.m. a 5:30 p.m. · Sábados: 8:00 a.m. a 1:00 p.m.', 'Materiales', 'Equipo Granalto', '2026-08-05', 4, '/images/blog/granito-en-costa-rica-2.webp', 'Cocina con sobre y salpicadero en granito negro de vetas blancas y grifería negra', false, true, 'Granito en Costa Rica: elegancia natural y resistencia para tu cocina', 'Ventajas del granito para sobres de cocina, islas y baños: resistencia al calor, vetas únicas y bajo mantenimiento. Venta e instalación a la medida en Granalto Costa Rica.'),
  ('la-solucion-de-granalto-en-sobres-de-cocina', 'La solución de Granalto en sobres de cocina', 'Variedad de materiales para cada proyecto: fabricación e instalación de sobres de cocina en granito, mármol, cuarzo, cuarcita y porcelánico, con asesoría de principio a fin.', '## Variedad de materiales para cada proyecto

En Granalto, transformamos la piedra natural en piezas funcionales y elegantes que dan vida a los espacios más importantes de tu hogar o proyecto: la cocina.

Con más de 15 años de experiencia en el sector, nos especializamos en la fabricación e instalación de sobres de cocina en granito, mármol, cuarzo, cuarcita y porcelánicos, materiales seleccionados por su resistencia, estética y adaptabilidad al clima y estilo de vida costarricense.

Ya sea que estés construyendo la casa de tus sueños, remodelando tu apartamento o desarrollando un proyecto inmobiliario, en Granalto trabajamos uno a uno contigo para ofrecer soluciones a la medida. También colaboramos con estudios de arquitectura, constructoras y diseñadores que buscan calidad y cumplimiento en cada etapa del proyecto.

## ¿Qué nos diferencia?

- Asesoría personalizada desde el primer contacto
- Selección cuidadosa de materiales premium
- Corte y acabado de alta precisión
- Instalación profesional con atención al detalle

Convertí tu cocina en un espacio donde la funcionalidad y la belleza conviven todos los días. Con Granalto, cada sobre es una pieza única que refleja tu estilo.

Solicitá tu cotización o agenda una visita personalizada.', 'Materiales', 'Equipo Granalto', '2026-08-05', 4, '/images/blog/sobres-de-cocina-granalto.jpg', 'Bodega de Granalto con láminas de mármol, cuarcita, cuarzo y porcelánico en exhibición', false, true, 'La solución de Granalto en sobres de cocina', 'Fabricación e instalación de sobres de cocina en granito, mármol, cuarzo, cuarcita y porcelánico. Más de 15 años de experiencia, asesoría personalizada e instalación profesional en Costa Rica.'),
  ('como-elegir-el-material-ideal', '¿Cómo elegir el material ideal?', 'Una guía práctica para encontrar el material perfecto según el uso del espacio, la estética, el mantenimiento y el presupuesto de tu proyecto.', 'En Granalto, sabemos que la decisión no es sencilla, por eso te compartimos una guía práctica para que encuentres el material perfecto según tus necesidades y estilo.

## 1. Define el uso del espacio

El primer paso es considerar el propósito de la superficie:

- **Cocinas:** prioriza materiales resistentes a las manchas y al calor, como la piedra sinterizada.
- **Exteriores:** asegúrate de elegir un material duradero frente a las inclemencias climáticas, como la piedra natural.

## 2. Evalúa la estética

El diseño de tu espacio define mucho del impacto visual.

- **Tendencias modernas:** materiales como el Calacatta Gold o el Ivory imitan acabados naturales con un toque de sofisticación.
- **Estilos únicos:** mármoles como Gucci Red o Green Jade son perfectos para crear un ambiente exclusivo.

## 3. Mantenimiento

La facilidad de limpieza y el cuidado son factores clave.

- Para un bajo mantenimiento, las piedras sinterizadas o porcelánicos son ideales.
- Si prefieres algo más natural, los selladores pueden proteger el granito o el mármol.

## 4. Presupuesto

Define cuánto estás dispuesto a invertir. Materiales como el granito o el cuarzo ofrecen una excelente relación calidad-precio, mientras que opciones más exclusivas como la cuarcita tienen un costo mayor, pero añaden lujo y valor a tu espacio.

## ¿Por qué elegir Granalto?

En Granalto contamos con una amplia variedad de materiales como cuarzos, granitos, cuarcitas, mármoles y piedras sinterizadas. Te ayudamos a elegir el material ideal para que cada proyecto sea una obra de arte funcional.

¿Listo para transformar tu espacio? Contáctanos y hagamos realidad tu visión.', 'Guías', 'Equipo Granalto', '2026-08-05', 4, '/images/blog/como-elegir-material-ideal.jpg', 'Lavamanos esculpido en mármol con vetas doradas y grifería en acabado dorado', true, true, '¿Cómo elegir el material ideal? | Guía de Granalto', 'Guía práctica para elegir el material perfecto según el uso del espacio, la estética, el mantenimiento y el presupuesto. Cuarzos, granitos, cuarcitas, mármoles y piedras sinterizadas en Granalto Costa Rica.')
on conflict (slug) do nothing;
