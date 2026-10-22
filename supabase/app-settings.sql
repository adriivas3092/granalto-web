-- Ajustes generales de la aplicación (interruptores on/off del admin).
-- Lectura pública; escritura solo para administradores.

create table if not exists public.app_settings (
  clave      text primary key,
  valor      boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

drop policy if exists "settings_select_public" on public.app_settings;
create policy "settings_select_public"
  on public.app_settings
  for select
  using (true);

drop policy if exists "settings_write_admin" on public.app_settings;
create policy "settings_write_admin"
  on public.app_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());
