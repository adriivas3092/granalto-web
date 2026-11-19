import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { TrackedContactLink } from "@/components/layout/TrackedContactLink";
import { getWhatsAppUrl } from "@/config/site";

/**
 * Llamados a la acción del hero: cotizar por WhatsApp (con el material o la
 * colección ya escritos en el mensaje) y pedir asesoría por formulario.
 */
export function HeroQuoteActions({ label, source }: { label: string; source: string }) {
  return (
    <>
      <TrackedContactLink
        href={getWhatsAppUrl(`Hola, me interesa cotizar ${label}. ¿Me pueden asesorar?`)}
        event={{ name: "whatsapp_click", params: { source } }}
        external
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-ivory px-6 py-3 text-sm font-medium tracking-wide text-ink transition-colors duration-300 hover:bg-stone-beige"
      >
        <MessageCircle aria-hidden="true" className="h-4 w-4" />
        Cotizar {label}
      </TrackedContactLink>
      <ButtonLink href="/contacto" variant="outline" onDark>
        Solicitar asesoría
      </ButtonLink>
    </>
  );
}
