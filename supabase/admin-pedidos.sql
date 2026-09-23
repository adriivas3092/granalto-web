-- Permisos y campos para gestionar pedidos desde el admin.
-- Ejecutar en Supabase → SQL Editor (una sola vez).

-- 1) Permitir que un administrador ELIMINE pedidos.
--    (order_items se borra en cascada por la FK ON DELETE CASCADE.)
drop policy if exists orders_admin_delete on public.orders;
create policy orders_admin_delete on public.orders
  for delete using (public.is_admin());

drop policy if exists order_items_admin_delete on public.order_items;
create policy order_items_admin_delete on public.order_items
  for delete using (public.is_admin());

-- 2) Solicitudes del cotizador: notas internas + permitir eliminar.
alter table public.configuraciones add column if not exists notas text;

drop policy if exists configuraciones_admin_delete on public.configuraciones;
create policy configuraciones_admin_delete on public.configuraciones
  for delete using (public.is_admin());
