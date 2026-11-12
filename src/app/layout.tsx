import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig, getSiteUrl } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationSchema } from "@/lib/schema";

// Montserrat como única familia: regular (400) para cuerpo y textos,
// bold (700) para titulares y textos de importancia.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.seo.locale,
    type: "website",
    images: [{ url: siteConfig.seo.defaultOgImage }],
  },
  twitter: { card: "summary_large_image" },
  // Verificación de Google Search Console (código público que va en el HTML).
  // Se puede sobrescribir con NEXT_PUBLIC_GSC_VERIFICATION.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GSC_VERIFICATION ||
      "DXu7ykF88h0euzGTMxPolu0gx9RHipKUys3W_XFP9Uc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body>
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
        >
          Saltar al contenido principal
        </a>
        <JsonLd data={organizationSchema()} />
        <Header />
        <main id="contenido-principal">{children}</main>
        <Footer />
        <CookieBanner />
        <GoogleAnalytics />
        <WhatsAppButton />
      </body>
    </html>
  );
}
