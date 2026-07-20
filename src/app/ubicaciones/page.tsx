import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LocationCard } from "@/components/cards/LocationCard";
import { getLocations } from "@/data/locations";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Ubicaciones | Showrooms en Heredia, Escazú y Liberia",
  description:
    "Visite los showrooms de Granalto en Lagunilla de Heredia, Guachipelín de Escazú y Liberia, Guanacaste. Conozca los materiales en persona.",
  path: "/ubicaciones",
});

export default function LocationsPage() {
  const locations = getLocations();

  return (
    <>
      <HeroSection
        size="medium"
        image={{
          src: "/images/photos/showroom-escazu.jpg",
          alt: "Showroom de Granalto en Guachipelín, Escazú",
        }}
        eyebrow="Ubicaciones"
        title="Visítenos y viva los materiales"
        description="En piedra natural cada lámina es única. Le esperamos en nuestros showrooms para acompañarle en la selección."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Ubicaciones", path: "/ubicaciones" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pb-28 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-charcoal/70">
          Los horarios de atención y los mapas interactivos de cada sede se
          publicarán una vez validados. Mientras tanto, puede coordinar su
          visita por WhatsApp o teléfono.
        </p>
      </section>

      <CTASection source="ubicaciones" />
    </>
  );
}
