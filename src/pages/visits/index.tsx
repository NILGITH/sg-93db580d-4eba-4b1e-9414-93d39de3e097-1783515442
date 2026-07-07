import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Calendar, Search, MapPin, User, Phone, Mail, Clock, CheckCircle2, XCircle, CalendarX } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Visit = Database["public"]["Tables"]["visits"]["Row"];
type VisitWithDetails = Visit & {
  properties?: { reference: string; title: string; address: string; city: string } | null;
  prospects?: { first_name: string; last_name: string; phone: string; email: string } | null;
};

type VisitStatus = Database["public"]["Enums"]["visit_status"];

export default function VisitsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [visits, setVisits] = useState<VisitWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<VisitStatus | "all">("all");
  const [selectedVisit, setSelectedVisit] = useState<VisitWithDetails | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      loadVisits();
    }
  }, [user, profile]);

  async function loadVisits() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("visits")
        .select("*, properties(reference, title, address, city), prospects(first_name, last_name, phone, email)")
        .order("preferred_date", { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de visite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateVisitStatus(visitId: string, newStatus: VisitStatus, note?: string) {
    try {
      const { error } = await supabase
        .from("visits")
        .update({ 
          status: newStatus,
          agent_notes: note || null
        })
        .eq("id", visitId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Demande de visite ${newStatus === "confirmee" ? "confirmée" : newStatus === "annulee" ? "annulée" : "reportée"}`,
      });

      loadVisits();
      setShowDetailDialog(false);
      setActionNote("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  }

  const filteredVisits = visits.filter((visit) => {
    const matchesStatus = filterStatus === "all" || visit.status === filterStatus;
    const matchesSearch = !searchQuery || 
      visit.visitor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.visitor_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.properties?.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
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
                <h1 className="text-3xl font-serif font-bold">Demandes de Visite</h1>
                <p className="text-sm text-primary-foreground/80">Gestion des demandes</p>
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
                    placeholder="Rechercher (nom, email, référence bien)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as VisitStatus | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="confirmee">Confirmée</SelectItem>
                  <SelectItem value="reportee">Reportée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                  <SelectItem value="realisee">Réalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {visits.filter(v => v.status === "en_attente").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {visits.filter(v => v.status === "confirmee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Réalisées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {visits.filter(v => v.status === "realisee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annulées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {visits.filter(v => v.status === "annulee").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des visites */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune demande de visite</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredVisits.map((visit) => (
              <Card key={visit.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            visit.status === "confirmee" ? "default" : 
                            visit.status === "en_attente" ? "secondary" : 
                            visit.status === "realisee" ? "outline" : 
                            "destructive"
                          }
                        >
                          {visit.status === "en_attente" ? "En attente" :
                           visit.status === "confirmee" ? "Confirmée" :
                           visit.status === "reportee" ? "Reportée" :
                           visit.status === "annulee" ? "Annulée" : "Réalisée"}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(visit.preferred_date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{visit.visitor_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {visit.visitor_phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {visit.visitor_email}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">{visit.properties?.title}</p>
                              <p className="text-muted-foreground text-xs">
                                {visit.properties?.reference} • {visit.properties?.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {visit.message && (
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                          <p className="text-muted-foreground italic">{visit.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedVisit(visit);
                          setShowDetailDialog(true);
                        }}
                      >
                        Gérer
                      </Button>

                      {visit.status === "en_attente" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateVisitStatus(visit.id, "confirmee")}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Confirmer
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateVisitStatus(visit.id, "annulee")}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Annuler
                          </Button>
                        </>
                      )}

                      {visit.status === "confirmee" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateVisitStatus(visit.id, "realisee")}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Réalisée
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVisit(visit);
                              setShowDetailDialog(true);
                            }}
                          >
                            <CalendarX className="w-3 h-3 mr-1" />
                            Reporter
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog détails et actions */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la demande de visite</DialogTitle>
              <DialogDescription>
                Gérer la demande de {selectedVisit?.visitor_name}
              </DialogDescription>
            </DialogHeader>

            {selectedVisit && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Visiteur</p>
                    <p className="font-medium">{selectedVisit.visitor_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedVisit.visitor_phone}</p>
                    <p className="text-sm text-muted-foreground">{selectedVisit.visitor_email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bien</p>
                    <p className="font-medium">{selectedVisit.properties?.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedVisit.properties?.reference}</p>
                    <p className="text-sm text-muted-foreground">{selectedVisit.properties?.address}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Date souhaitée</p>
                  <p className="text-muted-foreground">
                    {new Date(selectedVisit.preferred_date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>

                {selectedVisit.message && (
                  <div>
                    <p className="text-sm font-medium mb-1">Message du visiteur</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedVisit.message}</p>
                    </div>
                  </div>
                )}

                {selectedVisit.agent_notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes de l'agent</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedVisit.agent_notes}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="actionNote">Note (optionnelle)</Label>
                  <Textarea
                    id="actionNote"
                    placeholder="Ajouter une note..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedVisit.status === "en_attente" && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateVisitStatus(selectedVisit.id, "confirmee", actionNote)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => updateVisitStatus(selectedVisit.id, "reportee", actionNote)}
                      >
                        <CalendarX className="w-4 h-4 mr-2" />
                        Reporter
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => updateVisitStatus(selectedVisit.id, "annulee", actionNote)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  )}

                  {selectedVisit.status === "confirmee" && (
                    <>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => updateVisitStatus(selectedVisit.id, "realisee", actionNote)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marquer réalisée
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => updateVisitStatus(selectedVisit.id, "reportee", actionNote)}
                      >
                        <CalendarX className="w-4 h-4 mr-2" />
                        Reporter
                      </Button>
                    </>
                  )}

                  {selectedVisit.status === "reportee" && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateVisitStatus(selectedVisit.id, "confirmee", actionNote)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => updateVisitStatus(selectedVisit.id, "annulee", actionNote)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Annuler
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