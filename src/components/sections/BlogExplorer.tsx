"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/types";
import { BlogCard } from "@/components/cards/BlogCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { normalizeText } from "@/lib/utils";
import { blogCategories } from "@/data/blog";

const PAGE_SIZE = 9;

/** Listado del blog con búsqueda, categorías y carga progresiva. */
export function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todas");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    return posts.filter((p) => {
      if (category !== "Todas" && p.category !== category) return false;
      if (!q) return true;
      return normalizeText(`${p.title} ${p.excerpt} ${p.category}`).includes(q);
    });
  }, [posts, query, category]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5">
        <SearchInput
          label="Buscar artículos"
          placeholder="Buscar artículos…"
          value={query}
          onChange={setQuery}
        />
        <FilterBar
          label="Filtrar por categoría"
          options={["Todas", ...blogCategories]}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setVisible(PAGE_SIZE);
          }}
        />
      </div>

      {shown.length > 0 ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {filtered.length > visible && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex min-h-[48px] items-center rounded-sm border border-ink px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-ivory"
              >
                Cargar más artículos
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No encontramos artículos"
          description="Pruebe con otra búsqueda o categoría."
        />
      )}
    </div>
  );
}
