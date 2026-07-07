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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, FileText, Plus, Search, Download, Trash2, File, Image, Video, FileImage } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { FileUpload } from "@/components/FileUpload";

type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentWithProperty = Document & {
  properties?: { reference: string; title: string } | null;
};
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];

const DOCUMENT_TYPES = ["contrat", "facture", "recu", "photo", "video", "plan", "administratif", "autre"];

const DOCUMENT_ICONS: Record<string, any> = {
  contrat: FileText,
  facture: FileText,
  recu: FileText,
  photo: Image,
  video: Video,
  plan: FileImage,
  administratif: File,
  autre: File,
};

export default function DocumentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [documents, setDocuments] = useState<DocumentWithProperty[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterProperty, setFilterProperty] = useState<string>("all");

  const [formData, setFormData] = useState<Partial<DocumentInsert>>({
    property_id: "",
    type: "contrat",
    name: "",
    file_url: "",
  });

  const [uploadedFile, setUploadedFile] = useState<string>("");

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

      const [documentsRes, propertiesRes] = await Promise.all([
        supabase
          .from("documents")
          .select("*, properties(reference, title)")
          .order("created_at", { ascending: false }),
        supabase.from("properties").select("id, reference, title"),
      ]);

      if (documentsRes.error) throw documentsRes.error;
      if (propertiesRes.error) throw propertiesRes.error;

      setDocuments(documentsRes.data || []);
      setProperties(propertiesRes.data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function createDocument(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from("documents").insert({
        property_id: formData.property_id,
        type: formData.type || "contrat",
        name: formData.name,
        file_url: uploadedFile,
      });

      if (error) throw error;

      toast({
        title: "Document ajouté",
        description: "Le document a été ajouté avec succès",
      });

      setShowCreateDialog(false);
      setFormData({
        property_id: "",
        type: "contrat",
        name: "",
        file_url: "",
      });
      setUploadedFile("");
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document",
        variant: "destructive",
      });
    }
  }

  async function deleteDocument(documentId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      const { error } = await supabase.from("documents").delete().eq("id", documentId);

      if (error) throw error;

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès",
      });

      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesProperty = filterProperty === "all" || doc.property_id === filterProperty;
    const matchesSearch =
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.properties?.reference.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesProperty && matchesSearch;
  });

  // Statistiques
  const totalDocuments = documents.length;
  const documentsByType = DOCUMENT_TYPES.reduce((acc, type) => {
    acc[type] = documents.filter((d) => d.type === type).length;
    return acc;
  }, {} as Record<string, number>);

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
                <h1 className="text-3xl font-serif font-bold">Bibliothèque Documents</h1>
                <p className="text-sm text-primary-foreground/80">
                  Gestion centralisée de tous les documents
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-accent text-primary hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un document
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{totalDocuments}</p>
            </CardContent>
          </Card>

          {Object.entries(documentsByType).slice(0, 4).map(([type, count]) => (
            <Card key={type}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground capitalize">{type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={(value) => setFilterType(value as string)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les biens</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.reference} - {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des documents */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun document trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => {
              const Icon = DOCUMENT_ICONS[doc.type] || File;
              return (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{doc.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {doc.properties?.reference}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Ajouté le {new Date(doc.created_at || "").toLocaleDateString("fr-FR")}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(doc.file_url, "_blank")}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDocument(doc.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dialog création */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
              <DialogDescription>Ajouter un nouveau document à la bibliothèque</DialogDescription>
            </DialogHeader>

            <form onSubmit={createDocument} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property_id">Bien associé *</Label>
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
                  <Label htmlFor="type">Type de document *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom du document *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Contrat de bail - Janvier 2026"
                />
              </div>

              <div className="space-y-2">
                <Label>Fichier *</Label>
                <FileUpload
                  bucket="documents"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onUploadComplete={(urls) => setUploadedFile(urls[0])}
                  existingFiles={uploadedFile ? [uploadedFile] : []}
                />
                <p className="text-xs text-muted-foreground">
                  PDF, Word, Images (max 10MB)
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-accent text-primary hover:bg-accent/90">
                  Ajouter le document
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}