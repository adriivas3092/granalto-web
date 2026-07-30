"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
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
    stock: Math.round(num(formData.get("stock"))),
    available: formData.get("available") === "on",
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
  revalidatePath("/tienda");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const input = parseForm(formData);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/tienda");
  revalidatePath(`/tienda/${input.slug}`);
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/tienda");
}

/** Muestra u oculta UN producto (interruptor rápido de la lista). */
export async function toggleAvailability(id: string, next: boolean) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update({ available: next }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
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
  revalidatePath("/tienda");
  redirect(categorySlug ? `/admin?categoria=${categorySlug}` : "/admin");
}

export async function updateOrderStatus(id: string, formData: FormData) {
  const status = (formData.get("status") as string) || "pendiente";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  redirect(`/admin/pedidos/${id}`);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
