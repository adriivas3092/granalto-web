import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlogExplorer } from "@/components/sections/BlogExplorer";
import { getBlogPostsPublic } from "@/lib/blog/queries";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog | Ideas, materiales e inspiración",
  description:
    "Información para elegir, utilizar y cuidar las superficies de cada espacio: materiales, diseño, mantenimiento, tendencias y guías de Granalto.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPostsPublic();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="bg-ink pb-16 pt-28 text-ivory md:pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">
            Blog
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.08] md:text-6xl">
            Ideas, materiales e inspiración
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            Información para elegir, utilizar y cuidar las superficies de cada
            espacio.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      </div>

      {featured && (
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid gap-6 rounded-sm bg-white lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-stone-beige">
              <Image
                src={featured.coverImage.src}
                alt={featured.coverImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-2 lg:p-8">
              <p className="text-xs uppercase tracking-[0.15em] text-mineral">
                Artículo destacado · {featured.category} ·{" "}
                {formatDate(featured.publishedAt)}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-snug text-ink md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/80">
                {featured.excerpt}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 group-hover:underline">
                Leer artículo
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <BlogExplorer posts={rest.length > 0 ? rest : posts} />
      </section>

      <CTASection source="blog" />
    </>
  );
}
