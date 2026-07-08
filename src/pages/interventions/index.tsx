import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { mockInterventions, mockProperties } from "@/lib/mock-data";
import { Building2, Wrench, Search, Calendar, MapPin } from "lucide-react";

export default function InterventionsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();

  const [interventions] = useState(mockInterventions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  const filteredInterventions = interventions.filter((intervention) => {
    const matchesStatus = filterStatus === "all" || intervention.status === filterStatus;
    const matchesSearch = !searchQuery || 
      intervention.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intervention.intervention_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  if (!["admin", "agent"].includes(profile.role)) {
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
                <h1 className="text-3xl font-serif font-bold">Gestion des Interventions</h1>
                <p className="text-sm text-primary-foreground/80">Travaux et maintenances - {interventions.length} interventions</p>
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par description ou type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {interventions.filter(i => i.status === "pending").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {interventions.filter(i => i.status === "in_progress").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {interventions.filter(i => i.status === "completed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des interventions */}
        {filteredInterventions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune intervention</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInterventions.map((intervention) => {
              const property = mockProperties.find(p => p.id === intervention.property_id);
              const scheduledDate = new Date(intervention.scheduled_date);

              return (
                <Card key={intervention.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={
                              intervention.status === "completed" ? "default" :
                              intervention.status === "in_progress" ? "secondary" : "outline"
                            }
                            className={
                              intervention.status === "completed" ? "bg-green-600" :
                              intervention.status === "in_progress" ? "bg-blue-600" : "bg-amber-600"
                            }
                          >
                            {intervention.status === "pending" ? "En attente" :
                             intervention.status === "in_progress" ? "En cours" : "Terminée"}
                          </Badge>

                          <Badge variant="outline" className="capitalize">
                            {intervention.intervention_type}
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
                            <p className="text-sm font-medium">{intervention.description}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {scheduledDate.toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {intervention.notes && (
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="text-muted-foreground italic">"{intervention.notes}"</p>
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