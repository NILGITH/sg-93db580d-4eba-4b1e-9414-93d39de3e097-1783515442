import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, Search, Phone, Mail, MapPin, MessageSquare, CheckCircle2, XCircle, UserCheck, TrendingUp } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Prospect = Database["public"]["Tables"]["prospects"]["Row"];
type ProspectWithDetails = Prospect & {
  properties?: { reference: string; title: string; address: string; city: string } | null;
};

type ProspectStatus = Database["public"]["Enums"]["prospect_status"];
type DemandType = Database["public"]["Enums"]["demand_type"];

export default function CRMPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [prospects, setProspects] = useState<ProspectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProspectStatus | "all">("all");
  const [filterDemandType, setFilterDemandType] = useState<DemandType | "all">("all");
  const [selectedProspect, setSelectedProspect] = useState<ProspectWithDetails | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      loadProspects();
    }
  }, [user, profile]);

  async function loadProspects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("prospects")
        .select("*, properties(reference, title, address, city)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProspects(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les prospects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProspectStatus(prospectId: string, newStatus: ProspectStatus) {
    try {
      const { error } = await supabase
        .from("prospects")
        .update({ status: newStatus })
        .eq("id", prospectId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Prospect marqué comme ${newStatus}`,
      });

      loadProspects();
      setShowDetailDialog(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  }

  async function addNote(prospectId: string, noteText: string) {
    try {
      const prospect = prospects.find(p => p.id === prospectId);
      if (!prospect) return;

      const existingNotes = prospect.notes || "";
      const timestamp = new Date().toLocaleString("fr-FR");
      const newNoteEntry = `[${timestamp}] ${noteText}`;
      const updatedNotes = existingNotes 
        ? `${existingNotes}\n\n${newNoteEntry}`
        : newNoteEntry;

      const { error } = await supabase
        .from("prospects")
        .update({ notes: updatedNotes })
        .eq("id", prospectId);

      if (error) throw error;

      toast({
        title: "Note ajoutée",
        description: "La note a été enregistrée",
      });

      setNote("");
      loadProspects();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive",
      });
    }
  }

  const filteredProspects = prospects.filter((prospect) => {
    const matchesStatus = filterStatus === "all" || prospect.status === filterStatus;
    const matchesDemandType = filterDemandType === "all" || prospect.demand_type === filterDemandType;
    const matchesSearch = !searchQuery || 
      prospect.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.properties?.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesDemandType && matchesSearch;
  });

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!["admin", "agent", "secretary"].includes(profile.role)) {
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
                <h1 className="text-3xl font-serif font-bold">Gestion Prospects (CRM)</h1>
                <p className="text-sm text-primary-foreground/80">Suivi et qualification des prospects</p>
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
        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher (nom, email, téléphone, référence bien)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ProspectStatus | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="contacte">Contacté</SelectItem>
                  <SelectItem value="qualifie">Qualifié</SelectItem>
                  <SelectItem value="converti">Converti</SelectItem>
                  <SelectItem value="perdu">Perdu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDemandType} onValueChange={(value) => setFilterDemandType(value as DemandType | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Type demande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="visite">Visite</SelectItem>
                  <SelectItem value="information">Information</SelectItem>
                  <SelectItem value="reservation">Réservation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nouveaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {prospects.filter(p => p.status === "nouveau").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contactés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {prospects.filter(p => p.status === "contacte").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Qualifiés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {prospects.filter(p => p.status === "qualifie").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Convertis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {prospects.filter(p => p.status === "converti").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Perdus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {prospects.filter(p => p.status === "perdu").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des prospects */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredProspects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun prospect</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProspects.map((prospect) => {
              const createdDate = new Date(prospect.created_at);
              const isRecent = (Date.now() - createdDate.getTime()) < 24 * 60 * 60 * 1000; // Moins de 24h

              return (
                <Card key={prospect.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={
                              prospect.status === "nouveau" ? "default" : 
                              prospect.status === "contacte" ? "secondary" : 
                              prospect.status === "qualifie" ? "outline" :
                              prospect.status === "converti" ? "default" :
                              "destructive"
                            }
                            className={
                              prospect.status === "nouveau" ? "bg-blue-600" :
                              prospect.status === "qualifie" ? "border-purple-600 text-purple-600" :
                              prospect.status === "converti" ? "bg-green-600" : ""
                            }
                          >
                            {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
                          </Badge>

                          <Badge variant="outline">
                            {prospect.demand_type === "visite" ? "Demande de visite" :
                             prospect.demand_type === "information" ? "Demande d'info" : "Réservation"}
                          </Badge>

                          {isRecent && (
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              Nouveau (24h)
                            </Badge>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{prospect.first_name} {prospect.last_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              {prospect.phone || "Non renseigné"}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              {prospect.email}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {prospect.properties && (
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">{prospect.properties.title}</p>
                                  <p className="text-muted-foreground text-xs">
                                    {prospect.properties.reference} • {prospect.properties.city}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm">
                              <p className="text-muted-foreground text-xs">
                                Créé le {createdDate.toLocaleDateString("fr-FR")} à {createdDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {prospect.message && (
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="text-muted-foreground italic">"{prospect.message}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProspect(prospect);
                            setShowDetailDialog(true);
                          }}
                        >
                          Détails
                        </Button>

                        {prospect.status === "nouveau" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700"
                              onClick={() => updateProspectStatus(prospect.id, "contacte")}
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Contacté
                            </Button>
                          </>
                        )}

                        {prospect.status === "contacte" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => updateProspectStatus(prospect.id, "qualifie")}
                            >
                              <UserCheck className="w-3 h-3 mr-1" />
                              Qualifié
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateProspectStatus(prospect.id, "perdu")}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Perdu
                            </Button>
                          </>
                        )}

                        {prospect.status === "qualifie" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateProspectStatus(prospect.id, "converti")}
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Converti
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateProspectStatus(prospect.id, "perdu")}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Perdu
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dialog détails */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du prospect</DialogTitle>
              <DialogDescription>
                {selectedProspect?.first_name} {selectedProspect?.last_name}
              </DialogDescription>
            </DialogHeader>

            {selectedProspect && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contact</p>
                    <p className="font-medium">{selectedProspect.first_name} {selectedProspect.last_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProspect.phone || "Non renseigné"}</p>
                    <p className="text-sm text-muted-foreground">{selectedProspect.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Demande</p>
                    <p className="font-medium capitalize">{selectedProspect.demand_type}</p>
                    <p className="text-sm text-muted-foreground">
                      Créé le {new Date(selectedProspect.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {selectedProspect.properties && (
                  <div>
                    <p className="text-sm font-medium mb-1">Bien concerné</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium">{selectedProspect.properties.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProspect.properties.reference} • {selectedProspect.properties.city}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedProspect.properties.address}</p>
                    </div>
                  </div>
                )}

                {selectedProspect.message && (
                  <div>
                    <p className="text-sm font-medium mb-1">Message du prospect</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedProspect.message}</p>
                    </div>
                  </div>
                )}

                {selectedProspect.notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Historique des notes</p>
                    <div className="bg-muted/50 p-3 rounded-lg max-h-40 overflow-y-auto">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedProspect.notes}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newNote">Ajouter une note</Label>
                  <Textarea
                    id="newNote"
                    placeholder="Note interne (échange téléphonique, rendez-vous, etc.)..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={() => {
                      if (note.trim()) {
                        addNote(selectedProspect.id, note);
                      }
                    }}
                    disabled={!note.trim()}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enregistrer la note
                  </Button>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedProspect.status === "nouveau" && (
                    <Button
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                      onClick={() => updateProspectStatus(selectedProspect.id, "contacte")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Marquer contacté
                    </Button>
                  )}

                  {selectedProspect.status === "contacte" && (
                    <>
                      <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => updateProspectStatus(selectedProspect.id, "qualifie")}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Marquer qualifié
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => updateProspectStatus(selectedProspect.id, "perdu")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Marquer perdu
                      </Button>
                    </>
                  )}

                  {selectedProspect.status === "qualifie" && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateProspectStatus(selectedProspect.id, "converti")}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Marquer converti
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => updateProspectStatus(selectedProspect.id, "perdu")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Marquer perdu
                      </Button>
                    </>
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