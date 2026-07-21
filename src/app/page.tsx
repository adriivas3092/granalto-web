import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { CTASection } from "@/components/sections/CTASection";
import { heroSlides } from "@/data/hero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CollectionCard } from "@/components/cards/CollectionCard";
import { MaterialsCarousel } from "@/components/sections/MaterialsCarousel";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CatalogCard } from "@/components/cards/CatalogCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { BrandCard } from "@/components/cards/BrandCard";
import { LocationCard } from "@/components/cards/LocationCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { getFeaturedCollections } from "@/data/collections";
import { getMaterials } from "@/data/materials";
import { getActiveBrands } from "@/data/brands";
import { getFeaturedProjects } from "@/data/projects";
import { getFeaturedCatalogs } from "@/data/catalogs";
import { getRecentPosts } from "@/data/blog";
import { getLocations } from "@/data/locations";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ path: "/" });

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function HomePage() {
  const collections = getFeaturedCollections();
  const materials = getMaterials();
  const brands = getActiveBrands();
  const projects = getFeaturedProjects();
  const catalogs = getFeaturedCatalogs();
  const posts = getRecentPosts(3);
  const locations = getLocations();

  return (
    <>
      {/* 8.1 Hero principal: carrusel automático con transición suave */}
      <HeroCarousel
        slides={heroSlides}
        title="Superficies que transforman espacios"
        description="Descubra materiales, acabados y soluciones seleccionadas para crear cocinas, baños y espacios con identidad propia."
      >
        <ButtonLink href="/colecciones" variant="secondary">
          Explorar colecciones
        </ButtonLink>
        <ButtonLink href="/contacto" variant="outline" onDark>
          Solicitar asesoría
        </ButtonLink>
      </HeroCarousel>

      {/* 8.2 Introducción a Granalto */}
      <section className={`${container} py-20 md:py-28`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Granalto"
              title="Diseño, precisión y materiales excepcionales"
              description="En Granalto seleccionamos, comercializamos y transformamos superficies para proyectos residenciales y comerciales. Nuestro equipo acompaña cada proyecto desde la elección del material hasta la fabricación e instalación, combinando experiencia técnica, diseño y atención personalizada."
            />
            <p className="max-w-xl text-base leading-relaxed text-charcoal/80">
              Nos especializamos en la importación, corte e instalación de
              superficies premium — piedra natural, cuarzo, porcelánico,
              superficies sólidas y laminados — con showrooms en Heredia,
              Escazú y Guanacaste.
            </p>
            <Link
              href="/nosotros"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              Conozca Granalto
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-beige">
            <Image
              src="/images/photos/nosotros.jpg"
              alt="Equipo y trabajo de Granalto"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8.3 Colecciones */}
      <section className="bg-white py-20 md:py-28">
        <div className={container}>
          <SectionHeading
            eyebrow="Colecciones"
            title="Explore por tipo de espacio"
            description="Soluciones y superficies organizadas según el espacio que quiere transformar."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* 8.4 Materiales */}
      <section className={`${container} py-20 md:py-28`}>
        <SectionHeading
          eyebrow="Materiales"
          title="Materiales seleccionados para proyectos únicos"
          description="Explore una selección de superficies naturales, técnicas y decorativas para cocinas, baños, mobiliario, revestimientos y espacios arquitectónicos."
        />
        <MaterialsCarousel materials={materials} />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/materiales">Explorar materiales</ButtonLink>
        </div>
      </section>

      {/* 8.5 Marcas */}
      <section className="bg-white py-20 md:py-28">
        <div className={container}>
          <SectionHeading
            eyebrow="Marcas"
            title="Marcas que representamos y comercializamos"
            description="Trabajamos con fabricantes seleccionados de superficies, grifería, sanitarios y productos para el cuidado de la piedra."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* 8.6 Proyectos destacados */}
      <section className={`${container} py-20 md:py-28`}>
        <SectionHeading
          eyebrow="Proyectos"
          title="Proyectos que hablan por nosotros"
          description="Una selección de espacios transformados con nuestras superficies. Los proyectos mostrados son de demostración y serán reemplazados por proyectos reales documentados."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 8.7 Catálogos destacados */}
      <section className="bg-ivory py-20 md:py-28">
        <div className={container}>
          <SectionHeading
            eyebrow="Recursos"
            title="Catálogos y recursos"
            description="Consulte colecciones, fichas y soluciones disponibles para desarrollar su próximo proyecto."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogs.map((catalog) => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))}
          </div>
          <div className="mt-12">
            <ButtonLink href="/catalogos" variant="outline">
              Ver todos los catálogos
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 8.8 Blog */}
      <section className="bg-white py-20 md:py-28">
        <div className={container}>
          <SectionHeading
            eyebrow="Blog"
            title="Ideas, materiales e inspiración"
            description="Información para elegir, utilizar y cuidar las superficies de cada espacio."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-12">
            <ButtonLink href="/blog" variant="outline">
              Ver todos los artículos
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 8.9 Showrooms */}
      <section className={`${container} py-20 md:py-28`}>
        <SectionHeading
          eyebrow="Showrooms"
          title="Visítenos y viva los materiales"
          description="En piedra natural, cada lámina es única. Le esperamos en nuestros showrooms para acompañarle en la selección."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </section>

      {/* 8.10 Formulario de contacto */}
      <section className="bg-white py-20 md:py-28">
        <div className={container}>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow="Contacto"
                title="Solicite asesoría personalizada"
                description="Cuéntenos sobre su proyecto y nuestro equipo le acompañará desde la selección del material hasta la instalación."
              />
            </div>
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* 8.11 CTA final */}
      <CTASection source="home" />
    </>
  );
}
