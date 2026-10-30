import Image from "next/image";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlogCard } from "@/components/cards/BlogCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { getBlogPostBySlugPublic, getRelatedPostsPublic } from "@/lib/blog/queries";
import { articleSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlugPublic(slug);
  if (!post) return {};
  return buildMetadata({ ...post.seo, path: `/blog/${post.slug}` });
}

/** Convierte el contenido plano (párrafos y "## subtítulos") en bloques. */
function renderContent(content: string) {
  return content.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 font-serif text-2xl text-ink md:text-3xl">
          {trimmed.replace(/^## /, "")}
        </h2>
      );
    }
    return (
      <p key={i} className="mt-5 text-base leading-relaxed text-charcoal/85 md:text-lg">
        {trimmed}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlugPublic(slug);
  if (!post) notFound();

  const related = await getRelatedPostsPublic(post.slug, 3);

  return (
    <>
      <JsonLd data={articleSchema(post)} />

      <div className="mx-auto max-w-7xl px-4 pb-2 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Breadcrumbs
          items={[
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.15em] text-mineral">
          {post.category} · {formatDate(post.publishedAt)} · {post.readingTime} min de
          lectura
        </p>
        <h1 className="mt-3 text-3xl leading-tight md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-charcoal/80">{post.excerpt}</p>
        <p className="mt-4 text-sm text-mineral">Por {post.author}</p>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-sm bg-stone-beige">
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-4">{renderContent(post.content)}</div>
      </article>

      {related.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Siga leyendo" title="Artículos relacionados" />
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection source={`blog-${post.slug}`} />
    </>
  );
}
