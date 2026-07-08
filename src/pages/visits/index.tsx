import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { mockVisits, mockProperties, mockProspects } from "@/lib/mock-data";
import { Building2, Calendar, MapPin, User, Clock } from "lucide-react";

export default function VisitsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();

  const [visits] = useState(mockVisits);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  const filteredVisits = visits.filter((visit) => {
    return filterStatus === "all" || visit.status === filterStatus;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  if (!["admin", "agent", "secretary"].includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Gestion des Visites</h1>
                <p className="text-sm text-primary-foreground/80">Planning et suivi - {visits.length} visites</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                Tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="confirmee">Confirmée</SelectItem>
                  <SelectItem value="effectuee">Effectuée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{visits.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {visits.filter(v => v.status === "en_attente").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {visits.filter(v => v.status === "confirmee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Effectuées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {visits.filter(v => v.status === "effectuee").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des visites */}
        {filteredVisits.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune visite</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredVisits.map((visit) => {
              const property = mockProperties.find(p => p.id === visit.property_id);
              const prospect = mockProspects.find(p => p.id === visit.prospect_id);
              const visitDate = new Date(visit.visit_date);

              return (
                <Card key={visit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={
                              visit.status === "confirmee" ? "default" :
                              visit.status === "effectuee" ? "default" :
                              visit.status === "en_attente" ? "secondary" : "destructive"
                            }
                            className={
                              visit.status === "confirmee" ? "bg-blue-600" :
                              visit.status === "effectuee" ? "bg-green-600" :
                              visit.status === "annulee" ? "bg-red-600" : ""
                            }
                          >
                            {visit.status === "en_attente" ? "En attente" :
                             visit.status === "confirmee" ? "Confirmée" :
                             visit.status === "effectuee" ? "Effectuée" : "Annulée"}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
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

                          <div className="space-y-2">
                            {prospect && (
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {prospect.first_name} {prospect.last_name}
                                </span>
                              </div>
                            )}
                            {prospect && (
                              <p className="text-xs text-muted-foreground pl-6">
                                {prospect.phone}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">
                                {visitDate.toLocaleDateString("fr-FR", { 
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              {visitDate.toLocaleTimeString("fr-FR", { 
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </div>

                        {visit.notes && (
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="text-muted-foreground italic">"{visit.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}