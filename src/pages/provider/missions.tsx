import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Wrench, Calendar, MapPin, Upload, CheckCircle2, Camera } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { FileUpload } from "@/components/FileUpload";

type Intervention = Database["public"]["Tables"]["interventions"]["Row"];
type InterventionWithDetails = Intervention & {
  properties?: { reference: string; title: string; address: string; city: string } | null;
};

export default function ProviderMissionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [missions, setMissions] = useState<InterventionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedMission, setSelectedMission] = useState<InterventionWithDetails | null>(null);

  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const [photosAfter, setPhotosAfter] = useState<string[]>([]);
  const [providerNotes, setProviderNotes] = useState("");
  const [actualCost, setActualCost] = useState<number>(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile && profile.role === "provider") {
      loadMissions();
    }
  }, [user, profile]);

  async function loadMissions() {
    try {
      setLoading(true);

      const { data: providerData } = await supabase
        .from("providers")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!providerData) {
        toast({
          title: "Erreur",
          description: "Profil prestataire introuvable",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("interventions")
        .select("*, properties(reference, title, address, city)")
        .eq("provider_id", providerData.id)
        .order("scheduled_date", { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les missions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function startMission(missionId: string) {
    try {
      const { error } = await supabase
        .from("interventions")
        .update({ status: "en_cours" })
        .eq("id", missionId);

      if (error) throw error;

      toast({
        title: "Mission démarrée",
        description: "La mission est maintenant en cours",
      });

      loadMissions();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la mission",
        variant: "destructive",
      });
    }
  }

  async function completeMission(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMission) return;

    try {
      const { error } = await supabase
        .from("interventions")
        .update({ 
          status: "terminee",
          completed_date: new Date().toISOString(),
          photos_before: photosBefore,
          photos_after: photosAfter,
          provider_comment: providerNotes,
          actual_cost: actualCost || selectedMission.estimated_cost,
        })
        .eq("id", selectedMission.id);

      if (error) throw error;

      toast({
        title: "Mission terminée",
        description: "La mission a été marquée comme terminée. Elle attend validation.",
      });

      setShowDetailDialog(false);
      setPhotosBefore([]);
      setPhotosAfter([]);
      setProviderNotes("");
      setActualCost(0);
      loadMissions();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de terminer la mission",
        variant: "destructive",
      });
    }
  }

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (profile.role !== "provider") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Accès réservé aux prestataires</p>
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
                <h1 className="text-3xl font-serif font-bold">Mes Missions</h1>
                <p className="text-sm text-primary-foreground/80">Interventions qui me sont affectées</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                Déconnexion
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Planifiées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {missions.filter(m => m.status === "planifiee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {missions.filter(m => m.status === "en_cours").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {missions.filter(m => m.status === "terminee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Validées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {missions.filter(m => m.status === "validee").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des missions */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : missions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune mission</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <Card key={mission.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg capitalize">{mission.intervention_type}</CardTitle>
                      <CardDescription className="mt-1">
                        {mission.properties?.reference}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={
                        mission.status === "validee" ? "default" : 
                        mission.status === "terminee" ? "outline" : 
                        mission.status === "en_cours" ? "secondary" :
                        mission.status === "annulee" ? "destructive" : "default"
                      }
                      className={
                        mission.status === "validee" ? "bg-green-600" :
                        mission.status === "planifiee" ? "bg-blue-600" :
                        mission.status === "en_cours" ? "bg-amber-600" : ""
                      }
                    >
                      {mission.status === "planifiee" ? "Planifiée" :
                       mission.status === "en_cours" ? "En cours" :
                       mission.status === "terminee" ? "Terminée" :
                       mission.status === "validee" ? "Validée" : "Annulée"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">
                      {mission.properties?.address}, {mission.properties?.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(mission.scheduled_date).toLocaleDateString("fr-FR")}</span>
                  </div>

                  {mission.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mission.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {mission.status === "planifiee" && (
                      <Button
                        size="sm"
                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                        onClick={() => startMission(mission.id)}
                      >
                        Démarrer
                      </Button>
                    )}

                    {mission.status === "en_cours" && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedMission(mission);
                          setActualCost(mission.estimated_cost || 0);
                          setShowDetailDialog(true);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Terminer
                      </Button>
                    )}

                    {(mission.status === "terminee" || mission.status === "validee") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedMission(mission);
                          setShowDetailDialog(true);
                        }}
                      >
                        Voir détails
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog terminer mission */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedMission?.status === "en_cours" ? "Terminer la mission" : "Détails de la mission"}
              </DialogTitle>
              <DialogDescription>
                {selectedMission?.intervention_type.charAt(0).toUpperCase() + selectedMission?.intervention_type.slice(1)} - {selectedMission?.properties?.reference}
              </DialogDescription>
            </DialogHeader>

            {selectedMission && (
              <>
                {selectedMission.status === "en_cours" ? (
                  <form onSubmit={completeMission} className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-1">Bien</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMission.properties?.address}, {selectedMission.properties?.city}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedMission.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photosBefore">Photos avant (une URL par ligne)</Label>
                      <Textarea
                        id="photosBefore"
                        placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                        value={photosBefore}
                        onChange={(e) => setPhotosBefore(e.target.value)}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">Copiez les URLs des photos hébergées</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photosAfter">Photos après (une URL par ligne) *</Label>
                      <Textarea
                        id="photosAfter"
                        required
                        placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                        value={photosAfter}
                        onChange={(e) => setPhotosAfter(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actualCost">Coût réel (€) *</Label>
                      <Input
                        id="actualCost"
                        type="number"
                        step="0.01"
                        required
                        value={actualCost}
                        onChange={(e) => setActualCost(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="providerNotes">Commentaires</Label>
                      <Textarea
                        id="providerNotes"
                        placeholder="Notes sur l'intervention réalisée..."
                        value={providerNotes}
                        onChange={(e) => setProviderNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowDetailDialog(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Terminer la mission
                      </Button>
                    </DialogFooter>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-1">Bien</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMission.properties?.address}, {selectedMission.properties?.city}
                      </p>
                    </div>

                    {selectedMission.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Description</p>
                        <p className="text-sm text-muted-foreground">{selectedMission.description}</p>
                      </div>
                    )}

                    {selectedMission.photos_before && Array.isArray(selectedMission.photos_before) && selectedMission.photos_before.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Photos avant</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(selectedMission.photos_before as string[]).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Avant ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMission.photos_after && Array.isArray(selectedMission.photos_after) && selectedMission.photos_after.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Photos après</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(selectedMission.photos_after as string[]).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Après ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMission.provider_comment && (
                      <div>
                        <p className="text-sm font-medium mb-1">Mes commentaires</p>
                        <p className="text-sm text-muted-foreground">{selectedMission.provider_comment}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}