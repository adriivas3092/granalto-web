import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso del sitio y de compra en la tienda en línea de Granalto Costa Rica: cotizaciones, pedidos, pagos, entregas y garantías.",
  path: "/terminos-y-condiciones",
});

const UPDATED = "19 de noviembre de 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-2xl text-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Términos de uso y condiciones de compra, redactados según el funcionamiento
 * real del sitio (cotizaciones, cuentas, tienda y pagos con GreenPay) y la
 * Ley N.º 7472. Se recomienda su revisión periódica por el asesor legal de
 * Granalto; las condiciones específicas de garantía viven en cada
 * cotización o factura.
 */
export default function TermsPage() {
  const { email, phone, whatsapp } = siteConfig.contact;
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <Breadcrumbs items={[{ name: "Términos y condiciones", path: "/terminos-y-condiciones" }]} />
      <h1 className="mt-8 text-4xl leading-tight md:text-5xl">Términos y condiciones</h1>
      <p className="mt-4 text-sm text-mineral">Última actualización: {UPDATED}.</p>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-charcoal/85">
        <Section title="1. Identificación y aceptación">
          <p>
            Este sitio web es operado por {siteConfig.legalName} (&quot;Granalto&quot;). Puede
            contactarnos en {email}, al {phone} o por WhatsApp al {whatsapp}. Al navegar el sitio,
            crear una cuenta, solicitar una cotización o realizar una compra, usted acepta estos
            términos y nuestra{" "}
            <Link href="/politica-de-privacidad" className="underline underline-offset-4">política de privacidad</Link>.
          </p>
        </Section>

        <Section title="2. Uso del sitio">
          <p>
            Usted se compromete a usar el sitio de forma lícita, a no intentar acceder sin
            autorización a sus sistemas o a cuentas de terceros, y a no realizar acciones que afecten
            su funcionamiento.
          </p>
        </Section>

        <Section title="3. Información de productos y materiales">
          <List
            items={[
              "Las piedras naturales (granito, cuarcita, mármol, travertino y otras) son productos de la naturaleza: el color, la veta, el brillo y las marcas varían entre láminas y lotes, y cada pieza es única. Estas variaciones son propias del material y no se consideran defectos.",
              "Las fotografías y los colores que se ven en pantalla son ilustrativos y pueden diferir del material real. Le recomendamos ver y elegir las láminas en nuestros showrooms.",
              "Las especificaciones técnicas publicadas son de carácter informativo. La disponibilidad de cada material se confirma con nuestro equipo.",
            ]}
          />
        </Section>

        <Section title="4. Cotizaciones">
          <p>
            Las cotizaciones y estimaciones se basan en la información que usted nos brinda. El precio
            final de trabajos a la medida, como sobres de cocina y baño, se confirma después de la
            visita de medición (plantillado) y de su aprobación del diseño, el material y los detalles.
            Cada cotización indica su vigencia y sus condiciones.
          </p>
        </Section>

        <Section title="5. Cuentas de cliente">
          <p>
            Para comprar en la tienda en línea puede crear una cuenta. Usted se compromete a brindar
            datos veraces y a mantener la confidencialidad de su contraseña, y es responsable de la
            actividad realizada con su cuenta. Granalto podrá suspender cuentas que se usen de forma
            fraudulenta o contraria a estos términos.
          </p>
        </Section>

        <Section title="6. Compras en la tienda en línea">
          <List
            items={[
              "Los precios se muestran en la moneda indicada en cada producto. Antes de pagar, el resumen de compra muestra el total a cobrar.",
              "El pedido se confirma cuando el pago es aprobado. Le enviaremos un correo de confirmación con el detalle de su compra.",
              "Si por un error evidente un producto se publica con un precio o una descripción incorrectos, o si un producto deja de estar disponible, le contactaremos para ofrecerle una alternativa o el reembolso total de lo pagado.",
            ]}
          />
        </Section>

        <Section title="7. Pagos">
          <p>
            Los pagos con tarjeta se procesan a través de la pasarela GreenPay, con autenticación 3D
            Secure. Granalto no almacena el número completo de su tarjeta ni su código de seguridad.
            El cargo puede estar sujeto a las condiciones del banco emisor de su tarjeta.
          </p>
        </Section>

        <Section title="8. Entregas e instalación">
          <p>
            Los plazos de entrega, fabricación e instalación se coordinan con usted y pueden variar
            según el material, la complejidad del trabajo y la disponibilidad. Para la instalación, el
            espacio debe estar accesible y en las condiciones acordadas con nuestro equipo.
          </p>
        </Section>

        <Section title="9. Garantía, retracto y devoluciones">
          <p>
            Sus compras cuentan con los derechos que le reconoce la Ley N.º 7472 de Promoción de la
            Competencia y Defensa Efectiva del Consumidor y su reglamento, incluidos la garantía y,
            cuando corresponda, el derecho de retracto en compras a distancia. Las condiciones de
            garantía específicas de cada producto o trabajo se indican en la cotización o en la
            factura.
          </p>
          <p>
            Para hacer un reclamo, solicitar una devolución o ejercer su garantía, escríbanos a{" "}
            <a href={`mailto:${email}`} className="underline underline-offset-4">{email}</a> con su
            número de pedido. Le responderemos a la mayor brevedad.
          </p>
        </Section>

        <Section title="10. Propiedad intelectual">
          <p>
            Los contenidos de este sitio (textos, fotografías, diseño y la marca Granalto) pertenecen
            a Granalto o a sus respectivos titulares y no pueden reproducirse sin autorización. Las
            marcas de terceros mencionadas, como las de los materiales que distribuimos, pertenecen a
            sus propietarios.
          </p>
        </Section>

        <Section title="11. Responsabilidad">
          <p>
            Procuramos que la información del sitio sea correcta y esté actualizada, pero puede
            contener errores u omisiones. Le recomendamos confirmar con nuestro equipo cualquier
            dato relevante antes de tomar una decisión de compra. Granalto no es responsable por
            interrupciones del sitio debidas a causas ajenas a su control.
          </p>
        </Section>

        <Section title="12. Enlaces a terceros">
          <p>
            El sitio contiene enlaces a sitios de terceros, como redes sociales, WhatsApp y páginas de
            marcas. Granalto no controla esos sitios ni es responsable de su contenido.
          </p>
        </Section>

        <Section title="13. Ley aplicable y reclamos">
          <p>
            Estos términos se rigen por las leyes de la República de Costa Rica. Si tiene un reclamo,
            le invitamos a escribirnos primero para resolverlo directamente. Como consumidor, también
            puede acudir a la Dirección de Apoyo al Consumidor del Ministerio de Economía, Industria y
            Comercio (MEIC).
          </p>
        </Section>

        <Section title="14. Cambios a estos términos">
          <p>
            Podemos actualizar estos términos. La versión vigente estará siempre publicada en esta
            página con su fecha de actualización. Los pedidos realizados se rigen por los términos
            vigentes al momento de la compra.
          </p>
        </Section>
      </div>
    </div>
  );
}
