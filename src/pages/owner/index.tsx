import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { mockProperties, mockPayments, mockInterventions } from "@/lib/mock-data";
import { Building2, DollarSign, Wrench, FileText, Home, LogOut } from "lucide-react";

export default function OwnerPage() {
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

  if (profile.role !== "owner") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    );
  }

  // Filtrer les données pour ce propriétaire (simulé)
  const ownerProperties = mockProperties.slice(0, 4);
  const ownerPayments = mockPayments.slice(0, 6);
  const ownerInterventions = mockInterventions.slice(0, 5);

  const totalRevenue = ownerPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = ownerPayments.filter(p => p.status === "pending").length;
  const activeInterventions = ownerInterventions.filter(i => i.status !== "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Home className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Espace Propriétaire</h1>
                <p className="text-sm text-primary-foreground/80">
                  {profile.first_name} {profile.last_name} - {ownerProperties.length} biens
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mes biens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{ownerProperties.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenus totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {totalRevenue.toLocaleString()} FCFA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paiements en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">{pendingPayments}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interventions actives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{activeInterventions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="properties" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Mes Biens</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            {ownerProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-semibold">{property.title}</h3>
                        <Badge variant={property.status === "disponible" ? "default" : "secondary"}>
                          {property.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{property.type}</Badge>
                      </div>

                      <p className="text-muted-foreground">{property.address}, {property.city}</p>

                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pièces:</span>{" "}
                          <span className="font-medium">{property.rooms}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Surface:</span>{" "}
                          <span className="font-medium">{property.surface}m²</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Prix:</span>{" "}
                          <span className="font-semibold text-primary">
                            {property.price.toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {ownerPayments.map((payment) => {
              const property = mockProperties.find(p => p.id === payment.property_id);
              return (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={payment.status === "paid" ? "default" : "secondary"}
                            className={payment.status === "paid" ? "bg-green-600" : "bg-amber-600"}>
                            {payment.status === "paid" ? "Payé" : "En attente"}
                          </Badge>
                          <span className="font-semibold text-lg">
                            {payment.amount.toLocaleString()} FCFA
                          </span>
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Locataire:</span>{" "}
                          <span className="font-medium">{payment.tenant_name}</span>
                        </p>
                        {property && (
                          <p className="text-sm text-muted-foreground">{property.title}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="interventions" className="space-y-4">
            {ownerInterventions.map((intervention) => {
              const property = mockProperties.find(p => p.id === intervention.property_id);
              return (
                <Card key={intervention.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant={
                            intervention.status === "completed" ? "default" :
                            intervention.status === "in_progress" ? "secondary" : "outline"
                          }
                          className={
                            intervention.status === "completed" ? "bg-green-600" :
                            intervention.status === "in_progress" ? "bg-blue-600" : "bg-amber-600"
                          }>
                            {intervention.status === "pending" ? "En attente" :
                             intervention.status === "in_progress" ? "En cours" : "Terminée"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {intervention.intervention_type}
                          </Badge>
                        </div>
                        <p className="font-medium">{intervention.description}</p>
                        {property && (
                          <p className="text-sm text-muted-foreground">{property.title}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(intervention.scheduled_date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}