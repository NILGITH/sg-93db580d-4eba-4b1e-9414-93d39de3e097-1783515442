import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, DollarSign, Plus, Search, Calendar, CheckCircle2, XCircle, Receipt, Upload, Image } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { FileUpload } from "@/components/FileUpload";
import { KkiapayButton } from "@/components/KkiapayButton";
import { Separator } from "@/components/ui/separator";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentWithDetails = Payment & {
  properties?: { reference: string; title: string; address: string } | null;
  tenants?: { first_name: string; last_name: string; phone: string } | null;
  owners?: { first_name: string; last_name: string; phone: string } | null;
};

type PaymentType = Database["public"]["Enums"]["payment_type"];
type PaymentMethod = Database["public"]["Enums"]["payment_method"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];

const PAYMENT_TYPES: PaymentType[] = ["loyer", "acompte", "reservation", "caution", "frais"];
const PAYMENT_METHODS: PaymentMethod[] = ["especes", "mobile_money", "carte", "cheque", "virement"];

export default function PaymentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValidated, setFilterValidated] = useState<"all" | "validated" | "pending">("all");
  const [filterType, setFilterType] = useState<PaymentType | "all">("all");

  const [formData, setFormData] = useState<Partial<PaymentInsert>>({
    property_id: "",
    tenant_id: "",
    owner_id: "",
    payment_type: "loyer",
    payment_method: "especes",
    amount: 0,
    payment_date: new Date().toISOString().split("T")[0],
    description: "",
    receipt_url: "",
    is_validated: false,
  });

  const [uploadedReceipt, setUploadedReceipt] = useState<string>("");
  const [showKkiapayOption, setShowKkiapayOption] = useState(false);

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
      
      const [paymentsRes, propertiesRes, tenantsRes, ownersRes] = await Promise.all([
        supabase
          .from("payments")
          .select("*, properties(reference, title, address), tenants(first_name, last_name, phone), owners(first_name, last_name, phone)")
          .order("payment_date", { ascending: false }),
        supabase.from("properties").select("id, reference, title, address"),
        supabase.from("tenants").select("id, first_name, last_name, phone"),
        supabase.from("owners").select("id, first_name, last_name, phone"),
      ]);

      if (paymentsRes.error) throw paymentsRes.error;
      if (propertiesRes.error) throw propertiesRes.error;
      if (tenantsRes.error) throw tenantsRes.error;
      if (ownersRes.error) throw ownersRes.error;

      setPayments(paymentsRes.data || []);
      setProperties(propertiesRes.data || []);
      setTenants(tenantsRes.data || []);
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

  async function createPayment(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from("payments").insert({
        property_id: formData.property_id,
        tenant_id: formData.tenant_id || null,
        owner_id: formData.owner_id || null,
        payment_type: formData.payment_type as PaymentType,
        payment_method: formData.payment_method as PaymentMethod,
        amount: formData.amount,
        payment_date: formData.payment_date,
        description: formData.description,
        receipt_url: uploadedReceipt,
        is_validated: false,
      });

      if (error) throw error;

      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès",
      });

      setShowCreateDialog(false);
      setFormData({
        property_id: "",
        tenant_id: "",
        owner_id: "",
        payment_type: "loyer",
        payment_method: "especes",
        amount: 0,
        payment_date: new Date().toISOString().split("T")[0],
        description: "",
        receipt_url: "",
        is_validated: false,
      });
      setUploadedReceipt("");
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive",
      });
    }
  }

  function handleKkiapaySuccess(result: KkiapayPaymentResult) {
    toast({
      title: "Paiement réussi",
      description: `Transaction ${result.transactionId} confirmée`,
    });
    // Le paiement sera enregistré automatiquement via webhook
    setShowCreateDialog(false);
    loadData();
  }

  async function validatePayment(id: string) {
    try {
      const { error } = await supabase
        .from("payments")
        .update({ is_validated: true })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Paiement validé",
        description: "Le paiement a été validé avec succès",
      });

      loadData();
      setShowDetailDialog(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le paiement",
        variant: "destructive",
      });
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesValidated = 
      filterValidated === "all" || 
      (filterValidated === "validated" && payment.is_validated) || 
      (filterValidated === "pending" && !payment.is_validated);
    
    const matchesType = filterType === "all" || payment.payment_type === filterType;
    
    const matchesSearch = !searchQuery || 
      payment.properties?.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.properties?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.tenants?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.tenants?.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesValidated && matchesType && matchesSearch;
  });

  const totalRevenue = payments.filter(p => p.is_validated).reduce((sum, p) => sum + (p.amount || 0), 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyRevenue = payments
    .filter(p => p.is_validated && p.payment_date.startsWith(thisMonth) && p.payment_type === "loyer")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const unpaidCount = payments.filter(p => !p.is_validated).length;

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
                <h1 className="text-3xl font-serif font-bold">Gestion des Paiements</h1>
                <p className="text-sm text-primary-foreground/80">Loyers, acomptes et encaissements</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-accent text-primary hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau paiement
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenus totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {totalRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loyers ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {monthlyRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Non validés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {unpaidCount}
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
                    placeholder="Rechercher (référence bien, locataire)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={(value) => setFilterType(value as PaymentType | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {PAYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterValidated} onValueChange={(value) => setFilterValidated(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="validated">Validés</SelectItem>
                  <SelectItem value="pending">Non validés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des paiements */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun paiement</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{payment.amount.toLocaleString("fr-FR")} €</CardTitle>
                      <CardDescription className="mt-1">
                        {payment.properties?.reference} • {payment.payment_type}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={payment.is_validated ? "default" : "secondary"}
                      className={payment.is_validated ? "bg-green-600" : "bg-amber-600"}
                    >
                      {payment.is_validated ? "Validé" : "En attente"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {payment.tenants && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Locataire :</span> {payment.tenants.first_name} {payment.tenants.last_name}
                    </div>
                  )}

                  {payment.owners && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Propriétaire :</span> {payment.owners.first_name} {payment.owners.last_name}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(payment.payment_date).toLocaleDateString("fr-FR")}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Receipt className="w-4 h-4" />
                    <span className="capitalize">{payment.payment_method.replace("_", " ")}</span>
                  </div>

                  {payment.receipt_url && (
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <Image className="w-4 h-4" />
                      <span>Justificatif joint</span>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedPayment(payment);
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
              <DialogTitle>Nouveau paiement</DialogTitle>
              <DialogDescription>Enregistrer un paiement reçu</DialogDescription>
            </DialogHeader>

            <form onSubmit={createPayment} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property_id">Bien *</Label>
                  <Select
                    value={formData.property_id}
                    onValueChange={(value) => setFormData({ ...formData, property_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un bien" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.reference} - {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_type">Type *</Label>
                  <Select
                    value={formData.payment_type}
                    onValueChange={(value) => setFormData({ ...formData, payment_type: value as PaymentType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenant_id">Locataire (optionnel)</Label>
                  <Select
                    value={formData.tenant_id || ""}
                    onValueChange={(value) => setFormData({ ...formData, tenant_id: value || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Aucun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.first_name} {tenant.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_id">Propriétaire (optionnel)</Label>
                  <Select
                    value={formData.owner_id || ""}
                    onValueChange={(value) => setFormData({ ...formData, owner_id: value || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Aucun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {owners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.first_name} {owner.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (€) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount || 0}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Mode de paiement *</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData({ ...formData, payment_method: value as PaymentMethod })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_date">Date *</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    required
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  />
                </div>

                {(formData.payment_method === "especes" || formData.payment_method === "cheque") && (
                  <div className="space-y-2">
                    <Label>Photo justificatif</Label>
                    <FileUpload
                      bucket="payments"
                      accept="image/*,.pdf"
                      onUploadComplete={(urls) => setUploadedReceipt(urls[0])}
                      existingFiles={uploadedReceipt ? [uploadedReceipt] : []}
                    />
                    <p className="text-xs text-muted-foreground">
                      Photo du reçu ou chèque (recommandé)
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Enregistrer le paiement
                </Button>
                {formData.payment_method === "mobile_money" && (
                  <KkiapayButton
                    amount={formData.amount || 0}
                    reason={`Paiement ${formData.payment_type}`}
                    onSuccess={handleKkiapaySuccess}
                    className="flex-1"
                  >
                    Payer avec Kkiapay
                  </KkiapayButton>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Notes (optionnelles)</Label>
                <Textarea
                  id="description"
                  placeholder="Informations complémentaires..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-accent text-primary hover:bg-accent/90">
                  Enregistrer le paiement
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog détails */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du paiement</DialogTitle>
              <DialogDescription>
                {selectedPayment?.amount.toLocaleString("fr-FR")} € • {selectedPayment?.payment_type}
              </DialogDescription>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bien</p>
                    <p className="font-medium">{selectedPayment.properties?.reference}</p>
                    <p className="text-sm text-muted-foreground">{selectedPayment.properties?.address}</p>
                  </div>

                  {selectedPayment.tenants && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Locataire</p>
                      <p className="font-medium">
                        {selectedPayment.tenants.first_name} {selectedPayment.tenants.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedPayment.tenants.phone}</p>
                    </div>
                  )}

                  {selectedPayment.owners && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Propriétaire</p>
                      <p className="font-medium">
                        {selectedPayment.owners.first_name} {selectedPayment.owners.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedPayment.owners.phone}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="font-medium">
                      {new Date(selectedPayment.payment_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Mode de paiement</p>
                    <p className="font-medium capitalize">
                      {selectedPayment.payment_method.split("_").join(" ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Statut</p>
                    <Badge variant={selectedPayment.is_validated ? "default" : "secondary"}>
                      {selectedPayment.is_validated ? "Validé" : "En attente"}
                    </Badge>
                  </div>
                </div>

                {selectedPayment.description && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedPayment.description}</p>
                    </div>
                  </div>
                )}

                {selectedPayment.receipt_url && (
                  <div>
                    <p className="text-sm font-medium mb-2">Justificatif</p>
                    <img
                      src={selectedPayment.receipt_url}
                      alt="Justificatif de paiement"
                      className="w-full max-w-md rounded-lg border"
                    />
                  </div>
                )}

                {!selectedPayment.is_validated && (
                  <div className="pt-4">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => validatePayment(selectedPayment.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Valider le paiement
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}