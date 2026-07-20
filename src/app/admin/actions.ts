"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

  const compareRaw = formData.get("compare_at_price");
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
    price: num(formData.get("price")),
    currency: (formData.get("currency") as string) || "CRC",
    compare_at_price: compareRaw ? num(compareRaw) || null : null,
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

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
