import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, LogOut } from "lucide-react";
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
      const demoProfile = JSON.parse(demoUser);
      console.log("Profile chargé:", demoProfile);
      setProfile(demoProfile);
      setLoading(false);
    } else {
      console.log("Pas de mode démo, redirection...");
      router.push("/auth/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/auth/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Aucun profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card p-4">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">AMIRI - Mode Démo</h1>
            <p className="text-sm text-muted-foreground">
              {profile.first_name} {profile.last_name} ({profile.role})
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Simplifié</h2>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Total Biens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.totalProperties}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.availableProperties}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockStats.totalRevenue.toLocaleString()} FCFA</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Mode Démo Fonctionnel</h3>
          <p className="text-sm text-green-700">
            Si vous voyez ce message, le mode démo fonctionne. Le problème vient du dashboard complet
            (probablement les graphiques Recharts).
          </p>
          <div className="mt-4 space-y-2">
            <Button asChild className="w-full">
              <a href="/dashboard">Tester Dashboard Complet</a>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <a href="/properties">Voir les Biens</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}