import Image from "next/image";
import { Gem, Ruler, Users, Truck } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandCard } from "@/components/cards/BrandCard";
import { LocationCard } from "@/components/cards/LocationCard";
import { getActiveBrands } from "@/data/brands";
import { getLocations } from "@/data/locations";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Nosotros | Especialistas en superficies premium",
  description:
    "Granalto se especializa en la importación, corte e instalación de superficies premium en Costa Rica: piedra natural, cuarzo, porcelánico y más.",
  path: "/nosotros",
});

const pillars = [
  {
    icon: Gem,
    title: "Selección",
    text: "Importamos y seleccionamos piedra natural y superficies técnicas de origen y calidad verificados.",
  },
  {
    icon: Ruler,
    title: "Precisión",
    text: "Plantillas, corte y acabados con precisión técnica para que cada pieza calce perfectamente en su espacio.",
  },
  {
    icon: Users,
    title: "Asesoría",
    text: "Acompañamos a propietarios, arquitectos y constructoras desde la elección del material hasta el detalle final.",
  },
  {
    icon: Truck,
    title: "Instalación",
    text: "Equipo propio de instalación profesional para asegurar el resultado que el diseño merece.",
  },
];

export default function AboutPage() {
  const brands = getActiveBrands();
  const locations = getLocations();

  return (
    <>
      <HeroSection
        size="large"
        image={{
          src: "/images/photos/nosotros.jpg",
          alt: "Equipo y trabajo de Granalto",
        }}
        eyebrow="Nosotros"
        title="Diseño, precisión y materiales excepcionales"
        description="En Granalto seleccionamos, comercializamos y transformamos superficies para proyectos residenciales y comerciales."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Nosotros", path: "/nosotros" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-charcoal/85">
          <p>
            Granalto es una empresa costarricense especializada en la
            importación, corte e instalación de superficies sólidas: granito,
            cuarcita, mármol, cuarzo, porcelánico, superficies sólidas y ónix,
            entre otros materiales.
          </p>
          <p>
            Nuestro equipo acompaña cada proyecto desde la elección del
            material hasta la fabricación e instalación, combinando
            experiencia técnica, diseño y atención personalizada. Trabajamos
            con propietarios, arquitectos, diseñadores, constructoras y
            fabricantes de mobiliario en todo el país.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Cómo trabajamos"
            title="Del material al espacio terminado"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon aria-hidden="true" className="h-6 w-6 text-mineral" />
                <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-beige">
            <Image
              src="/images/photos/showroom-lagunilla.jpg"
              alt="Showroom de Granalto en Lagunilla, Heredia"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Experiencia"
              title="Especialistas en superficies"
              description="Nos dedicamos exclusivamente a superficies y acabados premium. Esa especialización nos permite conocer a fondo cada material: su desempeño, sus aplicaciones ideales y el cuidado que requiere."
            />
            <p className="max-w-xl text-base leading-relaxed text-charcoal/80">
              Además de nuestra propia fabricación, representamos marcas
              internacionales de superficies, grifería, sanitarios y productos
              para el cuidado de la piedra.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Marcas" title="Marcas con las que trabajamos" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading eyebrow="Showrooms" title="Dónde encontrarnos" />
        <div className="grid gap-6 md:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </section>

      <CTASection source="nosotros" />
    </>
  );
}
