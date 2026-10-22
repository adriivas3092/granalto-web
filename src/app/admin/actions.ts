"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { debeBloquearPorStock } from "@/lib/store/stock";
import type { ProductInput } from "@/types/store";

function parseForm(formData: FormData): ProductInput {
  const num = (v: FormDataEntryValue | null) =>
    v == null || v === "" ? 0 : Number(v);
  const attrRaw = (formData.get("attributes") as string) || "";
  const attributes: Record<string, string> = {};
  attrRaw
    .split("\n")
    .map((line) => line.split(":"))
    .forEach(([k, ...rest]) => {
      const key = (k ?? "").trim();
      const val = rest.join(":").trim();
      if (key && val) attributes[key] = val;
    });

  const price = num(formData.get("price"));
  const stock = Math.round(num(formData.get("stock")));

  // "En oferta": basta con marcar la casilla para que la tienda muestre la
  // etiqueta. Si además hay un "precio regular" mayor, se usa para el tachado
  // y el %. Codificamos la oferta en compare_at_price (>= precio) para no
  // requerir cambios en la base de datos.
  const onSale = formData.get("on_sale") === "on";
  let compare_at_price: number | null = null;
  if (onSale) {
    const regular = num(formData.get("compare_at_price"));
    compare_at_price = regular && regular > price ? regular : price;
  }

  const gallery = ((formData.get("gallery") as string) || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    name: (formData.get("name") as string)?.trim() ?? "",
    slug: (formData.get("slug") as string)?.trim() ?? "",
    sku: ((formData.get("sku") as string) || "").trim() || null,
    category_id: ((formData.get("category_id") as string) || "") || null,
    description: ((formData.get("description") as string) || "").trim() || null,
    price,
    currency: (formData.get("currency") as string) || "CRC",
    compare_at_price,
    stock,
    // Regla de stock: con 1 unidad o menos, el producto queda bloqueado
    // (no disponible) aunque se marque visible.
    available: formData.get("available") === "on" && !debeBloquearPorStock(stock),
    featured: formData.get("featured") === "on",
    image_url: ((formData.get("image_url") as string) || "").trim() || null,
    gallery,
    attributes,
  };
}

export async function createProduct(formData: FormData) {
  const input = parseForm(formData);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  redirect("/admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
  const input = parseForm(formData);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  revalidatePath(`/tienda/${input.slug}`);
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
}

/** Muestra u oculta UN producto (interruptor rápido de la lista). */
export async function toggleAvailability(id: string, next: boolean) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update({ available: next }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
}

/**
 * Muestra u oculta TODOS los productos (o los de una categoría si se filtró).
 * `available` = "true" | "false"; `categoria` = slug opcional.
 */
export async function bulkAvailability(formData: FormData) {
  await requireAdmin();
  const available = formData.get("available") === "true";
  const categorySlug = ((formData.get("categoria") as string) || "").trim();
  const supabase = await createSupabaseServerClient();

  let categoryId: string | undefined;
  if (categorySlug) {
    const { data } = await supabase.from("categories").select("id").eq("slug", categorySlug).maybeSingle();
    categoryId = data?.id;
  }

  const base = supabase.from("products").update({ available });
  const { error } = categoryId
    ? await base.eq("category_id", categoryId)
    : await base.not("id", "is", null);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  redirect(categorySlug ? `/admin/productos?categoria=${categorySlug}` : "/admin/productos");
}

/** Borra en bloque los productos seleccionados (por id). */
export async function bulkDeleteProducts(ids: string[]) {
  await requireAdmin();
  const clean = ids.filter(Boolean);
  if (clean.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().in("id", clean);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
}

/** Activa/desactiva en bloque los productos seleccionados (por id). */
export async function bulkSetAvailabilityForIds(ids: string[], available: boolean) {
  await requireAdmin();
  const clean = ids.filter(Boolean);
  if (clean.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update({ available }).in("id", clean);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
}

export async function updateOrderStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = (formData.get("status") as string) || "pendiente";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  redirect(`/admin/pedidos/${id}`);
}

/** Modificar los datos de un pedido (cliente, contacto, dirección, notas). */
export async function updateOrderDetails(id: string, formData: FormData) {
  await requireAdmin();
  const str = (k: string) => ((formData.get(k) as string) || "").trim();
  const patch = {
    customer_name: str("customer_name"),
    customer_email: str("customer_email"),
    customer_phone: str("customer_phone") || null,
    shipping_address: str("shipping_address") || null,
    notes: str("notes") || null,
  };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  redirect(`/admin/pedidos/${id}`);
}

/** Eliminar un pedido (los ítems se borran en cascada). */
export async function deleteOrder(id: string) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  redirect("/admin/pedidos");
}

/** Actualizar una solicitud del cotizador (estado y notas internas). */
export async function updateSolicitud(id: string, formData: FormData) {
  await requireAdmin();
  const estado = ((formData.get("estado") as string) || "nuevo").trim();
  const notas = ((formData.get("notas") as string) || "").trim() || null;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("configuraciones").update({ estado, notas }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/solicitudes");
  revalidatePath(`/admin/solicitudes/${id}`);
  redirect(`/admin/solicitudes/${id}`);
}

/** Eliminar una solicitud del cotizador. */
export async function deleteSolicitud(id: string) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("configuraciones").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/solicitudes");
  redirect("/admin/solicitudes");
}

/** Cambiar la disponibilidad (agotado/disponible) de un color para el cotizador. */
export async function setMaterialDisponibilidad(materialId: string, colorId: string, agotado: boolean) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("material_disponibilidad")
    .upsert(
      { material_id: materialId, color_id: colorId, agotado, updated_at: new Date().toISOString() },
      { onConflict: "material_id,color_id" },
    );
  if (error) throw new Error(error.message);
  revalidatePath("/admin/materiales");
  revalidatePath("/cotizar");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
