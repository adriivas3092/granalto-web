import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso del sitio web de Granalto Costa Rica.",
  path: "/terminos-y-condiciones",
});

/**
 * BORRADOR PENDIENTE_VALIDAR: este texto es una base general y debe ser
 * revisado por el asesor legal de Granalto antes de publicarse en producción
 * (ver CONTENT_TODO.md).
 */
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <Breadcrumbs
        items={[{ name: "Términos y condiciones", path: "/terminos-y-condiciones" }]}
      />
      <h1 className="mt-8 text-4xl leading-tight md:text-5xl">
        Términos y condiciones
      </h1>
      <p className="mt-4 text-sm text-mineral">
        Borrador sujeto a revisión legal. Última actualización: julio de 2026.
      </p>

      <div className="mt-10 space-y-8 text-base leading-relaxed text-charcoal/85">
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">1. Uso del sitio</h2>
          <p>
            Este sitio web es operado por {siteConfig.legalName}. Al utilizarlo,
            usted acepta estos términos. El contenido tiene fines informativos
            y no constituye una oferta comercial vinculante.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">2. Información de productos</h2>
          <p>
            La apariencia, tonalidad y veta de los materiales puede variar
            según el lote y, en el caso de las piedras naturales, cada pieza es
            única. Las imágenes publicadas son ilustrativas. La disponibilidad,
            especificaciones y precios se confirman directamente con nuestro
            equipo de ventas.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">3. Propiedad intelectual</h2>
          <p>
            Los contenidos de este sitio (textos, fotografías, marca y diseño)
            pertenecen a {siteConfig.legalName} o a sus respectivos titulares y
            no pueden reproducirse sin autorización. Las marcas de terceros
            mencionadas pertenecen a sus propietarios.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">4. Responsabilidad</h2>
          <p>
            Procuramos mantener la información actualizada, pero no
            garantizamos la ausencia de errores u omisiones. {siteConfig.legalName}{" "}
            no será responsable por decisiones tomadas exclusivamente con base
            en la información de este sitio sin asesoría directa de nuestro
            equipo.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">5. Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos, escríbanos a{" "}
            {siteConfig.contact.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
