import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Home, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Wrench, 
  Image as ImageIcon,
  Download,
  Calendar,
  CreditCard
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];
type Intervention = Database["public"]["Tables"]["interventions"]["Row"] & {
  properties?: { reference: string; title: string } | null;
  providers?: { company_name: string } | null;
};
type Document = Database["public"]["Tables"]["documents"]["Row"] & {
  properties?: { reference: string; title: string } | null;
};
type Report = Database["public"]["Tables"]["reports"]["Row"] & {
  properties?: { reference: string; title: string } | null;
};

export default function OwnerPortalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProperties: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    pendingInterventions: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      if (profile.role !== "owner") {
        router.push("/dashboard");
        return;
      }
      loadData();
    }
  }, [user, profile]);

  async function loadData() {
    if (!user) return;

    try {
      setLoading(true);

      // Charger les biens du propriétaire
      const { data: propsData, error: propsError } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (propsError) throw propsError;
      setProperties(propsData || []);

      const propertyIds = propsData?.map(p => p.id) || [];

      if (propertyIds.length > 0) {
        // Charger les paiements
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("*")
          .in("property_id", propertyIds)
          .order("payment_date", { ascending: false });

        setPayments(paymentsData || []);

        // Charger les interventions
        const { data: interventionsData } = await supabase
          .from("interventions")
          .select("*, properties(reference, title), providers(company_name)")
          .in("property_id", propertyIds)
          .order("created_at", { ascending: false });

        setInterventions(interventionsData || []);

        // Charger les documents
        const { data: documentsData } = await supabase
          .from("documents")
          .select("*, properties(reference, title)")
          .in("property_id", propertyIds)
          .order("created_at", { ascending: false });

        setDocuments(documentsData || []);

        // Charger les rapports
        const { data: reportsData } = await supabase
          .from("reports")
          .select("*, properties(reference, title)")
          .eq("owner_id", user.id)
          .order("period_end", { ascending: false });

        setReports(reportsData || []);

        // Calculer les statistiques
        const totalRevenue = paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        const totalExpenses = interventionsData?.reduce((sum, i) => sum + (i.actual_cost || i.estimated_cost || 0), 0) || 0;
        const pendingInterventions = interventionsData?.filter(i => i.status !== "validee" && i.status !== "annulee").length || 0;

        setStats({
          totalProperties: propsData?.length || 0,
          totalRevenue,
          totalExpenses,
          pendingInterventions,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Espace Propriétaire</h1>
                <p className="text-sm text-primary-foreground/80">
                  Bienvenue {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/auth/login")}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-primary"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement de vos données...</p>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Mes Biens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalProperties}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Revenus Totaux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} FCFA</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Dépenses Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">{stats.totalExpenses.toLocaleString()} FCFA</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Interventions en cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{stats.pendingInterventions}</p>
                </CardContent>
              </Card>
            </div>

            {/* Résumé financier */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Bilan Financier</CardTitle>
                <CardDescription>Vue d'ensemble de votre rentabilité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-muted-foreground">Revenus</span>
                    <span className="text-lg font-semibold text-green-600">
                      +{stats.totalRevenue.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-muted-foreground">Dépenses</span>
                    <span className="text-lg font-semibold text-red-600">
                      -{stats.totalExpenses.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold">Revenu Net</span>
                    <span className="text-2xl font-bold text-accent">
                      {(stats.totalRevenue - stats.totalExpenses).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets de contenu */}
            <Tabs defaultValue="properties" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="properties">Mes Biens</TabsTrigger>
                <TabsTrigger value="payments">Paiements</TabsTrigger>
                <TabsTrigger value="interventions">Interventions</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="reports">Rapports</TabsTrigger>
              </TabsList>

              {/* Mes Biens */}
              <TabsContent value="properties" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Biens Immobiliers</CardTitle>
                    <CardDescription>{properties.length} bien(s) enregistré(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {properties.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Aucun bien enregistré pour le moment
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {properties.map((property) => (
                          <Card key={property.id} className="border-l-4 border-l-accent">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Réf: {property.reference}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <Badge variant={property.status === "disponible" ? "default" : "secondary"}>
                                      {property.status}
                                    </Badge>
                                    <span className="capitalize">{property.property_type}</span>
                                    <span>•</span>
                                    <span>{property.rooms} pièces</span>
                                    <span>•</span>
                                    <span>{property.surface_area} m²</span>
                                    <span>•</span>
                                    <span className="font-semibold">{property.price.toLocaleString()} FCFA</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {property.address}, {property.city}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Paiements */}
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des Paiements</CardTitle>
                    <CardDescription>{payments.length} paiement(s) enregistré(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Aucun paiement enregistré
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {payments.slice(0, 10).map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium capitalize">{payment.payment_type}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(payment.payment_date).toLocaleDateString("fr-FR")} • {payment.payment_method}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                +{payment.amount.toLocaleString()} FCFA
                              </p>
                              {payment.is_validated && (
                                <Badge variant="outline" className="text-xs">Validé</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Interventions */}
              <TabsContent value="interventions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interventions et Travaux</CardTitle>
                    <CardDescription>{interventions.length} intervention(s) enregistrée(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {interventions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Aucune intervention enregistrée
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {interventions.map((intervention) => (
                          <Card key={intervention.id} className="border">
                            <CardContent className="pt-6">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold">{intervention.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {intervention.properties?.reference} • {intervention.providers?.company_name}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      intervention.status === "validee" ? "default" :
                                      intervention.status === "terminee" ? "secondary" :
                                      "outline"
                                    }
                                  >
                                    {intervention.status}
                                  </Badge>
                                </div>

                                <p className="text-sm">{intervention.description}</p>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(intervention.scheduled_date).toLocaleDateString("fr-FR")}
                                  </span>
                                  <span>•</span>
                                  <span className="capitalize">{intervention.intervention_type}</span>
                                  <span>•</span>
                                  <span>{(intervention.actual_cost || intervention.estimated_cost).toLocaleString()} FCFA</span>
                                </div>

                                {/* Photos avant/après */}
                                {((intervention.photos_before && Array.isArray(intervention.photos_before) && intervention.photos_before.length > 0) ||
                                  (intervention.photos_after && Array.isArray(intervention.photos_after) && intervention.photos_after.length > 0)) && (
                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    {intervention.photos_before && Array.isArray(intervention.photos_before) && intervention.photos_before.length > 0 && (
                                      <div>
                                        <p className="text-xs font-medium mb-2">Photos AVANT</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {(intervention.photos_before as string[]).slice(0, 2).map((photo, idx) => (
                                            <img
                                              key={idx}
                                              src={photo}
                                              alt={`Avant ${idx + 1}`}
                                              className="w-full h-24 object-cover rounded-lg border"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {intervention.photos_after && Array.isArray(intervention.photos_after) && intervention.photos_after.length > 0 && (
                                      <div>
                                        <p className="text-xs font-medium mb-2">Photos APRÈS</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {(intervention.photos_after as string[]).slice(0, 2).map((photo, idx) => (
                                            <img
                                              key={idx}
                                              src={photo}
                                              alt={`Après ${idx + 1}`}
                                              className="w-full h-24 object-cover rounded-lg border"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {intervention.provider_comment && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs font-medium mb-1">Commentaire du prestataire</p>
                                    <p className="text-sm text-muted-foreground">{intervention.provider_comment}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Documents</CardTitle>
                    <CardDescription>{documents.length} document(s) disponible(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {documents.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Aucun document disponible
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent/10 rounded-lg">
                                <FileText className="w-4 h-4 text-accent" />
                              </div>
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.properties?.reference} • {doc.type}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(doc.file_url, "_blank")}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Télécharger
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rapports */}
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rapports de Gestion</CardTitle>
                    <CardDescription>{reports.length} rapport(s) disponible(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reports.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Aucun rapport généré pour le moment
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {reports.map((report) => (
                          <Card key={report.id} className="border-l-4 border-l-accent">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold mb-1">
                                    Rapport {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {new Date(report.period_start).toLocaleDateString("fr-FR")} au{" "}
                                    {new Date(report.period_end).toLocaleDateString("fr-FR")}
                                  </p>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Revenus</p>
                                      <p className="font-semibold text-green-600">
                                        +{report.total_income.toLocaleString()} FCFA
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Dépenses</p>
                                      <p className="font-semibold text-red-600">
                                        -{report.total_expenses.toLocaleString()} FCFA
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Net</p>
                                      <p className="font-semibold text-accent">
                                        {report.net_income.toLocaleString()} FCFA
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Download className="w-3 h-3 mr-1" />
                                  PDF
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-20">
        <div className="container py-8">
          <div className="text-center">
            <p className="text-sm">&copy; 2026 IMMO360. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}