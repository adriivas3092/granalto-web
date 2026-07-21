import Image from "next/image";
import { Download } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Portafolio de proyectos",
  description:
    "Proyectos realizados por Granalto: cocinas, baños, superficies y espacios con piedra natural y materiales técnicos.",
  path: "/portafolio",
});

const PDF_URL = "/catalogs/Portafolio-Granalto-2026.pdf";
const PAGES = 30;
const images = Array.from({ length: PAGES }, (_, i) => `/images/portafolio/p-${String(i + 1).padStart(2, "0")}.jpg`);

export default function PortafolioPage() {
  return (
    <>
      <section className="bg-ink pb-12 pt-28 text-ivory md:pb-14 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">Portafolio</p>
          <h1 className="max-w-3xl text-3xl leading-[1.08] md:text-5xl">Proyectos que hablan por nosotros</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
            Una muestra de cocinas, baños y espacios donde nuestras superficies dan el acabado final.
          </p>
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-ivory px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-stone-beige"
          >
            <Download aria-hidden="true" className="h-4 w-4" /> Descargar portafolio (PDF)
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Portafolio", path: "/portafolio" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {images.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-sm border border-stone-beige bg-stone-beige">
              <Image
                src={src}
                alt={`Proyecto Granalto — página ${i + 1} del portafolio`}
                width={1100}
                height={800}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full"
                loading={i < 3 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </section>

      <CTASection
        source="portafolio"
        title="¿Te gustó lo que viste?"
        description="Contanos sobre tu proyecto y te ayudamos a elegir el material y el acabado ideal."
      />
    </>
  );
}
