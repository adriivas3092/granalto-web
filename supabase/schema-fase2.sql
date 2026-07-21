-- =====================================================================
-- Granalto — Fase 2: Clientes y Pedidos
-- Ejecutar UNA vez en: SQL Editor → New query → Run
-- Requiere haber corrido antes schema.sql (tablas products/categories/admins,
-- y la función public.is_admin()).
-- =====================================================================

-- ---------- Tabla: profiles (datos del cliente) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  address    text,
  created_at timestamptz not null default now()
);

-- Crea automáticamente un perfil cuando se registra un usuario nuevo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Tabla: orders (pedidos) ----------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references auth.users(id) on delete cascade,
  status           text not null default 'pendiente',
  currency         text not null default 'CRC',
  subtotal         numeric(12,2) not null default 0,
  total            numeric(12,2) not null default 0,
  customer_name    text not null default '',
  customer_email   text not null default '',
  customer_phone   text,
  shipping_address text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists orders_status_idx   on public.orders(status);
create index if not exists orders_created_idx  on public.orders(created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- Tabla: order_items (detalle) ----------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  unit_price   numeric(12,2) not null default 0,
  quantity     int not null default 1,
  line_total   numeric(12,2) not null default 0
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- profiles: cada quien ve/edita su propio perfil; admin ve todos
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_self_upsert on public.profiles;
create policy profiles_self_upsert on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- orders: el cliente ve/crea sus pedidos; admin ve y actualiza todos
drop policy if exists orders_own_read on public.orders;
create policy orders_own_read on public.orders
  for select using (customer_id = auth.uid() or public.is_admin());

drop policy if exists orders_own_insert on public.orders;
create policy orders_own_insert on public.orders
  for insert with check (customer_id = auth.uid());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- order_items: visibles/creables si el pedido pertenece al usuario (o admin)
drop policy if exists order_items_own_read on public.order_items;
create policy order_items_own_read on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists order_items_own_insert on public.order_items;
create policy order_items_own_insert on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );
