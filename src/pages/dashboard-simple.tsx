import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, LogOut, CheckCircle2, DollarSign } from "lucide-react";
import { mockStats } from "@/lib/mock-data";

export default function DashboardSimple() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier mode démo
    const demoUser = localStorage.getItem("demo_user");
    const demoModeActive = localStorage.getItem("demo_mode_active") === "true";

    console.log("=== Dashboard Simple Debug ===");
    console.log("Demo user:", demoUser);
    console.log("Demo mode active:", demoModeActive);

    if (demoUser && demoModeActive) {
      try {
        const demoProfile = JSON.parse(demoUser);
        console.log("Profile chargé:", demoProfile);
        setProfile(demoProfile);
      } catch (error) {
        console.error("Erreur parsing profile:", error);
      }
    } else {
      console.log("Pas de mode démo, redirection...");
      router.push("/auth/login");
    }
    
    setLoading(false);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/auth/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Aucun profil trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Mode démo non activé. Retournez à la page de connexion.
            </p>
            <Button onClick={() => router.push("/auth/login")} className="w-full">
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-4 sticky top-0 z-50 shadow-sm">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_Amiri.png" alt="AMIRI" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold">AMIRI - Mode Démo</h1>
              <p className="text-sm text-muted-foreground">
                {profile.first_name} {profile.last_name} • {profile.role}
              </p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>✅ Mode Démo Fonctionnel !</strong>
            <p className="text-sm mt-1">
              Si vous voyez ce message, la connexion et l&apos;authentification fonctionnent correctement.
              Données mockées chargées avec succès.
            </p>
          </AlertDescription>
        </Alert>

        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">Dashboard Simplifié</h2>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-5 w-5 text-accent" />
                  Total Biens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockStats.totalProperties}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  dans le portefeuille
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{mockStats.availableProperties}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  prêts à louer/vendre
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Revenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  FCFA - revenus totaux
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-accent hover:bg-accent/90" size="lg">
              <Link href="/dashboard">
                🎨 Tester Dashboard Complet (avec graphiques)
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline" size="lg">
              <Link href="/properties">
                🏠 Voir les Biens
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline" size="lg">
              <Link href="/profile">
                👤 Mon Profil
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline" size="lg">
              <Link href="/public/catalogue">
                🌐 Catalogue Public
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription className="text-sm">
            <p className="font-semibold mb-2">📝 Note Importante</p>
            <p>
              Ce dashboard simplifié fonctionne <strong>sans connexion Supabase</strong>.
              Toutes les données sont mockées localement. Pour une utilisation en production
              avec la vraie base de données, déployez l&apos;application sur Vercel.
            </p>
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
}