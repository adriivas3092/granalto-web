-- Disponibilidad de materiales/colores para el cotizador.
-- Permite al admin marcar un color como "agotado" o "disponible" sin tocar el
-- código. El cotizador lee esta tabla (lectura pública) y usa el valor del
-- catálogo como respaldo cuando no hay fila.

create table if not exists public.material_disponibilidad (
  material_id text not null,
  color_id    text not null,
  agotado     boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (material_id, color_id)
);

alter table public.material_disponibilidad enable row level security;

-- Lectura pública: el cotizador (visitantes anónimos) necesita leerla.
drop policy if exists "md_select_public" on public.material_disponibilidad;
create policy "md_select_public"
  on public.material_disponibilidad
  for select
  using (true);

-- Escritura solo para administradores.
drop policy if exists "md_insert_admin" on public.material_disponibilidad;
create policy "md_insert_admin"
  on public.material_disponibilidad
  for insert
  with check (public.is_admin());

drop policy if exists "md_update_admin" on public.material_disponibilidad;
create policy "md_update_admin"
  on public.material_disponibilidad
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "md_delete_admin" on public.material_disponibilidad;
create policy "md_delete_admin"
  on public.material_disponibilidad
  for delete
  using (public.is_admin());
