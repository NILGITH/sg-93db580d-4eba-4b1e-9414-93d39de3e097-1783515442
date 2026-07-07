import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/components/FileUpload";
import { useAuth } from "@/hooks/useAuth";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Home,
  CheckCircle2,
  XCircle,
  MapPin,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyType = Database["public"]["Enums"]["property_type"];
type TransactionType = Database["public"]["Enums"]["transaction_type"];
type PropertyStatus = Database["public"]["Enums"]["property_status"];

const PROPERTY_TYPES: PropertyType[] = ["appartement", "maison", "villa", "terrain", "bureau", "commerce", "immeuble", "studio"];
const TRANSACTION_TYPES: TransactionType[] = ["location", "vente"];
const PROPERTY_STATUSES: PropertyStatus[] = ["disponible", "loue", "vendu", "reserve"];

export default function AdminPropertiesPublicPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPublished, setFilterPublished] = useState<"all" | "published" | "unpublished">("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    reference: "",
    title: "",
    property_type: "appartement" as PropertyType,
    transaction_type: "location" as TransactionType,
    status: "disponible" as PropertyStatus,
    price: "",
    address: "",
    city: "",
    commune: "",
    quartier: "",
    rooms: "",
    bathrooms: "",
    surface_area: "",
    description: "",
    equipments: "",
    photos: [] as string[],
    videos: [] as string[],
    published: false,
  });

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "agent" && user?.role !== "secretaire") {
      router.push("/dashboard");
      return;
    }
    loadProperties();
  }, [user]);

  async function loadProperties() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Erreur chargement biens:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les biens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(property: Property) {
    try {
      const { error } = await supabase
        .from("properties")
        .update({ published: !property.published })
        .eq("id", property.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: property.published ? "Bien dépublié" : "Bien publié sur le site",
      });

      loadProperties();
    } catch (error) {
      console.error("Erreur basculement publication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la publication",
        variant: "destructive",
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);

      const equipmentsArray = formData.equipments
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const propertyData = {
        reference: formData.reference,
        title: formData.title,
        property_type: formData.property_type,
        transaction_type: formData.transaction_type,
        status: formData.status,
        price: parseFloat(formData.price),
        address: formData.address,
        city: formData.city,
        commune: formData.commune,
        quartier: formData.quartier,
        rooms: parseInt(formData.rooms),
        bathrooms: parseInt(formData.bathrooms) || null,
        surface_area: parseFloat(formData.surface_area),
        description: formData.description,
        equipments: equipmentsArray,
        photos: formData.photos,
        videos: formData.videos,
        published: formData.published,
      };

      if (editingProperty) {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", editingProperty.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Bien modifié avec succès",
        });
      } else {
        const { error } = await supabase
          .from("properties")
          .insert(propertyData);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Bien créé avec succès",
        });
      }

      setShowCreateDialog(false);
      setEditingProperty(null);
      resetForm();
      loadProperties();
    } catch (error) {
      console.error("Erreur soumission:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le bien",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingProperty) return;

    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", deletingProperty.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Bien supprimé avec succès",
      });

      setDeletingProperty(null);
      loadProperties();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bien",
        variant: "destructive",
      });
    }
  }

  function resetForm() {
    setFormData({
      reference: "",
      title: "",
      property_type: "appartement",
      transaction_type: "location",
      status: "disponible",
      price: "",
      address: "",
      city: "",
      commune: "",
      quartier: "",
      rooms: "",
      bathrooms: "",
      surface_area: "",
      description: "",
      equipments: "",
      photos: [],
      videos: [],
      published: false,
    });
  }

  function openEditDialog(property: Property) {
    const equipments = Array.isArray(property.equipments) 
      ? property.equipments 
      : Object.values(property.equipments || {}).filter(Boolean);

    setFormData({
      reference: property.reference,
      title: property.title,
      property_type: property.property_type,
      transaction_type: property.transaction_type,
      status: property.status,
      price: property.price.toString(),
      address: property.address,
      city: property.city,
      commune: property.commune || "",
      quartier: property.quartier || "",
      rooms: property.rooms.toString(),
      bathrooms: property.bathrooms?.toString() || "",
      surface_area: property.surface_area.toString(),
      description: property.description || "",
      equipments: equipments.join(", "),
      photos: Array.isArray(property.photos) ? property.photos : [],
      videos: Array.isArray(property.videos) ? property.videos : [],
      published: property.published,
    });
    setEditingProperty(property);
    setShowCreateDialog(true);
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPublished =
      filterPublished === "all" ||
      (filterPublished === "published" && property.published) ||
      (filterPublished === "unpublished" && !property.published);

    return matchesSearch && matchesPublished;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-serif font-bold">IMMO360</h1>
                <p className="text-xs text-primary-foreground/80">Gestion des biens publics</p>
              </div>
            </Link>

            <nav className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  Tableau de bord
                </Button>
              </Link>
              <Link href="/public/catalogue" target="_blank">
                <Button variant="outline" size="sm" className="border-accent text-accent">
                  Voir le site
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Gestion des biens publics</h2>
            <p className="text-muted-foreground">{filteredProperties.length} bien(s) • {properties.filter(p => p.published).length} publié(s)</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingProperty(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau bien
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProperty ? "Modifier le bien" : "Créer un bien"}</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du bien immobilier
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Référence *</Label>
                    <Input
                      id="reference"
                      required
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="REF-001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="published">Publication</Label>
                    <Select
                      value={formData.published ? "yes" : "no"}
                      onValueChange={(value) => setFormData({ ...formData, published: value === "yes" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">Non publié</SelectItem>
                        <SelectItem value="yes">Publié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Villa moderne 4 chambres..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Type de bien *</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) => setFormData({ ...formData, property_type: value as PropertyType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction_type">Transaction *</Label>
                    <Select
                      value={formData.transaction_type}
                      onValueChange={(value) => setFormData({ ...formData, transaction_type: value as TransactionType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statut *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as PropertyStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace(/_/g, " ").charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA) *</Label>
                    <Input
                      id="price"
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="150000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rooms">Pièces *</Label>
                    <Input
                      id="rooms"
                      type="number"
                      required
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      placeholder="3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Salles de bain</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder="2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surface_area">Surface (m²) *</Label>
                    <Input
                      id="surface_area"
                      type="number"
                      required
                      value={formData.surface_area}
                      onChange={(e) => setFormData({ ...formData, surface_area: e.target.value })}
                      placeholder="120"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rue, avenue, numéro..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Cotonou"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commune">Commune</Label>
                    <Input
                      id="commune"
                      value={formData.commune}
                      onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                      placeholder="Akpakpa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quartier">Quartier</Label>
                    <Input
                      id="quartier"
                      value={formData.quartier}
                      onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                      placeholder="Menontin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description détaillée du bien..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipments">Équipements (séparés par des virgules)</Label>
                  <Textarea
                    id="equipments"
                    value={formData.equipments}
                    onChange={(e) => setFormData({ ...formData, equipments: e.target.value })}
                    placeholder="Climatisation, Cuisine équipée, Parking, Sécurité..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photos</Label>
                  <FileUpload
                    accept="image/*"
                    multiple
                    onUploadComplete={(urls) => setFormData({ ...formData, photos: urls })}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      setEditingProperty(null);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Enregistrement..." : editingProperty ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par référence, titre, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterPublished} onValueChange={(value: any) => setFilterPublished(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les biens</SelectItem>
                  <SelectItem value="published">Publiés uniquement</SelectItem>
                  <SelectItem value="unpublished">Non publiés uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des biens */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun bien trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Photo */}
                    <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {property.photos && Array.isArray(property.photos) && property.photos.length > 0 ? (
                        <img
                          src={property.photos[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{property.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {property.reference}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.city} {property.quartier && `• ${property.quartier}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {property.published ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Publié
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100">
                              <XCircle className="w-3 h-3 mr-1" />
                              Non publié
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="capitalize">{property.property_type}</span>
                        <span>•</span>
                        <span className="capitalize">{property.transaction_type}</span>
                        <span>•</span>
                        <span>{property.rooms} pièces</span>
                        <span>•</span>
                        <span>{property.surface_area} m²</span>
                        <span>•</span>
                        <span className="font-semibold text-accent">{property.price.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={property.published ? "outline" : "default"}
                          onClick={() => handleTogglePublish(property)}
                        >
                          {property.published ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Dépublier
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Publier
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(property)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletingProperty(property)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>

                        {property.published && (
                          <Link href={`/public/properties/${property.id}`} target="_blank">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog confirmation suppression */}
      <AlertDialog open={!!deletingProperty} onOpenChange={() => setDeletingProperty(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le bien "{deletingProperty?.title}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}