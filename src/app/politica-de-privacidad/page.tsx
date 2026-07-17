import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Política de privacidad",
  description:
    "Política de privacidad del sitio web de Granalto Costa Rica: tratamiento de datos personales, cookies y derechos de los usuarios.",
  path: "/politica-de-privacidad",
});

/**
 * BORRADOR PENDIENTE_VALIDAR: este texto es una base general y debe ser
 * revisado por el asesor legal de Granalto antes de publicarse en producción
 * (ver CONTENT_TODO.md).
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <Breadcrumbs
        items={[{ name: "Política de privacidad", path: "/politica-de-privacidad" }]}
      />
      <h1 className="mt-8 text-4xl leading-tight md:text-5xl">
        Política de privacidad
      </h1>
      <p className="mt-4 text-sm text-mineral">
        Borrador sujeto a revisión legal. Última actualización: julio de 2026.
      </p>

      <div className="mt-10 space-y-8 text-base leading-relaxed text-charcoal/85">
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">1. Responsable del tratamiento</h2>
          <p>
            {siteConfig.legalName} es responsable del tratamiento de los datos
            personales recopilados a través de este sitio web. Puede
            contactarnos en {siteConfig.contact.email} o al teléfono{" "}
            {siteConfig.contact.phone}.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">2. Datos que recopilamos</h2>
          <p>
            Recopilamos los datos que usted nos facilita voluntariamente a
            través del formulario de contacto: nombre, correo electrónico,
            teléfono, tipo de cliente, tipo de proyecto, provincia y mensaje.
            Además, podemos recopilar datos de uso del sitio mediante
            herramientas de analítica, previa aceptación de cookies.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">3. Finalidad</h2>
          <p>
            Utilizamos sus datos únicamente para atender su consulta, brindarle
            asesoría y, cuando usted lo autorice, enviarle información sobre
            nuestros productos y servicios. No vendemos ni cedemos sus datos a
            terceros con fines comerciales.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">4. Cookies</h2>
          <p>
            Este sitio puede utilizar cookies propias y de terceros para
            analizar el uso del sitio y mejorar la experiencia. Usted puede
            aceptar o rechazar las cookies no esenciales desde el aviso de
            cookies y configurar su navegador para bloquearlas.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">5. Sus derechos</h2>
          <p>
            De conformidad con la Ley N.º 8968 de Protección de la Persona
            frente al Tratamiento de sus Datos Personales de Costa Rica, usted
            puede solicitar el acceso, la rectificación o la eliminación de sus
            datos escribiendo a {siteConfig.contact.email}.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl text-ink">6. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. La versión vigente
            estará siempre publicada en esta página.
          </p>
        </section>
      </div>
    </div>
  );
}
