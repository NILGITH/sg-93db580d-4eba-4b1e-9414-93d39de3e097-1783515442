import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Home, DollarSign, TrendingUp } from "lucide-react";

export default function OwnerPortalPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
    if (profile && profile.role !== "owner") {
      router.push("/dashboard");
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    if (user?.id) {
      loadOwnerData();
    }
  }, [user?.id]);

  async function loadOwnerData() {
    if (!user?.id) return;
    try {
      const { data: ownerData } = await supabase
        .from("owners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (ownerData) {
        const { data: propertiesData } = await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", ownerData.id);

        setProperties(propertiesData ?? []);
      }
    } catch (error) {
      console.error("Error loading owner data:", error);
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

  if (!user || !profile) {
    return null;
  }

  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
  const rentedProperties = properties.filter((p) => p.status === "loue").length;
  const occupancyRate =
    properties.length > 0 ? Math.round((rentedProperties / properties.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Portail Propriétaire</h1>
                <p className="text-sm text-primary-foreground/80">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>
            <StatusBadge variant="premium">PROPRIÉTAIRE</StatusBadge>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Vue d'ensemble de votre patrimoine
          </h2>
          <p className="text-muted-foreground">Suivi en temps réel de vos biens immobiliers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mes Biens
              </CardTitle>
              <Home className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground tabular-nums">
                {properties.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {rentedProperties} actuellement loués
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valeur du Patrimoine
              </CardTitle>
              <DollarSign className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent tabular-nums">
                {totalValue.toLocaleString()} €
              </div>
              <p className="text-xs text-muted-foreground mt-1">Valeur totale estimée</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taux d'Occupation
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent tabular-nums">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Performance du portefeuille</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Biens Disponibles
              </CardTitle>
              <Home className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground tabular-nums">
                {properties.filter((p) => p.status === "disponible").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Prêts à louer</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-serif">Mes Biens</CardTitle>
            <CardDescription>Liste de vos propriétés en gestion</CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun bien enregistré</p>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{property.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.address}, {property.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent tabular-nums">
                        {property.price?.toLocaleString()} €
                      </p>
                      <StatusBadge
                        variant={
                          property.status === "loue"
                            ? "rented"
                            : property.status === "disponible"
                              ? "available"
                              : "default"
                        }
                      >
                        {property.status}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}