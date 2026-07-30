import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { rateLimit, clientIp } from "@/lib/api/rate-limit";

/**
 * POST /api/sync/products — sincronización de productos desde un ERP (SAP).
 *
 * Autenticación: header  x-api-key: <SYNC_API_KEY>
 * Requiere en el servidor: SYNC_API_KEY y SUPABASE_SERVICE_ROLE_KEY.
 *
 * Comportamiento (upsert por SKU):
 *  - SKU existente  → actualiza los campos enviados (precio, stock, etc.).
 *                     NUNCA toca image_url ni la visibilidad (salvo que se envíe
 *                     `available` o `discontinued`).
 *  - SKU nuevo      → crea el producto OCULTO (available=false) y sin imagen,
 *                     para revisarlo antes de publicarlo.
 *  - `discontinued: true` → oculta el producto (no lo borra).
 *
 * Cuerpo: { "items": [ { sku, name?, price?, stock?, available?, discontinued?,
 *                        description?, currency?, category? } ] }
 */

const itemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().optional(),
  available: z.boolean().optional(),
  discontinued: z.boolean().optional(),
  description: z.string().optional(),
  currency: z.string().optional(),
  category: z.string().optional(), // slug de categoría (opcional)
});

const bodySchema = z.object({
  items: z.array(itemSchema).min(1).max(5000),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function POST(req: Request) {
  if (!rateLimit(`sync:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ success: false, message: "Demasiadas solicitudes." }, { status: 429 });
  }

  const configuredKey = process.env.SYNC_API_KEY;
  if (!configuredKey) {
    return NextResponse.json(
      { success: false, message: "Sincronización no configurada (falta SYNC_API_KEY)." },
      { status: 503 },
    );
  }
  if (req.headers.get("x-api-key") !== configuredKey) {
    return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "JSON inválido." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Datos inválidos.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Deduplicar por SKU (gana el último).
  const bySku = new Map<string, z.infer<typeof itemSchema>>();
  for (const it of parsed.data.items) bySku.set(it.sku.trim(), it);
  const items = [...bySku.values()];

  try {
    // 1) Categorías (slug -> id)
    const catSlugs = [...new Set(items.map((i) => i.category?.trim()).filter(Boolean) as string[])];
    const catMap = new Map<string, string>();
    if (catSlugs.length) {
      const { data: cats } = await supabase.from("categories").select("id, slug").in("slug", catSlugs);
      for (const c of cats ?? []) catMap.set(c.slug, c.id);
    }

    // 2) Productos existentes por SKU
    const skus = items.map((i) => i.sku.trim());
    const existing = new Map<string, { id: string; slug: string }>();
    for (const part of chunk(skus, 200)) {
      const { data } = await supabase.from("products").select("id, sku, slug").in("sku", part);
      for (const p of data ?? []) if (p.sku) existing.set(p.sku, { id: p.id, slug: p.slug });
    }

    let created = 0;
    let updated = 0;
    let hidden = 0;
    let skipped = 0;
    const errors: string[] = [];
    const usedSlugs = new Set<string>();
    const inserts: Record<string, unknown>[] = [];

    for (const it of items) {
      const sku = it.sku.trim();
      const catId = it.category ? catMap.get(it.category.trim()) : undefined;

      if (existing.has(sku)) {
        // Actualizar solo lo enviado; nunca image_url.
        const patch: Record<string, unknown> = {};
        if (it.name !== undefined) patch.name = it.name;
        if (it.price !== undefined) patch.price = it.price;
        if (it.stock !== undefined) patch.stock = it.stock;
        if (it.description !== undefined) patch.description = it.description;
        if (it.currency !== undefined) patch.currency = it.currency;
        if (catId) patch.category_id = catId;
        if (it.discontinued === true) patch.available = false;
        else if (typeof it.available === "boolean") patch.available = it.available;

        if (Object.keys(patch).length === 0) {
          skipped++;
          continue;
        }
        const { error } = await supabase.from("products").update(patch).eq("sku", sku);
        if (error) errors.push(`${sku}: ${error.message}`);
        else {
          updated++;
          if (patch.available === false) hidden++;
        }
      } else {
        // Nuevo: no crear si viene descontinuado.
        if (it.discontinued === true) {
          skipped++;
          continue;
        }
        const base = slugify(`${it.name ?? sku}-${sku}`) || `producto-${sku.toLowerCase()}`;
        let slug = base;
        let n = 1;
        while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
        usedSlugs.add(slug);
        inserts.push({
          name: it.name ?? sku,
          slug,
          sku,
          category_id: catId ?? null,
          price: it.price ?? 0,
          currency: it.currency ?? "CRC",
          stock: it.stock ?? 0,
          available: false, // entra oculto para revisión
          featured: false,
          image_url: null,
          gallery: [],
          attributes: {},
        });
      }
    }

    for (const part of chunk(inserts, 500)) {
      const { error, count } = await supabase.from("products").insert(part, { count: "exact" });
      if (error) errors.push(`insert: ${error.message}`);
      else created += count ?? part.length;
    }

    return NextResponse.json({
      success: errors.length === 0,
      received: items.length,
      created,
      updated,
      hidden,
      skipped,
      errors: errors.slice(0, 20),
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Error de sincronización." },
      { status: 500 },
    );
  }
}
