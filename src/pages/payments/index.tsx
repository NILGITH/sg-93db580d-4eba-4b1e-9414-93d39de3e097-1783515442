import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { mockPayments, mockProperties } from "@/lib/mock-data";
import { Building2, DollarSign, Search, Calendar, Receipt } from "lucide-react";

export default function PaymentsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();

  const [payments] = useState(mockPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "paid" && payment.status === "paid") ||
      (filterStatus === "pending" && payment.status === "pending");
    
    const matchesSearch = !searchQuery || 
      payment.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === "pending").length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

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
                <h1 className="text-3xl font-serif font-bold">Gestion des Paiements</h1>
                <p className="text-sm text-primary-foreground/80">Loyers et encaissements - {payments.length} paiements</p>
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
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Paiements validés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {payments.filter(p => p.status === "paid").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </p>
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
                    placeholder="Rechercher par locataire..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="paid">Payés</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des paiements */}
        {filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun paiement</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => {
              const property = mockProperties.find(p => p.id === payment.property_id);
              const paymentDate = new Date(payment.payment_date);

              return (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={payment.status === "paid" ? "default" : "secondary"}
                            className={payment.status === "paid" ? "bg-green-600" : "bg-amber-600"}
                          >
                            {payment.status === "paid" ? "Payé" : "En attente"}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-accent text-2xl">
                              {payment.amount.toLocaleString()} FCFA
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Locataire: {payment.tenant_name}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {property && (
                              <div className="text-sm">
                                <p className="font-medium">{property.title}</p>
                                <p className="text-muted-foreground text-xs">
                                  {property.address}, {property.city}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {paymentDate.toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Receipt className="w-4 h-4" />
                              <span className="capitalize">{payment.payment_method.replace("_", " ")}</span>
                            </div>
                          </div>
                        </div>

                        {payment.notes && (
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="text-muted-foreground italic">"{payment.notes}"</p>
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