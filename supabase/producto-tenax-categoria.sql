-- =====================================================================
-- Subcategoría Tenax en productos
-- =====================================================================
-- Agrega la columna `tenax_category` a la tabla de productos. Es un segundo
-- nivel de clasificación, SOLO para productos de la línea Tenax, aparte de la
-- categoría general (`category_id`). Guarda uno de estos valores (o NULL):
--   adhesivos | complementos | selladores | tratamientos | limpieza-profesional
--
-- Idempotente: se puede correr varias veces sin error.
--
-- Cómo correrlo: Supabase → SQL Editor → pegar y Run.
-- =====================================================================

alter table public.products
  add column if not exists tenax_category text;

create index if not exists products_tenax_category_idx
  on public.products(tenax_category);
