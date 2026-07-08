import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { mockProperties } from "@/lib/mock-data";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  Home,
  LogOut,
  File,
  Image as ImageIcon,
  FileVideo,
} from "lucide-react";

// Documents mockés
const mockDocuments = [
  {
    id: "1",
    property_id: "1",
    property_title: "Villa Moderne 4 Pièces - Akpakpa",
    name: "Contrat de location - Villa Akpakpa.pdf",
    type: "contrat",
    url: "/documents/contrat-1.pdf",
    size: "245 KB",
    created_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "2",
    property_id: "2",
    property_title: "Appartement Standing 3 Pièces - Haie Vive",
    name: "Facture électricité Janvier 2026.pdf",
    type: "facture",
    url: "/documents/facture-1.pdf",
    size: "128 KB",
    created_at: "2026-06-18T10:00:00Z",
  },
  {
    id: "3",
    property_id: "1",
    property_title: "Villa Moderne 4 Pièces - Akpakpa",
    name: "Plan villa.jpg",
    type: "plan",
    url: "/generated/property-1.png",
    size: "1.2 MB",
    created_at: "2026-06-20T10:00:00Z",
  },
  {
    id: "4",
    property_id: "3",
    property_title: "Studio Meublé - Cadjehoun",
    name: "État des lieux Studio.pdf",
    type: "etat_lieux",
    url: "/documents/etat-lieux-1.pdf",
    size: "198 KB",
    created_at: "2026-06-22T10:00:00Z",
  },
  {
    id: "5",
    property_id: "4",
    property_title: "Villa de Luxe 6 Pièces - Fidjrossè",
    name: "Photos villa luxe.zip",
    type: "photos",
    url: "/documents/photos-1.zip",
    size: "5.4 MB",
    created_at: "2026-06-25T10:00:00Z",
  },
];

export default function DocumentsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterProperty, setFilterProperty] = useState<string>("all");
  const [documents, setDocuments] = useState(mockDocuments);

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/select-profile");
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.property_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesProperty =
      filterProperty === "all" || doc.property_id === filterProperty;
    return matchesSearch && matchesType && matchesProperty;
  });

  function getFileIcon(type: string) {
    if (type === "photos" || type === "plan") return ImageIcon;
    if (type === "video") return FileVideo;
    return FileText;
  }

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      contrat: "Contrat",
      facture: "Facture",
      plan: "Plan",
      etat_lieux: "État des lieux",
      photos: "Photos",
      video: "Vidéo",
      autre: "Autre",
    };
    return labels[type] || type;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <File className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Documents</h1>
                <p className="text-sm text-primary-foreground/80">
                  Bibliothèque documentaire
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="border-accent text-accent hover:bg-accent hover:text-primary">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Filtres et recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="contrat">Contrats</SelectItem>
                  <SelectItem value="facture">Factures</SelectItem>
                  <SelectItem value="plan">Plans</SelectItem>
                  <SelectItem value="etat_lieux">États des lieux</SelectItem>
                  <SelectItem value="photos">Photos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Bien immobilier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les biens</SelectItem>
                  {mockProperties.slice(0, 5).map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Button disabled>
                <Upload className="w-4 h-4 mr-2" />
                Ajouter un document (Mode démo)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{documents.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contrats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {documents.filter((d) => d.type === "contrat").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Factures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {documents.filter((d) => d.type === "facture").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Photos/Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {documents.filter((d) => d.type === "photos" || d.type === "plan").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des documents */}
        <Card>
          <CardHeader>
            <CardTitle>
              Documents ({filteredDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <File className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun document trouvé</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => {
                  const Icon = getFileIcon(doc.type);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Icon className="w-8 h-8 text-accent" />
                        <div className="flex-1">
                          <p className="font-semibold">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.property_title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {getTypeLabel(doc.type)}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" disabled>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" disabled>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}