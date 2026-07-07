import { Html, Head, Main, NextScript } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document() {
  return (
    <Html lang="fr" suppressHydrationWarning>
      <Head>
        {/* Favicon Amiri */}
        <link rel="icon" type="image/svg+xml" href="/logo-icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo_Amiri.png" />
        <link rel="apple-touch-icon" href="/logo_Amiri.png" />
        
        {/* SEO par défaut */}
        <SEOElements 
          title="AMIRI - Gestion Immobilière Professionnelle"
          description="Plateforme complète de gestion immobilière. Location, vente, gestion locative et suivi de patrimoine immobilier au Sénégal."
          image="/logo_Amiri.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
