import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { mockInterventions, mockProperties } from "@/lib/mock-data";
import { Wrench, Calendar, MapPin, LogOut, CheckCircle } from "lucide-react";

export default function ProviderMissionsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/select-profile");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  if (profile.role !== "provider") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    );
  }

  // Filtrer les missions pour ce prestataire
  const assignedMissions = mockInterventions.slice(0, 8);
  const pendingMissions = assignedMissions.filter(m => m.status === "pending");
  const inProgressMissions = assignedMissions.filter(m => m.status === "in_progress");
  const completedMissions = assignedMissions.filter(m => m.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Wrench className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Mes Missions</h1>
                <p className="text-sm text-primary-foreground/80">
                  {profile.first_name} {profile.last_name} - Prestataire
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="border-accent text-accent hover:bg-accent hover:text-primary">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">{pendingMissions.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{inProgressMissions.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{completedMissions.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">En attente ({pendingMissions.length})</TabsTrigger>
            <TabsTrigger value="in_progress">En cours ({inProgressMissions.length})</TabsTrigger>
            <TabsTrigger value="completed">Terminées ({completedMissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingMissions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune mission en attente</p>
                </CardContent>
              </Card>
            ) : (
              pendingMissions.map((mission) => {
                const property = mockProperties.find(p => p.id === mission.property_id);
                return (
                  <Card key={mission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="bg-amber-600 text-white">
                              En attente
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {mission.intervention_type}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-lg">{mission.description}</h3>

                          {property && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">{property.title}</p>
                                <p className="text-muted-foreground text-xs">
                                  {property.address}, {property.city}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Programmé: {new Date(mission.scheduled_date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>

                          {mission.notes && (
                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                              <p className="text-muted-foreground italic">"{mission.notes}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {inProgressMissions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune mission en cours</p>
                </CardContent>
              </Card>
            ) : (
              inProgressMissions.map((mission) => {
                const property = mockProperties.find(p => p.id === mission.property_id);
                return (
                  <Card key={mission.id} className="hover:shadow-md transition-shadow border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="bg-blue-600 text-white">
                              En cours
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {mission.intervention_type}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-lg">{mission.description}</h3>

                          {property && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">{property.title}</p>
                                <p className="text-muted-foreground text-xs">
                                  {property.address}, {property.city}
                                </p>
                              </div>
                            </div>
                          )}

                          {mission.notes && (
                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                              <p className="text-muted-foreground italic">"{mission.notes}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedMissions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune mission terminée</p>
                </CardContent>
              </Card>
            ) : (
              completedMissions.map((mission) => {
                const property = mockProperties.find(p => p.id === mission.property_id);
                return (
                  <Card key={mission.id} className="hover:shadow-md transition-shadow opacity-80">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="bg-green-600 text-white">
                              Terminée
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {mission.intervention_type}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-lg">{mission.description}</h3>

                          {property && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">{property.title}</p>
                                <p className="text-muted-foreground text-xs">
                                  {property.address}, {property.city}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}