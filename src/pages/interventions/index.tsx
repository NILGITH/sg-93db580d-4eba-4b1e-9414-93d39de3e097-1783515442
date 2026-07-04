import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getInterventions } from "@/services/interventionsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Wrench, Plus, Search, Calendar, User, AlertCircle } from "lucide-react";

export default function InterventionsPage() {
  const router = useRouter();
  const { user, profile, agency, loading: authLoading } = useAuth();
  const [interventions, setInterventions] = useState<any[]>([]);
  const [filteredInterventions, setFilteredInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (agency?.id) {
      loadInterventions();
    }
  }, [agency?.id]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = interventions.filter(
        (i) =>
          i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.properties?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInterventions(filtered);
    } else {
      setFilteredInterventions(interventions);
    }
  }, [searchTerm, interventions]);

  async function loadInterventions() {
    if (!agency?.id) return;
    try {
      const data = await getInterventions(agency.id);
      setInterventions(data ?? []);
      setFilteredInterventions(data ?? []);
    } catch (error) {
      console.error("Error loading interventions:", error);
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

  if (!user || !profile || !agency) {
    return null;
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, "available" | "maintenance" | "default"> = {
      planifiee: "available",
      en_cours: "maintenance",
      terminee: "default",
      annulee: "default",
    };
    return variants[status] || "default";
  };

  const getUrgencyVariant = (urgency: string) => {
    const variants: Record<string, "available" | "maintenance" | "default"> = {
      basse: "available",
      moyenne: "maintenance",
      haute: "maintenance",
      urgente: "maintenance",
    };
    return variants[urgency] || "default";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Building2 className="w-10 h-10 text-accent cursor-pointer hover:text-accent/80" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-bold">Interventions & Travaux</h1>
                <p className="text-sm text-primary-foreground/80">{agency.name}</p>
              </div>
            </div>
            <Link href="/interventions/new">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Intervention
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, bien ou statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredInterventions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune intervention trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Aucune intervention ne correspond à votre recherche."
                  : "Commencez par planifier une intervention."}
              </p>
              {!searchTerm && (
                <Link href="/interventions/new">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Planifier une intervention
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInterventions.map((intervention) => (
              <Card
                key={intervention.id}
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/interventions/${intervention.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-lg hover:text-accent transition-colors">
                        {intervention.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {intervention.properties?.title || "Bien supprimé"}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <StatusBadge variant={getStatusVariant(intervention.status)}>
                        {intervention.status.replace("_", " ")}
                      </StatusBadge>
                      {intervention.urgency && (
                        <StatusBadge variant={getUrgencyVariant(intervention.urgency)} className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {intervention.urgency}
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {intervention.providers && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Prestataire :</span>
                      <span className="font-medium">{intervention.providers.company_name}</span>
                    </div>
                  )}
                  {intervention.scheduled_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Planifiée le {new Date(intervention.scheduled_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {intervention.estimated_cost && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Coût estimé</span>
                      <span className="text-xl font-bold text-accent tabular-nums">
                        {intervention.estimated_cost.toLocaleString()} €
                      </span>
                    </div>
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