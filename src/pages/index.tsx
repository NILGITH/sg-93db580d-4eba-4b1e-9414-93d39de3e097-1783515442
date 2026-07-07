import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers le site vitrine
    router.push("/public");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-primary-foreground">
      <div className="container py-20">
        <div className="text-center space-y-8">
          <img src="/logo_Amiri.png" alt="AMIRI" className="h-20 w-auto mx-auto" />
          
          <h1 className="text-5xl font-bold">
            Bienvenue chez AMIRI
          </h1>
          
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Votre partenaire immobilier de confiance pour la gestion, location et vente de biens au Sénégal
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/public">
              <Button size="lg" variant="secondary">
                <Building2 className="w-5 h-5 mr-2" />
                Voir nos biens
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Espace Client
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-8 pt-12">
            <div className="space-y-2">
              <Building2 className="w-12 h-12 mx-auto text-accent" />
              <h3 className="font-semibold">Gestion Complète</h3>
              <p className="text-sm text-primary-foreground/70">
                Gérez tous vos biens depuis une seule plateforme
              </p>
            </div>

            <div className="space-y-2">
              <Users className="w-12 h-12 mx-auto text-accent" />
              <h3 className="font-semibold">Suivi Client</h3>
              <p className="text-sm text-primary-foreground/70">
                CRM intégré pour prospects et locataires
              </p>
            </div>

            <div className="space-y-2">
              <TrendingUp className="w-12 h-12 mx-auto text-accent" />
              <h3 className="font-semibold">Rapports Détaillés</h3>
              <p className="text-sm text-primary-foreground/70">
                Analyses et rapports automatisés
              </p>
            </div>

            <div className="space-y-2">
              <Shield className="w-12 h-12 mx-auto text-accent" />
              <h3 className="font-semibold">Sécurisé</h3>
              <p className="text-sm text-primary-foreground/70">
                Données protégées et conformes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}