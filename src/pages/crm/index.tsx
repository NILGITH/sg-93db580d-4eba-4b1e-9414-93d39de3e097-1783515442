import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { mockProspects, mockProperties } from "@/lib/mock-data";
import { Building2, Users, Search, Phone, Mail, MapPin } from "lucide-react";

export default function CRMPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();

  const [prospects] = useState(mockProspects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  const filteredProspects = prospects.filter((prospect) => {
    const matchesStatus = filterStatus === "all" || prospect.status === filterStatus;
    const matchesSearch = !searchQuery || 
      prospect.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchQuery.toLowerCase());
    
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
                <h1 className="text-3xl font-serif font-bold">Gestion Prospects (CRM)</h1>
                <p className="text-sm text-primary-foreground/80">Suivi et qualification - {prospects.length} prospects</p>
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
                    placeholder="Rechercher (nom, email)..."
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
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{prospects.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nouveaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {prospects.filter(p => p.status === "nouveau").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {prospects.filter(p => p.status === "en_cours").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des prospects */}
        {filteredProspects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun prospect</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProspects.map((prospect) => {
              const property = mockProperties.find(p => p.id === prospect.property_id);
              const createdDate = new Date(prospect.created_at);

              return (
                <Card key={prospect.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={prospect.status === "nouveau" ? "default" : "secondary"}
                            className={prospect.status === "nouveau" ? "bg-blue-600" : ""}
                          >
                            {prospect.status === "nouveau" ? "Nouveau" : "En cours"}
                          </Badge>

                          <Badge variant="outline">
                            {prospect.request_type === "visite" ? "Demande de visite" :
                             prospect.request_type === "achat" ? "Demande d'achat" : "Demande location"}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{prospect.first_name} {prospect.last_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              {prospect.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              {prospect.email}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {property && (
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">{property.title}</p>
                                  <p className="text-muted-foreground text-xs">
                                    {property.id} • {property.city}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm">
                              <p className="text-muted-foreground text-xs">
                                Créé le {createdDate.toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {prospect.notes && (
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="text-muted-foreground italic">"{prospect.notes}"</p>
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