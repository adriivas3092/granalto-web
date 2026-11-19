import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Política de privacidad",
  description:
    "Cómo Granalto Costa Rica trata sus datos personales: qué recopilamos, para qué, con quién los compartimos, cookies y cómo ejercer sus derechos según la Ley 8968.",
  path: "/politica-de-privacidad",
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
 * Política de privacidad conforme a la Ley N.º 8968 de Costa Rica, redactada
 * según el funcionamiento real del sitio (formularios, cuentas, tienda,
 * pagos con GreenPay, proveedores y cookies). Se recomienda su revisión
 * periódica por el asesor legal de Granalto.
 */
export default function PrivacyPage() {
  const { email, phone, whatsapp } = siteConfig.contact;
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <Breadcrumbs items={[{ name: "Política de privacidad", path: "/politica-de-privacidad" }]} />
      <h1 className="mt-8 text-4xl leading-tight md:text-5xl">Política de privacidad</h1>
      <p className="mt-4 text-sm text-mineral">Última actualización: {UPDATED}.</p>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-charcoal/85">
        <p>
          En {siteConfig.legalName} respetamos su privacidad. Esta política explica qué datos
          personales recopilamos a través de este sitio web, para qué los usamos, con quién los
          compartimos y cómo puede ejercer sus derechos, de conformidad con la Ley N.º 8968 de
          Protección de la Persona frente al Tratamiento de sus Datos Personales y su reglamento.
        </p>

        <Section title="1. Responsable del tratamiento">
          <p>
            El responsable de sus datos personales es {siteConfig.legalName} (&quot;Granalto&quot;).
            Para cualquier consulta sobre esta política puede escribirnos a{" "}
            <a href={`mailto:${email}`} className="underline underline-offset-4">{email}</a>, llamar
            al {phone} o escribir por WhatsApp al {whatsapp}. También puede visitarnos en
            cualquiera de nuestros <Link href="/ubicaciones" className="underline underline-offset-4">showrooms</Link>.
          </p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p>Recopilamos únicamente los datos que usted nos proporciona o que se generan al usar el sitio:</p>
          <List
            items={[
              <><strong className="text-ink">Formularios de contacto y asesoría:</strong> nombre, correo electrónico, teléfono, tipo de cliente, tipo de proyecto, provincia y mensaje.</>,
              <><strong className="text-ink">Solicitudes de cotización:</strong> datos de contacto y la información de su proyecto (por ejemplo, medidas, forma, material, acabados y extras).</>,
              <><strong className="text-ink">Cuenta de cliente:</strong> nombre, correo electrónico y contraseña. La contraseña se guarda cifrada y nunca es visible para nuestro personal.</>,
              <><strong className="text-ink">Compras en la tienda en línea:</strong> teléfono, dirección de entrega, notas del pedido, productos, montos e historial de pedidos.</>,
              <><strong className="text-ink">Pagos con tarjeta:</strong> los datos de su tarjeta se ingresan en el formulario seguro de la pasarela de pagos GreenPay, se transmiten cifrados y se validan con 3D Secure. Granalto no almacena el número completo de su tarjeta ni su código de seguridad.</>,
              <><strong className="text-ink">Comunicaciones:</strong> la información que usted comparta al escribirnos por correo, teléfono o WhatsApp.</>,
              <><strong className="text-ink">Datos de navegación:</strong> solo si usted acepta las cookies de analítica, información sobre cómo usa el sitio (páginas visitadas, tipo de dispositivo y navegador, ubicación aproximada y fuente de la visita).</>,
            ]}
          />
          <p>
            Los campos obligatorios de cada formulario se indican en el propio formulario. Si no los
            completa, no podremos atender su solicitud o procesar su pedido.
          </p>
        </Section>

        <Section title="3. Para qué usamos sus datos">
          <List
            items={[
              "Responder sus consultas y brindarle asesoría sobre materiales y proyectos.",
              "Preparar cotizaciones, coordinar visitas de medición, fabricación, entrega e instalación.",
              "Crear y administrar su cuenta de cliente.",
              "Procesar sus pedidos y pagos, y enviarle confirmaciones y avisos sobre su compra.",
              "Cumplir obligaciones legales, contables y tributarias, como la facturación.",
              "Analizar el uso del sitio para mejorarlo, únicamente si usted aceptó las cookies de analítica.",
              "Enviarle información sobre productos, novedades y promociones, solo si usted lo autoriza. Puede retirar esta autorización en cualquier momento.",
            ]}
          />
          <p>No vendemos ni alquilamos sus datos personales a terceros.</p>
        </Section>

        <Section title="4. Consentimiento">
          <p>
            Al enviar un formulario, crear una cuenta, realizar una compra o aceptar las cookies de
            analítica, usted otorga su consentimiento expreso e informado para el tratamiento de sus
            datos con las finalidades descritas en esta política. Puede revocar su consentimiento en
            cualquier momento, sin efectos retroactivos, escribiendo a {email}.
          </p>
        </Section>

        <Section title="5. Con quién compartimos sus datos">
          <p>
            Para operar el sitio y prestar nuestros servicios, compartimos datos únicamente con
            proveedores que los tratan por cuenta nuestra y bajo medidas de seguridad:
          </p>
          <List
            items={[
              <><strong className="text-ink">Vercel:</strong> alojamiento del sitio web.</>,
              <><strong className="text-ink">Supabase:</strong> base de datos y autenticación de cuentas.</>,
              <><strong className="text-ink">Resend:</strong> envío de correos de confirmación y avisos.</>,
              <><strong className="text-ink">GreenPay:</strong> procesamiento de pagos con tarjeta.</>,
              <><strong className="text-ink">Google (Google Analytics y Google Tag Manager):</strong> medición del uso del sitio, solo con su consentimiento.</>,
              <><strong className="text-ink">WhatsApp (Meta):</strong> cuando usted decide escribirnos por ese medio.</>,
              <><strong className="text-ink">Personal y colaboradores de Granalto</strong> que participan en la medición, fabricación, entrega e instalación de su proyecto.</>,
            ]}
          />
          <p>
            También podremos entregar datos a autoridades competentes cuando una ley u orden
            judicial lo exija.
          </p>
        </Section>

        <Section title="6. Transferencia internacional de datos">
          <p>
            Algunos de los proveedores mencionados almacenan o procesan datos en servidores ubicados
            fuera de Costa Rica, incluidos los Estados Unidos. Seleccionamos proveedores que aplican
            medidas de seguridad reconocidas. Al usar nuestros servicios, usted consiente esta
            transferencia con las finalidades descritas en esta política.
          </p>
        </Section>

        <Section title="7. Conservación de los datos">
          <p>
            Conservamos sus datos mientras sean necesarios para la finalidad con que fueron
            recopilados: atender su consulta, mantener su cuenta activa o gestionar su pedido y su
            garantía. Los datos vinculados a compras y facturación se conservan durante los plazos
            que exige la legislación tributaria y comercial. Cumplidos esos plazos, se eliminan o se
            anonimizan.
          </p>
        </Section>

        <Section title="8. Seguridad">
          <p>
            Aplicamos medidas técnicas y organizativas para proteger sus datos: conexión cifrada
            (HTTPS) en todo el sitio, contraseñas cifradas, acceso restringido al personal autorizado
            y pagos procesados por una pasarela especializada con autenticación 3D Secure. Ningún
            sistema es completamente infalible, pero trabajamos para mantener sus datos protegidos.
          </p>
        </Section>

        <Section title="9. Sus derechos">
          <p>De acuerdo con la Ley N.º 8968, usted tiene derecho a:</p>
          <List
            items={[
              "Acceder a sus datos personales y saber cómo los tratamos.",
              "Rectificar datos inexactos o incompletos.",
              "Solicitar la supresión de sus datos cuando ya no sean necesarios o retire su consentimiento.",
              "Revocar su consentimiento y oponerse a recibir comunicaciones comerciales.",
            ]}
          />
          <p>
            Para ejercerlos, escriba a{" "}
            <a href={`mailto:${email}`} className="underline underline-offset-4">{email}</a> con el
            asunto &quot;Datos personales&quot;, indicando su nombre, el derecho que desea ejercer y
            un medio de contacto. Podremos solicitarle información para verificar su identidad.
            Atenderemos su solicitud en los plazos que establecen la ley y su reglamento.
          </p>
          <p>
            Si considera que sus derechos no fueron atendidos, puede acudir a la Agencia de
            Protección de Datos de los Habitantes (PRODHAB).
          </p>
        </Section>

        <Section title="10. Cookies y almacenamiento en su navegador">
          <p>Usamos dos tipos de tecnologías:</p>
          <List
            items={[
              <><strong className="text-ink">Esenciales (siempre activas):</strong> guardan su elección sobre cookies, el contenido de su carrito y el avance de su cotización en su propio navegador, y mantienen abierta la sesión de su cuenta. Sin ellas, estas funciones no operan.</>,
              <><strong className="text-ink">Analítica (solo si usted acepta):</strong> Google Analytics, a través de Google Tag Manager, usa cookies (como _ga) para medir de forma estadística cómo se usa el sitio. Si usted rechaza las cookies, la medición permanece desactivada.</>,
            ]}
          />
          <p>
            Puede aceptar o rechazar las cookies de analítica desde el aviso que aparece al entrar al
            sitio. Para cambiar su decisión, borre los datos de este sitio en su navegador y el aviso
            volverá a mostrarse. También puede bloquear las cookies desde la configuración de su
            navegador.
          </p>
        </Section>

        <Section title="11. Menores de edad">
          <p>
            Este sitio no está dirigido a menores de edad y no recopilamos intencionalmente sus datos.
            Si usted es padre, madre o tutor y cree que un menor nos proporcionó datos, escríbanos para
            eliminarlos.
          </p>
        </Section>

        <Section title="12. Enlaces a otros sitios">
          <p>
            Este sitio contiene enlaces a sitios de terceros, como redes sociales, WhatsApp y páginas
            de las marcas que distribuimos. Esos sitios tienen sus propias políticas de privacidad,
            de las que Granalto no es responsable.
          </p>
        </Section>

        <Section title="13. Cambios a esta política">
          <p>
            Podemos actualizar esta política para reflejar cambios en nuestros servicios o en la
            normativa. La versión vigente estará siempre publicada en esta página con su fecha de
            actualización. Consulte también nuestros{" "}
            <Link href="/terminos-y-condiciones" className="underline underline-offset-4">términos y condiciones</Link>.
          </p>
        </Section>
      </div>
    </div>
  );
}
