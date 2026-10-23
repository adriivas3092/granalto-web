-- =====================================================================
-- Categorías Tenax para la tienda
-- =====================================================================
-- Agrega las categorías de producto Tenax. Es idempotente: se puede
-- ejecutar varias veces sin crear duplicados (conflict por slug).
--
-- Cómo correrlo: Supabase → SQL Editor → pegar y Run.
--
-- Después de esto, el desplegable de "Categoría" en el panel de admin
-- (crear/editar producto) mostrará estas categorías automáticamente, y la
-- tienda permitirá filtrar y buscar por ellas.
-- =====================================================================

insert into public.categories (name, slug, position) values
  ('Adhesivos',             'adhesivos',             10),
  ('Complementos',          'complementos',          11),
  ('Selladores',            'selladores',            12),
  ('Tratamientos',          'tratamientos',          13),
  ('Limpieza profesional',  'limpieza-profesional',  14)
on conflict (slug) do nothing;
