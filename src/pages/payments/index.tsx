import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getPayments } from "@/services/paymentsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, CreditCard, Plus, Search, Calendar, FileText, DollarSign } from "lucide-react";

export default function PaymentsPage() {
  const router = useRouter();
  const { user, profile, agency, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (agency?.id) {
      loadPayments();
    }
  }, [agency?.id]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = payments.filter(
        (p) =>
          p.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.properties?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments);
    }
  }, [searchTerm, payments]);

  async function loadPayments() {
    if (!agency?.id) return;
    try {
      const data = await getPayments(agency.id);
      setPayments(data ?? []);
      setFilteredPayments(data ?? []);
    } catch (error) {
      console.error("Error loading payments:", error);
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

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const getPaymentMethodVariant = (method: string) => {
    const variants: Record<string, "available" | "premium" | "default"> = {
      mobile_money: "premium",
      carte_bancaire: "available",
      virement: "available",
      cheque: "default",
      especes: "default",
    };
    return variants[method] || "default";
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
                <h1 className="text-3xl font-serif font-bold">Encaissements & Paiements</h1>
                <p className="text-sm text-primary-foreground/80">{agency.name}</p>
              </div>
            </div>
            <Link href="/payments/new">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Paiement
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-accent" />
              Total Encaissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent tabular-nums">
              {totalAmount.toLocaleString()} €
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredPayments.length} transaction(s) affichée(s)
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par méthode, référence ou bien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun paiement trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Aucun paiement ne correspond à votre recherche."
                  : "Commencez par enregistrer un paiement."}
              </p>
              {!searchTerm && (
                <Link href="/payments/new">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Enregistrer un paiement
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card
                key={payment.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/payments/${payment.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-lg">
                        {payment.properties?.title || "Bien non spécifié"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="text-2xl font-bold text-accent tabular-nums">
                        {payment.amount.toLocaleString()} €
                      </div>
                      <StatusBadge variant={getPaymentMethodVariant(payment.payment_method)}>
                        {payment.payment_method.replace("_", " ")}
                      </StatusBadge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {payment.reference && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Référence :</span>
                      <span className="font-medium font-mono">{payment.reference}</span>
                    </div>
                  )}
                  {payment.notes && (
                    <p className="text-sm text-muted-foreground italic">{payment.notes}</p>
                  )}
                  {payment.proof_url && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Justificatif disponible
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