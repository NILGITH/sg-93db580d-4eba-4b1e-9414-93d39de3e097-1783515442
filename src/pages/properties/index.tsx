import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getProperties, createProperty, updateProperty, deleteProperty } from "@/services/propertiesService";
import { FileUpload } from "@/components/FileUpload";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Search, Plus, Edit, Trash2, MapPin, Home, DollarSign, Eye, EyeOff, Upload, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

const PROPERTY_TYPES = ["maison", "appartement", "villa", "terrain", "bureau", "commerce", "immeuble", "parking"];
const PROPERTY_STATUS = ["disponible", "loue", "vendu", "reserve"];
const TRANSACTION_TYPES = ["vente", "location"];

export default function PropertiesPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  const [formData, setFormData] = useState<Partial<PropertyInsert>>({
    reference: "",
    title: "",
    property_type: "appartement",
    status: "disponible",
    transaction_type: "location",
    address: "",
    city: "",
    commune: "",
    quartier: "",
    latitude: null,
    longitude: null,
    rooms: 0,
    surface_area: 0,
    price: 0,
    description: "",
    equipments: [],
    photos: [],
    videos: [],
    published: false,
  });

  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      loadProperties();
    }
  }, [user, profile]);

  async function loadProperties() {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les biens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenDialog(property?: Property) {
    if (property) {
      setEditingProperty(property);
      setFormData(property);
      setPhotoUrls(property.photos || []);
      setVideoUrls(property.videos || []);
    } else {
      setEditingProperty(null);
      setFormData({
        reference: "",
        title: "",
        property_type: "appartement",
        status: "disponible",
        transaction_type: "location",
        address: "",
        city: "",
        commune: "",
        quartier: "",
        latitude: null,
        longitude: null,
        rooms: 0,
        surface_area: 0,
        price: 0,
        description: "",
        equipments: [],
        photos: [],
        videos: [],
        published: false,
      });
      setPhotoUrls([]);
      setVideoUrls([]);
    }
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...formData,
        photos: photoUrls,
        videos: videoUrls,
      } as PropertyInsert;

      if (editingProperty) {
        await updateProperty(editingProperty.id, propertyData);
        toast({
          title: "Succès",
          description: "Bien modifié avec succès",
        });
      } else {
        await createProperty(propertyData);
        toast({
          title: "Succès",
          description: "Bien créé avec succès",
        });
      }
      
      setIsDialogOpen(false);
      loadProperties();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) return;
    
    try {
      await deleteProperty(id);
      toast({
        title: "Succès",
        description: "Bien supprimé avec succès",
      });
      loadProperties();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bien",
        variant: "destructive",
      });
    }
  }

  async function handleTogglePublish(property: Property) {
    try {
      await updateProperty(property.id, { published: !property.published });
      toast({
        title: "Succès",
        description: property.published ? "Bien dépublié" : "Bien publié sur le site",
      });
      loadProperties();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la publication",
        variant: "destructive",
      });
    }
  }

  function addPhotoUrl() {
    if (photoUrls.length < 10) {
      setPhotoUrls([...photoUrls, ""]);
    }
  }

  function updatePhotoUrl(index: number, value: string) {
    const newUrls = [...photoUrls];
    newUrls[index] = value;
    setPhotoUrls(newUrls);
  }

  function removePhotoUrl(index: number) {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  }

  function addVideoUrl() {
    if (videoUrls.length < 5) {
      setVideoUrls([...videoUrls, ""]);
    }
  }

  function updateVideoUrl(index: number, value: string) {
    const newUrls = [...videoUrls];
    newUrls[index] = value;
    setVideoUrls(newUrls);
  }

  function removeVideoUrl(index: number) {
    setVideoUrls(videoUrls.filter((_, i) => i !== index));
  }

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || property.property_type === filterType;
    const matchesStatus = filterStatus === "all" || property.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Gestion des Biens</h1>
                <p className="text-sm text-primary-foreground/80">IMMO360</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push("/dashboard")}>
              Tableau de bord
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par référence, adresse ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {PROPERTY_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau bien
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProperty ? "Modifier le bien" : "Nouveau bien"}
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez tous les champs pour {editingProperty ? "modifier" : "créer"} un bien
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Référence *</Label>
                      <Input
                        id="reference"
                        required
                        value={formData.reference || ""}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        placeholder="REF-2026-001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        required
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Bel appartement 3 pièces"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property_type">Type *</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value) => setFormData({ ...formData, property_type: value as any })}
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
                      <Label htmlFor="status">Statut *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_STATUS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction_type">Transaction *</Label>
                      <Select
                        value={formData.transaction_type}
                        onValueChange={(value) => setFormData({ ...formData, transaction_type: value as any })}
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
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Localisation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse *</Label>
                        <Input
                          id="address"
                          required
                          value={formData.address || ""}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="123 Rue Exemple"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city || ""}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Paris"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commune">Commune</Label>
                        <Input
                          id="commune"
                          value={formData.commune || ""}
                          onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quartier">Quartier</Label>
                        <Input
                          id="quartier"
                          value={formData.quartier || ""}
                          onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude GPS</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={formData.latitude || ""}
                          onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || null })}
                          placeholder="48.8566"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude GPS</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={formData.longitude || ""}
                          onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || null })}
                          placeholder="2.3522"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Caractéristiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rooms">Pièces *</Label>
                        <Input
                          id="rooms"
                          type="number"
                          required
                          value={formData.rooms || 0}
                          onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="surface_area">Surface (m²) *</Label>
                        <Input
                          id="surface_area"
                          type="number"
                          required
                          value={formData.surface_area || 0}
                          onChange={(e) => setFormData({ ...formData, surface_area: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Prix (€) *</Label>
                        <Input
                          id="price"
                          type="number"
                          required
                          value={formData.price || 0}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description détaillée du bien..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Photos (jusqu'à 10)</Label>
                      <FileUpload
                        bucket="properties"
                        accept="image/*"
                        multiple
                        onUploadComplete={(urls) => setFormData({ ...formData, photos: urls })}
                        existingFiles={formData.photos || []}
                      />
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés : JPG, PNG, WebP (max 5MB par fichier)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Vidéos (jusqu'à 5 URLs YouTube/Vimeo)</Label>
                      <Textarea
                        placeholder="https://youtube.com/watch?v=..."
                        value={(formData.videos || []).join("\n")}
                        onChange={(e) => {
                          const urls = e.target.value.split("\n").filter(url => url.trim());
                          setFormData({ ...formData, videos: urls });
                        }}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Une URL par ligne (vidéos hébergées)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published || false}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="published" className="cursor-pointer">
                      Publier sur le site vitrine
                    </Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingProperty ? "Modifier" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des biens...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Aucun bien trouvé</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Essayez de modifier vos filtres"
                  : "Créez votre premier bien pour commencer"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {property.photos && property.photos.length > 0 ? (
                    <img
                      src={property.photos[0]}
                      alt={property.reference || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <StatusBadge variant={property.status === "disponible" ? "available" : "default"}>
                      {property.status}
                    </StatusBadge>
                    {property.published && (
                      <StatusBadge variant="premium">
                        Publié
                      </StatusBadge>
                    )}
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{property.reference}</span>
                    <span className="text-lg font-bold text-accent">
                      {property.price?.toLocaleString()} €
                    </span>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{property.address}, {property.city}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="capitalize">{property.property_type}</span>
                    <span>•</span>
                    <span>{property.rooms} pièces</span>
                    <span>•</span>
                    <span>{property.surface_area} m²</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(property)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(property)}
                    >
                      {property.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}