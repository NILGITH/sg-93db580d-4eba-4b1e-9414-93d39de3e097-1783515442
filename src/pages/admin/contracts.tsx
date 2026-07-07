import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Download,
  Upload,
  Calendar
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { FileUpload } from "@/components/FileUpload";
import { generateContractPDF } from "@/lib/pdf";

type Contract = Database["public"]["Tables"]["contracts"]["Row"] & {
  properties?: { reference: string; title: string } | null;
  owners?: { first_name: string; last_name: string } | null;
  tenants?: { first_name: string; last_name: string } | null;
};
type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"];
type ContractType = Database["public"]["Enums"]["contract_type"];
type ContractStatus = Database["public"]["Enums"]["contract_status"];

const CONTRACT_TYPES: ContractType[] = ["location", "vente", "gestion"];
const CONTRACT_STATUS: ContractStatus[] = ["brouillon", "en_cours", "termine", "resilie"];

export default function ContractsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContractType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ContractStatus | "all">("all");
  const [uploadedContract, setUploadedContract] = useState<string>("");

  const [formData, setFormData] = useState<Partial<ContractInsert>>({
    property_id: "",
    owner_id: "",
    tenant_id: "",
    contract_type: "location",
    reference: "",
    start_date: "",
    end_date: "",
    amount: 0,
    deposit_amount: 0,
    terms: "",
    clauses: "",
    status: "brouillon",
    file_url: "",
    signed_by_owner: false,
    signed_by_tenant: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      if (!["admin", "agent", "secretary"].includes(profile.role)) {
        router.push("/dashboard");
        return;
      }
      loadData();
    }
  }, [user, profile]);

  async function loadData() {
    try {
      setLoading(true);

      const [contractsRes, propertiesRes, ownersRes, tenantsRes] = await Promise.all([
        supabase
          .from("contracts")
          .select("*, properties(reference, title), owners(first_name, last_name), tenants(first_name, last_name)")
          .order("created_at", { ascending: false }),
        supabase.from("properties").select("id, reference, title").order("reference"),
        supabase.from("owners").select("id, first_name, last_name").order("last_name"),
        supabase.from("tenants").select("id, first_name, last_name").order("last_name"),
      ]);

      setContracts(contractsRes.data || []);
      setProperties(propertiesRes.data || []);
      setOwners(ownersRes.data || []);
      setTenants(tenantsRes.data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contrats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingContract(null);
    setFormData({
      property_id: "",
      owner_id: "",
      tenant_id: "",
      contract_type: "location",
      reference: "",
      start_date: "",
      end_date: "",
      amount: 0,
      deposit_amount: 0,
      terms: "",
      clauses: "",
      status: "brouillon",
      file_url: "",
      signed_by_owner: false,
      signed_by_tenant: false,
    });
    setShowDialog(true);
  }

  function openEditDialog(contract: Contract) {
    setEditingContract(contract);
    setFormData({
      property_id: contract.property_id,
      owner_id: contract.owner_id,
      tenant_id: contract.tenant_id,
      contract_type: contract.contract_type,
      reference: contract.reference,
      start_date: contract.start_date,
      end_date: contract.end_date || "",
      amount: contract.amount,
      deposit_amount: contract.deposit_amount || 0,
      terms: contract.terms || "",
      clauses: contract.clauses || "",
      status: contract.status,
      file_url: contract.file_url || "",
      signed_by_owner: contract.signed_by_owner,
      signed_by_tenant: contract.signed_by_tenant,
    });
    setShowDialog(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingContract) {
        const { error } = await supabase
          .from("contracts")
          .update({
            property_id: formData.property_id,
            owner_id: formData.owner_id,
            tenant_id: formData.tenant_id,
            contract_type: formData.contract_type,
            reference: formData.reference,
            start_date: formData.start_date,
            end_date: formData.end_date,
            amount: formData.amount,
            deposit_amount: formData.deposit_amount,
            terms: formData.terms,
            clauses: formData.clauses,
            file_url: uploadedContract || editingContract.file_url,
            signed_by_owner: formData.signed_by_owner,
            signed_by_tenant: formData.signed_by_tenant,
            status: formData.status,
          })
          .eq("id", editingContract.id);

        if (error) throw error;

        toast({
          title: "Contrat modifié",
          description: "Le contrat a été modifié avec succès",
        });
      } else {
        const { error } = await supabase.from("contracts").insert({
          property_id: formData.property_id,
          owner_id: formData.owner_id,
          tenant_id: formData.tenant_id,
          contract_type: formData.contract_type || "location",
          reference: formData.reference,
          start_date: formData.start_date,
          end_date: formData.end_date,
          amount: formData.amount || 0,
          deposit_amount: formData.deposit_amount || 0,
          terms: formData.terms,
          clauses: formData.clauses,
          file_url: uploadedContract,
          signed_by_owner: false,
          signed_by_tenant: false,
          status: "brouillon",
        });

        if (error) throw error;

        toast({
          title: "Contrat créé",
          description: "Le contrat a été créé avec succès",
        });
      }

      setShowDialog(false);
      setUploadedContract("");
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contrat",
        variant: "destructive",
      });
    }
  }

  async function downloadContractPDF(contract: Contract) {
    try {
      const pdf = generateContractPDF({
        contractNumber: contract.reference,
        contractType: contract.contract_type,
        date: new Date().toLocaleDateString("fr-FR"),
        propertyRef: contract.properties?.reference || "",
        propertyTitle: contract.properties?.title || "",
        ownerName: contract.owners ? `${contract.owners.first_name} ${contract.owners.last_name}` : "",
        tenantName: contract.tenants ? `${contract.tenants.first_name} ${contract.tenants.last_name}` : "",
        startDate: new Date(contract.start_date).toLocaleDateString("fr-FR"),
        endDate: contract.end_date ? new Date(contract.end_date).toLocaleDateString("fr-FR") : "",
        monthlyRent: contract.amount,
        deposit: contract.deposit_amount || 0,
        terms: contract.terms || "",
      });

      pdf.save(`Contrat_${contract.reference}.pdf`);

      toast({
        title: "PDF téléchargé",
        description: "Le contrat a été téléchargé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive",
      });
    }
  }

  async function deleteContract(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) return;

    try {
      const { error } = await supabase.from("contracts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Contrat supprimé",
        description: "Le contrat a été supprimé avec succès",
      });

      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contrat",
        variant: "destructive",
      });
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesType = filterType === "all" || contract.contract_type === filterType;
    const matchesStatus = filterStatus === "all" || contract.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      contract.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.properties?.reference.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const stats = {
    total: contracts.length,
    brouillon: contracts.filter((c) => c.status === "brouillon").length,
    en_cours: contracts.filter((c) => c.status === "en_cours").length,
    termine: contracts.filter((c) => c.status === "termine").length,
    resilie: contracts.filter((c) => c.status === "resilie").length,
  };

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Gestion des Contrats</h1>
                <p className="text-sm text-primary-foreground/80">Location, Vente, Gestion</p>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
              Retour Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des contrats...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Brouillon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-600">{stats.brouillon}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">{stats.en_cours}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Terminés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">{stats.termine}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Résiliés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">{stats.resilie}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tous les Contrats</CardTitle>
                    <CardDescription>{filteredContracts.length} contrat(s)</CardDescription>
                  </div>
                  <Button onClick={openCreateDialog} className="bg-accent hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Contrat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par référence..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={(value) => setFilterType(value as ContractType | "all")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {CONTRACT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ContractStatus | "all")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {CONTRACT_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filteredContracts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun contrat trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredContracts.map((contract) => (
                      <Card key={contract.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <h3 className="font-semibold text-lg">
                                  Contrat {contract.reference}
                                </h3>
                                <Badge variant={contract.status === "en_cours" ? "default" : contract.status === "termine" ? "outline" : "secondary"}>
                                  {contract.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {contract.contract_type}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Bien</p>
                                  <p className="font-medium">{contract.properties?.reference}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Montant</p>
                                  <p className="font-medium">{contract.amount.toLocaleString()} FCFA</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Dates</p>
                                  <p className="font-medium">
                                    {new Date(contract.start_date).toLocaleDateString("fr-FR")}
                                    {contract.end_date && ` → ${new Date(contract.end_date).toLocaleDateString("fr-FR")}`}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Signatures</p>
                                  <div className="flex gap-2">
                                    {contract.signed_by_owner && <Badge variant="outline" className="text-xs">Propriétaire ✓</Badge>}
                                    {contract.signed_by_tenant && <Badge variant="outline" className="text-xs">Locataire ✓</Badge>}
                                    {!contract.signed_by_owner && !contract.signed_by_tenant && <span className="text-xs text-muted-foreground">En attente</span>}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowDetailDialog(true);
                                }}
                              >
                                Détails
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadContractPDF(contract)}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                PDF
                              </Button>
                              {contract.file_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(contract.file_url || "", "_blank")}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Signé
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteContract(contract.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingContract ? "Modifier le contrat" : "Nouveau contrat"}</DialogTitle>
            <DialogDescription>
              {editingContract ? "Modifiez les informations du contrat" : "Créez un nouveau contrat"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Référence *</Label>
                <Input
                  id="reference"
                  required
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="CONT-2026-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_type">Type *</Label>
                <Select
                  value={formData.contract_type}
                  onValueChange={(value) => setFormData({ ...formData, contract_type: value as ContractType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ContractStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_id">Propriétaire</Label>
                <Select
                  value={formData.owner_id || ""}
                  onValueChange={(value) => setFormData({ ...formData, owner_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
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
                <Label htmlFor="tenant_id">Locataire</Label>
                <Select
                  value={formData.tenant_id || ""}
                  onValueChange={(value) => setFormData({ ...formData, tenant_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
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
                <Label htmlFor="start_date">Date de début *</Label>
                <Input
                  id="start_date"
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date || ""}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Montant *</Label>
                <Input
                  id="amount"
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit_amount">Dépôt de garantie</Label>
                <Input
                  id="deposit_amount"
                  type="number"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Conditions du contrat</Label>
              <Textarea
                id="terms"
                placeholder="Conditions générales..."
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clauses">Clauses particulières</Label>
              <Textarea
                id="clauses"
                placeholder="Clauses spécifiques..."
                value={formData.clauses}
                onChange={(e) => setFormData({ ...formData, clauses: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_url">Fichier PDF signé (URL)</Label>
              <Input
                id="file_url"
                type="url"
                placeholder="https://..."
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="signed_owner"
                  checked={formData.signed_by_owner}
                  onCheckedChange={(checked) => setFormData({ ...formData, signed_by_owner: checked })}
                />
                <Label htmlFor="signed_owner">Signé par le propriétaire</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="signed_tenant"
                  checked={formData.signed_by_tenant}
                  onCheckedChange={(checked) => setFormData({ ...formData, signed_by_tenant: checked })}
                />
                <Label htmlFor="signed_tenant">Signé par le locataire</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fichier contrat signé (optionnel)</Label>
              <FileUpload
                bucket="contracts"
                accept=".pdf"
                onUploadComplete={(urls) => setUploadedContract(urls[0])}
                existingFiles={uploadedContract ? [uploadedContract] : editingContract?.file_url ? [editingContract.file_url] : []}
              />
              <p className="text-xs text-muted-foreground">
                PDF du contrat signé (max 10MB)
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90">
                {editingContract ? "Modifier" : "Créer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du contrat</DialogTitle>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Référence</p>
                  <p className="text-sm text-muted-foreground">{selectedContract.reference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Type</p>
                  <Badge className="capitalize">{selectedContract.contract_type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Statut</p>
                  <Badge variant={selectedContract.status === "en_cours" ? "default" : "secondary"}>
                    {selectedContract.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Bien</p>
                  <p className="text-sm text-muted-foreground">{selectedContract.properties?.reference}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Montant total</p>
                <p className="text-2xl font-bold text-accent">{selectedContract.amount.toLocaleString()} FCFA</p>
              </div>

              {selectedContract.deposit_amount && selectedContract.deposit_amount > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Dépôt de garantie</p>
                  <p className="text-lg font-semibold">{selectedContract.deposit_amount.toLocaleString()} FCFA</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Date de début</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedContract.start_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                {selectedContract.end_date && (
                  <div>
                    <p className="text-sm font-medium mb-1">Date de fin</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedContract.end_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>

              {selectedContract.terms && (
                <div>
                  <p className="text-sm font-medium mb-1">Conditions</p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedContract.terms}</p>
                  </div>
                </div>
              )}

              {selectedContract.clauses && (
                <div>
                  <p className="text-sm font-medium mb-1">Clauses particulières</p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedContract.clauses}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Signatures</p>
                <div className="flex gap-3">
                  {selectedContract.signed_by_owner ? (
                    <Badge variant="default">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Propriétaire
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="w-3 h-3 mr-1" />
                      Propriétaire
                    </Badge>
                  )}
                  {selectedContract.signed_by_tenant ? (
                    <Badge variant="default">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Locataire
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="w-3 h-3 mr-1" />
                      Locataire
                    </Badge>
                  )}
                </div>
              </div>

              {selectedContract.file_url && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(selectedContract.file_url!, "_blank")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le PDF
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}