-- Solicitudes del cotizador de sobres (Documento 4).
-- Cada envío desde /cotizar queda registrado aquí con su folio y ficha completa.
-- Ejecutar en Supabase → SQL Editor.

create table if not exists public.configuraciones (
  id           uuid primary key default gen_random_uuid(),
  folio        text unique not null,
  payload      jsonb not null,            -- configuración + cliente
  notificacion jsonb,                     -- resultado del envío de correos
  estado       text not null default 'nuevo',
  created_at   timestamptz not null default now()
);

create index if not exists configuraciones_created_at_idx
  on public.configuraciones (created_at desc);

-- RLS: nadie del público puede leer/escribir. El endpoint escribe con la llave
-- service_role (que omite RLS). Los administradores pueden leer y actualizar.
alter table public.configuraciones enable row level security;

drop policy if exists configuraciones_admin_read on public.configuraciones;
create policy configuraciones_admin_read on public.configuraciones
  for select using (public.is_admin());

drop policy if exists configuraciones_admin_update on public.configuraciones;
create policy configuraciones_admin_update on public.configuraciones
  for update using (public.is_admin()) with check (public.is_admin());
