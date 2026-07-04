import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getMandates } from "@/services/mandatesService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, FileText, Plus, Search, Calendar, User } from "lucide-react";

export default function MandatesPage() {
  const router = useRouter();
  const { user, profile, agency, loading: authLoading } = useAuth();
  const [mandates, setMandates] = useState<any[]>([]);
  const [filteredMandates, setFilteredMandates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (agency?.id) {
      loadMandates();
    }
  }, [agency?.id]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mandates.filter(
        (m) =>
          m.properties?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMandates(filtered);
    } else {
      setFilteredMandates(mandates);
    }
  }, [searchTerm, mandates]);

  async function loadMandates() {
    if (!agency?.id) return;
    try {
      const data = await getMandates(agency.id);
      setMandates(data ?? []);
      setFilteredMandates(data ?? []);
    } catch (error) {
      console.error("Error loading mandates:", error);
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
    const variants: Record<string, "available" | "rented" | "default"> = {
      actif: "available",
      expire: "rented",
      termine: "default",
    };
    return variants[status] || "default";
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
                <h1 className="text-3xl font-serif font-bold">Gestion des Mandats</h1>
                <p className="text-sm text-primary-foreground/80">{agency.name}</p>
              </div>
            </div>
            <Link href="/mandates/new">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Mandat
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
              placeholder="Rechercher par bien ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredMandates.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun mandat trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Aucun mandat ne correspond à votre recherche."
                  : "Commencez par créer votre premier mandat."}
              </p>
              {!searchTerm && (
                <Link href="/mandates/new">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un mandat
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMandates.map((mandate) => (
              <Card
                key={mandate.id}
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/mandates/${mandate.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-lg hover:text-accent transition-colors">
                        {mandate.properties?.title || "Bien supprimé"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <FileText className="w-3 h-3" />
                        Mandat de {mandate.type}
                      </CardDescription>
                    </div>
                    <StatusBadge variant={getStatusVariant(mandate.status)}>
                      {mandate.status}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Propriétaire :</span>
                    <span className="font-medium">
                      {mandate.profiles
                        ? `${mandate.profiles.first_name} ${mandate.profiles.last_name}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Du {new Date(mandate.start_date).toLocaleDateString()} au{" "}
                      {new Date(mandate.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Honoraires</span>
                    <span className="text-xl font-bold text-accent tabular-nums">
                      {mandate.fees.toLocaleString()} €
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}