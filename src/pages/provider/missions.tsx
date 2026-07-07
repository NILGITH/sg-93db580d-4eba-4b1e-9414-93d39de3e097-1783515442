import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { getInterventionsByProvider } from "@/services/interventionsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Wrench, Calendar, MapPin } from "lucide-react";

export default function ProviderMissionsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile?.role === "provider") {
      loadMissions();
    }
  }, [user, profile]);

  async function loadMissions() {
    try {
      if (!profile?.id) return;
      const data = await getInterventionsByProvider(profile.id);
      setMissions(data ?? []);
    } catch (error) {
      console.error("Error loading missions:", error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user || !profile || profile.role !== "provider") {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Building2 className="w-10 h-10 text-accent" />
            <div>
              <h1 className="text-3xl font-serif font-bold">Mes Missions</h1>
              <p className="text-sm text-primary-foreground/80">
                {profile.first_name} {profile.last_name} - Prestataire
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Wrench className="w-6 h-6 text-accent" />
              Missions en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">
              {missions.filter((m) => m.status === "en_cours" || m.status === "planifiee").length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">intervention(s) active(s)</p>
          </CardContent>
        </Card>

        {missions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune mission assignée</h3>
              <p className="text-muted-foreground">
                Vous serez notifié lorsqu'une nouvelle mission vous sera confiée.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {missions.map((mission) => (
              <Card key={mission.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-lg">
                        {mission.type.replace("_", " ")}
                      </CardTitle>
                      {mission.properties && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {mission.properties.reference}
                        </p>
                      )}
                    </div>
                    <StatusBadge
                      variant={
                        mission.status === "planifiee"
                          ? "available"
                          : mission.status === "en_cours"
                          ? "maintenance"
                          : "default"
                      }
                    >
                      {mission.status.replace("_", " ")}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mission.properties && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">
                        {mission.properties.address}, {mission.properties.city}
                      </span>
                    </div>
                  )}
                  {mission.intervention_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(mission.intervention_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {mission.description && (
                    <p className="text-sm text-muted-foreground pt-2 border-t">
                      {mission.description}
                    </p>
                  )}
                  {mission.status === "planifiee" && (
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                      Démarrer l'intervention
                    </Button>
                  )}
                  {mission.status === "en_cours" && (
                    <Button className="w-full" variant="outline">
                      Clôturer et ajouter photos
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}