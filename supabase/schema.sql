-- =====================================================================
-- Granalto — Tienda + Admin  (esquema completo para Supabase)
-- Ejecutar una sola vez en: SQL Editor → New query → Run
-- =====================================================================

-- ---------- Extensiones ----------
create extension if not exists pgcrypto;

-- ---------- Tabla: categories ----------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  position   int  not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Tabla: products ----------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  sku              text,
  category_id      uuid references public.categories(id) on delete set null,
  description      text,
  price            numeric(12,2) not null default 0,
  currency         text not null default 'CRC',
  compare_at_price numeric(12,2),
  stock            int  not null default 0,
  available        boolean not null default true,
  featured         boolean not null default false,
  image_url        text,
  gallery          jsonb not null default '[]'::jsonb,
  attributes       jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_available_idx on public.products(available);
create index if not exists products_featured_idx  on public.products(featured);

-- trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- Tabla: admins ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- función de comprobación (security definer para evitar recursión en RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.admins     enable row level security;

-- categories: lectura pública, escritura solo admin
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (true);

drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- products: público ve solo disponibles; admin ve/edita todo
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (available = true or public.is_admin());

drop policy if exists products_admin_write on public.products;
create policy products_admin_write on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- admins: cada quien puede leer su propia fila
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select using (user_id = auth.uid());

-- =====================================================================
-- Storage: bucket de imágenes de productos
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists product_images_admin_write on storage.objects;
create policy product_images_admin_write on storage.objects
  for all
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- =====================================================================
-- Semilla (categorías + productos de ejemplo)  — opcional
-- =====================================================================
insert into public.categories (name, slug, position) values
  ('Piedra natural',        'piedra-natural',        1),
  ('Superficies técnicas',  'superficies-tecnicas',  2),
  ('Grifería',              'griferia',              3),
  ('Sanitarios',            'sanitarios',            4),
  ('Cuidado y mantenimiento','cuidado-mantenimiento', 5)
on conflict (slug) do nothing;

insert into public.products (name, slug, sku, category_id, description, price, currency, stock, featured, available)
select p.name, p.slug, p.sku, c.id, p.description, p.price, 'CRC', p.stock, p.featured, true
from (values
  ('Granito Negro Absoluto','granito-negro-absoluto','GR-001','piedra-natural','Placa de granito negro absoluto, acabado pulido.', 185000, 12, true),
  ('Cuarzo Blanco Calacatta','cuarzo-blanco-calacatta','CZ-002','superficies-tecnicas','Superficie de cuarzo con vetas tipo Calacatta.', 240000, 8, true),
  ('Grifería monomando cocina','griferia-monomando-cocina','GF-003','griferia','Grifo monomando de acero inoxidable para cocina.', 78000, 20, false),
  ('Lavamanos sobre encimera','lavamanos-sobre-encimera','SN-004','sanitarios','Lavamanos cerámico de sobreponer, forma ovalada.', 62000, 15, false),
  ('Sellador para piedra natural','sellador-piedra-natural','CM-005','cuidado-mantenimiento','Sellador penetrante para granito y mármol, 1L.', 18500, 40, false)
) as p(name, slug, sku, cat_slug, description, price, stock, featured)
join public.categories c on c.slug = p.cat_slug
on conflict (slug) do nothing;
