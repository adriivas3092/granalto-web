"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/types/store";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => Promise<void>;
}) {
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const attributesText = Object.entries(product?.attributes ?? {})
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  async function onImage(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch {
      setUploadError("No se pudo subir la imagen. Intente de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  const field =
    "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
  const label = "mb-1 block text-sm text-charcoal";

  return (
    <form
      action={async (fd) => {
        setSaving(true);
        await action(fd);
        setSaving(false);
      }}
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className={label}>
            Nombre
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            onChange={(e) => {
              if (!product) setSlug(slugify(e.target.value));
            }}
            className={field}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="slug" className={label}>
              Slug (URL)
            </label>
            <input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="sku" className={label}>
              Código / SKU
            </label>
            <input id="sku" name="sku" defaultValue={product?.sku ?? ""} className={field} />
          </div>
        </div>

        <div>
          <label htmlFor="category_id" className={label}>
            Categoría
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className={field}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className={label}>
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
            className={`${field} resize-y`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className={label}>
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={product?.price ?? 0}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="compare_at_price" className={label}>
              Precio anterior
            </label>
            <input
              id="compare_at_price"
              name="compare_at_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.compare_at_price ?? ""}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="currency" className={label}>
              Moneda
            </label>
            <select
              id="currency"
              name="currency"
              defaultValue={product?.currency ?? "CRC"}
              className={field}
            >
              <option value="CRC">CRC (₡)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="stock" className={label}>
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.stock ?? 0}
              className={field}
            />
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm text-charcoal">
            <input
              type="checkbox"
              name="available"
              defaultChecked={product ? product.available : true}
              className="h-4 w-4 accent-ink"
            />
            Disponible
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm text-charcoal">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 accent-ink"
            />
            Destacado
          </label>
        </div>

        <div>
          <label htmlFor="attributes" className={label}>
            Atributos (uno por línea, formato «clave: valor»)
          </label>
          <textarea
            id="attributes"
            name="attributes"
            rows={4}
            defaultValue={attributesText}
            placeholder={"material: Cuarcita\ncolor: Beige\nformato: 60x60"}
            className={`${field} resize-y font-mono text-xs`}
          />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-sm border border-stone-beige bg-white p-4">
          <p className={label}>Imagen principal</p>
          <div className="relative mb-3 aspect-square overflow-hidden rounded-sm bg-stone-beige">
            {imageUrl ? (
              <Image src={imageUrl} alt="Vista previa" fill sizes="320px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-mineral">
                Sin imagen
              </div>
            )}
          </div>
          <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-sm border border-ink px-3 py-2 text-sm text-ink hover:bg-ink hover:text-ivory">
            {uploading ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Upload aria-hidden="true" className="h-4 w-4" />
            )}
            {uploading ? "Subiendo…" : "Subir imagen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImage(f);
              }}
            />
          </label>
          {uploadError && <p className="mt-2 text-xs text-[#a03826]">{uploadError}</p>}
          <input type="hidden" name="image_url" value={imageUrl} />
        </div>

        <div className="rounded-sm border border-stone-beige bg-white p-4">
          <label htmlFor="gallery" className={label}>
            Galería (una URL por línea)
          </label>
          <textarea
            id="gallery"
            name="gallery"
            rows={3}
            defaultValue={(product?.gallery ?? []).join("\n")}
            className={`${field} resize-y text-xs`}
          />
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
        >
          {saving && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          Guardar producto
        </button>
      </aside>
    </form>
  );
}
