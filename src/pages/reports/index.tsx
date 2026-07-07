import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, FileText, Plus, Search, Calendar, Download, Send, TrendingUp, TrendingDown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Report = Database["public"]["Tables"]["reports"]["Row"];
type ReportWithOwner = Report & {
  owners?: { first_name: string; last_name: string; email: string } | null;
};
type ReportType = Database["public"]["Enums"]["report_type"];
type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];

const REPORT_TYPES: ReportType[] = ["mensuel", "trimestriel", "semestriel", "annuel"];

export default function ReportsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [reports, setReports] = useState<ReportWithOwner[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportWithOwner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ReportType | "all">("all");
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState<Partial<ReportInsert>>({
    owner_id: "",
    report_type: "mensuel",
    period_start: "",
    period_end: "",
    total_revenue: 0,
    total_expenses: 0,
    net_income: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      loadData();
    }
  }, [user, profile]);

  async function loadData() {
    try {
      setLoading(true);

      const [reportsRes, ownersRes] = await Promise.all([
        supabase
          .from("reports")
          .select("*, owners(first_name, last_name, email)")
          .order("period_start", { ascending: false }),
        supabase.from("owners").select("id, first_name, last_name, email"),
      ]);

      if (reportsRes.error) throw reportsRes.error;
      if (ownersRes.error) throw ownersRes.error;

      setReports(reportsRes.data || []);
      setOwners(ownersRes.data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function generateReport(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);

    try {
      // Calculer les revenus et dépenses pour la période
      const { data: paymentsData } = await supabase
        .from("payments")
        .select("amount, payment_type")
        .eq("is_validated", true)
        .gte("payment_date", formData.period_start || "")
        .lte("payment_date", formData.period_end || "");

      const { data: interventionsData } = await supabase
        .from("interventions")
        .select("actual_cost")
        .eq("status", "validee")
        .gte("scheduled_date", formData.period_start || "")
        .lte("scheduled_date", formData.period_end || "");

      const totalRevenue = paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const totalExpenses = interventionsData?.reduce((sum, i) => sum + (i.actual_cost || 0), 0) || 0;
      const netIncome = totalRevenue - totalExpenses;

      const { error } = await supabase.from("reports").insert({
        owner_id: formData.owner_id,
        report_type: formData.report_type as ReportType,
        period_start: formData.period_start,
        period_end: formData.period_end,
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        net_income: netIncome,
        generated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Rapport généré",
        description: "Le rapport a été généré avec succès",
      });

      setShowCreateDialog(false);
      setFormData({
        owner_id: "",
        report_type: "mensuel",
        period_start: "",
        period_end: "",
        total_revenue: 0,
        total_expenses: 0,
        net_income: 0,
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  async function sendReport(reportId: string) {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", reportId);

      if (error) throw error;

      toast({
        title: "Rapport envoyé",
        description: "Le rapport a été marqué comme envoyé",
      });

      loadData();
      setShowDetailDialog(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le rapport",
        variant: "destructive",
      });
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesType = filterType === "all" || report.report_type === filterType;
    const matchesSearch =
      !searchQuery ||
      report.owners?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.owners?.last_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const totalReports = reports.length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const reportsThisMonth = reports.filter((r) => r.period_start.startsWith(thisMonth)).length;
  const pendingSend = reports.filter((r) => !r.sent_at).length;

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!["admin", "agent", "accountant"].includes(profile.role)) {
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
                <h1 className="text-3xl font-serif font-bold">Rapports de Gestion</h1>
                <p className="text-sm text-primary-foreground/80">
                  Rapports automatisés pour les propriétaires
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-accent text-primary hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Générer un rapport
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  Tableau de bord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{totalReports}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{reportsThisMonth}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente d'envoi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">{pendingSend}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un propriétaire..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={(value) => setFilterType(value as ReportType | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {REPORT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rapports */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun rapport</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg capitalize">{report.report_type}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.owners?.first_name} {report.owners?.last_name}
                      </CardDescription>
                    </div>
                    {report.sent_at ? (
                      <Badge variant="default" className="bg-green-600">
                        Envoyé
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-600">
                        Non envoyé
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Du {new Date(report.period_start).toLocaleDateString("fr-FR")} au{" "}
                      {new Date(report.period_end).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenus</p>
                      <p className="font-bold text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {(report.total_revenue || 0).toLocaleString("fr-FR")} €
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dépenses</p>
                      <p className="font-bold text-red-600 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {(report.total_expenses || 0).toLocaleString("fr-FR")} €
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Revenu net</p>
                    <p className="text-xl font-bold text-primary">
                      {(report.net_income || 0).toLocaleString("fr-FR")} €
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedReport(report);
                      setShowDetailDialog(true);
                    }}
                  >
                    Voir détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog création */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Générer un rapport</DialogTitle>
              <DialogDescription>Créer un rapport de gestion pour un propriétaire</DialogDescription>
            </DialogHeader>

            <form onSubmit={generateReport} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner_id">Propriétaire *</Label>
                  <Select
                    value={formData.owner_id}
                    onValueChange={(value) => setFormData({ ...formData, owner_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un propriétaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.first_name} {owner.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report_type">Type de rapport *</Label>
                  <Select
                    value={formData.report_type}
                    onValueChange={(value) => setFormData({ ...formData, report_type: value as ReportType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period_start">Date de début *</Label>
                  <Input
                    id="period_start"
                    type="date"
                    required
                    value={formData.period_start}
                    onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period_end">Date de fin *</Label>
                  <Input
                    id="period_end"
                    type="date"
                    required
                    value={formData.period_end}
                    onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Le rapport sera généré automatiquement avec les revenus et dépenses de la période sélectionnée.
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-accent text-primary hover:bg-accent/90"
                  disabled={generating}
                >
                  {generating ? "Génération..." : "Générer le rapport"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog détails */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du rapport</DialogTitle>
              <DialogDescription className="capitalize">
                {selectedReport?.report_type} •{" "}
                {selectedReport?.owners?.first_name} {selectedReport?.owners?.last_name}
              </DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Période</p>
                    <p className="font-medium">
                      Du {new Date(selectedReport.period_start).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="font-medium">
                      Au {new Date(selectedReport.period_end).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Généré le</p>
                    <p className="font-medium">
                      {new Date(selectedReport.generated_at || "").toLocaleDateString("fr-FR")}
                    </p>
                    {selectedReport.sent_at && (
                      <>
                        <p className="text-xs text-muted-foreground mt-2 mb-1">Envoyé le</p>
                        <p className="font-medium text-green-600">
                          {new Date(selectedReport.sent_at).toLocaleDateString("fr-FR")}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Revenus totaux</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      {(selectedReport.total_revenue || 0).toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="font-medium">Dépenses totales</span>
                    </div>
                    <span className="text-xl font-bold text-red-600">
                      {(selectedReport.total_expenses || 0).toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border-2 border-primary">
                    <span className="font-bold text-lg">Revenu net</span>
                    <span className="text-2xl font-bold text-primary">
                      {(selectedReport.net_income || 0).toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PDF
                  </Button>

                  {!selectedReport.sent_at && (
                    <Button
                      className="flex-1 bg-accent text-primary hover:bg-accent/90"
                      onClick={() => sendReport(selectedReport.id)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Marquer comme envoyé
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}