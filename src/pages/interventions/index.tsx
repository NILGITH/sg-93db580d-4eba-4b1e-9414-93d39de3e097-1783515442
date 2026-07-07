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
import { Building2, Wrench, Plus, Search, Calendar, CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { FileUpload } from "@/components/FileUpload";

type Intervention = Database["public"]["Tables"]["interventions"]["Row"];
type InterventionWithDetails = Intervention & {
  properties?: { reference: string; title: string; address: string } | null;
  providers?: { company_name: string; phone: string } | null;
};

type InterventionType = Database["public"]["Enums"]["intervention_type"];
type InterventionStatus = Database["public"]["Enums"]["intervention_status"];
type InterventionInsert = Database["public"]["Tables"]["interventions"]["Insert"];

const INTERVENTION_TYPES: InterventionType[] = ["plomberie", "peinture", "climatisation", "maconnerie", "nettoyage", "electricite", "autre"];

export default function InterventionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [interventions, setInterventions] = useState<InterventionWithDetails[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InterventionStatus | "all">("all");

  const [formData, setFormData] = useState<Partial<InterventionInsert>>({
    property_id: "",
    provider_id: "",
    title: "",
    intervention_type: "plomberie",
    description: "",
    scheduled_date: "",
    estimated_cost: 0,
    status: "planifiee",
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
      
      const [interventionsRes, propertiesRes, providersRes] = await Promise.all([
        supabase
          .from("interventions")
          .select("*, properties(reference, title, address), providers(company_name, phone)")
          .order("scheduled_date", { ascending: false }),
        supabase.from("properties").select("id, reference, title, address").eq("published", true),
        supabase.from("providers").select("id, company_name, phone, specialty"),
      ]);

      if (interventionsRes.error) throw interventionsRes.error;
      if (propertiesRes.error) throw propertiesRes.error;
      if (providersRes.error) throw providersRes.error;

      setInterventions(interventionsRes.data || []);
      setProperties(propertiesRes.data || []);
      setProviders(providersRes.data || []);
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

  async function createIntervention(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from("interventions").insert({
        property_id: formData.property_id,
        provider_id: formData.provider_id,
        title: formData.title,
        intervention_type: formData.intervention_type as InterventionType,
        description: formData.description,
        scheduled_date: formData.scheduled_date,
        estimated_cost: formData.estimated_cost || 0,
        status: "planifiee",
      });

      if (error) throw error;

      toast({
        title: "Intervention créée",
        description: "L'intervention a été créée avec succès",
      });

      setShowCreateDialog(false);
      setFormData({
        property_id: "",
        provider_id: "",
        title: "",
        intervention_type: "plomberie",
        description: "",
        scheduled_date: "",
        estimated_cost: 0,
        status: "planifiee",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'intervention",
        variant: "destructive",
      });
    }
  }

  async function updateInterventionStatus(id: string, newStatus: InterventionStatus) {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === "validee") {
        updates.completed_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from("interventions")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Intervention ${newStatus}`,
      });

      loadData();
      setShowDetailDialog(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  }

  const filteredInterventions = interventions.filter((intervention) => {
    const matchesStatus = filterStatus === "all" || intervention.status === filterStatus;
    const matchesSearch = !searchQuery || 
      intervention.properties?.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intervention.properties?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intervention.providers?.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!["admin", "agent"].includes(profile.role)) {
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
                <h1 className="text-3xl font-serif font-bold">Gestion des Interventions</h1>
                <p className="text-sm text-primary-foreground/80">Suivi des travaux et maintenances</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-accent text-primary hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle intervention
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
        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher (référence bien, adresse, prestataire)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as InterventionStatus | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="planifiee">Planifiée</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                  <SelectItem value="validee">Validée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Planifiées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {interventions.filter(i => i.status === "planifiee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {interventions.filter(i => i.status === "en_cours").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {interventions.filter(i => i.status === "terminee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Validées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {interventions.filter(i => i.status === "validee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Coût total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">
                {interventions
                  .filter(i => i.status === "validee")
                  .reduce((sum, i) => sum + (i.actual_cost || i.estimated_cost || 0), 0)
                  .toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des interventions */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredInterventions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune intervention</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInterventions.map((intervention) => (
              <Card key={intervention.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg capitalize">{intervention.intervention_type}</CardTitle>
                      <CardDescription className="mt-1">
                        {intervention.properties?.reference} • {intervention.properties?.address}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={
                        intervention.status === "validee" ? "default" : 
                        intervention.status === "terminee" ? "outline" : 
                        intervention.status === "en_cours" ? "secondary" :
                        intervention.status === "annulee" ? "destructive" : "default"
                      }
                      className={
                        intervention.status === "validee" ? "bg-green-600" :
                        intervention.status === "planifiee" ? "bg-blue-600" :
                        intervention.status === "en_cours" ? "bg-amber-600" : ""
                      }
                    >
                      {intervention.status === "planifiee" ? "Planifiée" :
                       intervention.status === "en_cours" ? "En cours" :
                       intervention.status === "terminee" ? "Terminée" :
                       intervention.status === "validee" ? "Validée" : "Annulée"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wrench className="w-4 h-4" />
                    <span>{intervention.providers?.company_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(intervention.scheduled_date).toLocaleDateString("fr-FR")}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {intervention.actual_cost 
                        ? `${intervention.actual_cost} € (réel)`
                        : `${intervention.estimated_cost || 0} € (estimé)`}
                    </span>
                  </div>

                  {intervention.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {intervention.description}
                    </p>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedIntervention(intervention);
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
              <DialogTitle>Nouvelle intervention</DialogTitle>
              <DialogDescription>Créer une demande d'intervention pour un bien</DialogDescription>
            </DialogHeader>

            <form onSubmit={createIntervention} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Réparation fuite salle de bain"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intervention_type">Type *</Label>
                  <Select
                    value={formData.intervention_type}
                    onValueChange={(value) => setFormData({ ...formData, intervention_type: value as InterventionType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVENTION_TYPES.map((type) => (
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
                  <Label htmlFor="provider_id">Prestataire *</Label>
                  <Select
                    value={formData.provider_id}
                    onValueChange={(value) => setFormData({ ...formData, provider_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un prestataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.company_name} ({provider.specialty})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Date prévue *</Label>
                  <Input
                    id="scheduled_date"
                    type="date"
                    required
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Coût estimé (€)</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost || 0}
                    onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez l'intervention à réaliser..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-accent text-primary hover:bg-accent/90">
                  Créer l'intervention
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog détails */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'intervention</DialogTitle>
              <DialogDescription>
                {selectedIntervention?.intervention_type.charAt(0).toUpperCase() + selectedIntervention?.intervention_type.slice(1)}
              </DialogDescription>
            </DialogHeader>

            {selectedIntervention && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bien</p>
                    <p className="font-medium">{selectedIntervention.properties?.reference}</p>
                    <p className="text-sm text-muted-foreground">{selectedIntervention.properties?.address}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prestataire</p>
                    <p className="font-medium">{selectedIntervention.providers?.company_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedIntervention.providers?.phone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date prévue</p>
                    <p className="font-medium">
                      {new Date(selectedIntervention.scheduled_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Coût</p>
                    <p className="font-medium">
                      {selectedIntervention.actual_cost 
                        ? `${selectedIntervention.actual_cost} € (réel)`
                        : `${selectedIntervention.estimated_cost || 0} € (estimé)`}
                    </p>
                  </div>
                </div>

                {selectedIntervention.description && (
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedIntervention.description}</p>
                    </div>
                  </div>
                )}

                {selectedIntervention.status === "terminee" && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium mb-2">Photos avant intervention</p>
                      {selectedIntervention.photos_before && Array.isArray(selectedIntervention.photos_before) && selectedIntervention.photos_before.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {(selectedIntervention.photos_before as string[]).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Avant ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucune photo avant</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Photos après intervention</p>
                      {selectedIntervention.photos_after && Array.isArray(selectedIntervention.photos_after) && selectedIntervention.photos_after.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {(selectedIntervention.photos_after as string[]).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Après ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucune photo après</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedIntervention.provider_comment && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes du prestataire</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedIntervention.provider_comment}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedIntervention.status === "planifiee" && (
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={() => updateInterventionStatus(selectedIntervention.id, "annulee")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  )}

                  {selectedIntervention.status === "terminee" && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updateInterventionStatus(selectedIntervention.id, "validee")}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Valider
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