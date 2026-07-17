import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

/** Tarjeta de artículo del blog. */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-stone-beige">
        <Image
          src={post.coverImage.src}
          alt={post.coverImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="pt-4">
        <p className="text-xs uppercase tracking-[0.15em] text-mineral">
          {post.category} · {formatDate(post.publishedAt)}
        </p>
        <h3 className="mt-1 font-serif text-xl leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal/75">{post.excerpt}</p>
        <p className="mt-2 text-xs text-mineral">{post.readingTime} min de lectura</p>
      </div>
    </Link>
  );
}
