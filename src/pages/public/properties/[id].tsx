import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  MapPin,
  Home,
  DollarSign,
  Maximize2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User,
  MessageSquare,
  Clock,
  CheckCircle2,
  Bed,
  Bath,
  Car,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

export default function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Formulaire de demande de visite
  const [visitForm, setVisitForm] = useState({
    visitor_name: "",
    visitor_email: "",
    visitor_phone: "",
    preferred_date: "",
    preferred_time: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  async function loadProperty() {
    try {
      setLoading(true);
      const propertyId = typeof id === "string" ? id : id?.[0];
      if (!propertyId) return;

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .eq("published", true)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error("Erreur chargement bien:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du bien",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitVisit(e: React.FormEvent) {
    e.preventDefault();
    if (!property) return;

    try {
      setSubmitting(true);

      // Enregistrer la demande de visite
      const { error } = await supabase.from("visits").insert({
        property_id: property.id,
        visitor_name: visitForm.visitor_name,
        visitor_email: visitForm.visitor_email,
        visitor_phone: visitForm.visitor_phone,
        preferred_date: new Date(`${visitForm.preferred_date}T${visitForm.preferred_time}`).toISOString(),
        message: visitForm.message,
        status: "en_attente",
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontacterons rapidement pour confirmer la visite.",
      });

      // Réinitialiser le formulaire
      setVisitForm({
        visitor_name: "",
        visitor_email: "",
        visitor_phone: "",
        preferred_date: "",
        preferred_time: "",
        message: "",
      });
    } catch (error) {
      console.error("Erreur envoi demande:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function nextPhoto() {
    if (property?.photos && Array.isArray(property.photos)) {
      setCurrentPhotoIndex((prev) => (prev + 1) % property.photos.length);
    }
  }

  function prevPhoto() {
    if (property?.photos && Array.isArray(property.photos)) {
      setCurrentPhotoIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Bien non trouvé</p>
            <Link href="/public/catalogue">
              <Button variant="outline">Retour au catalogue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const photos = Array.isArray(property.photos) ? property.photos : [];
  const equipments = property.equipments as Record<string, any> || {};
  const equipmentsList = Array.isArray(equipments) ? equipments : Object.values(equipments).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-serif font-bold">IMMO360</h1>
                <p className="text-xs text-primary-foreground/80">Détails du bien</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/public" className="text-sm hover:text-accent transition-colors">
                Accueil
              </Link>
              <Link href="/public/catalogue" className="text-sm hover:text-accent transition-colors">
                Nos biens
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  Espace Client
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/public" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/public/catalogue" className="hover:text-foreground">
            Catalogue
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{property.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie photos */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-[16/10] bg-muted overflow-hidden group">
                  {photos.length > 0 ? (
                    <>
                      <img
                        src={photos[currentPhotoIndex]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={prevPhoto}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextPhoto}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentPhotoIndex + 1} / {photos.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Miniatures */}
                {photos.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                          index === currentPhotoIndex ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-serif mb-2">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="w-4 h-4" />
                      {property.address}, {property.city}
                      {property.quartier && ` • ${property.quartier}`}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize text-lg px-4 py-2">
                    {property.transaction_type}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Prix */}
                <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
                  <DollarSign className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prix</p>
                    <p className="text-3xl font-bold text-accent">{property.price.toLocaleString()} FCFA</p>
                    {property.transaction_type === "location" && (
                      <p className="text-sm text-muted-foreground">par mois</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Caractéristiques */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                      <Home className="w-6 h-6 text-accent mb-2" />
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize">{property.property_type}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                      <Bed className="w-6 h-6 text-accent mb-2" />
                      <p className="text-sm text-muted-foreground">Pièces</p>
                      <p className="font-semibold">{property.rooms}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                      <Bath className="w-6 h-6 text-accent mb-2" />
                      <p className="text-sm text-muted-foreground">Salles de bain</p>
                      <p className="font-semibold">{property.bathrooms || "N/A"}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                      <Maximize2 className="w-6 h-6 text-accent mb-2" />
                      <p className="text-sm text-muted-foreground">Surface</p>
                      <p className="font-semibold">{property.surface_area} m²</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                {property.description && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {property.description}
                      </p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Équipements */}
                {equipmentsList.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Équipements</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {equipmentsList.map((equipment, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-sm">{equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vidéos */}
            {property.videos && Array.isArray(property.videos) && property.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Visite virtuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <video controls className="w-full h-full">
                      <source src={property.videos[0]} />
                    </video>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne formulaire */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Demander une visite
                </CardTitle>
                <CardDescription>Remplissez le formulaire pour planifier une visite</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmitVisit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitor_name">
                      <User className="w-4 h-4 inline mr-2" />
                      Nom complet *
                    </Label>
                    <Input
                      id="visitor_name"
                      required
                      value={visitForm.visitor_name}
                      onChange={(e) => setVisitForm({ ...visitForm, visitor_name: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitor_email">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </Label>
                    <Input
                      id="visitor_email"
                      type="email"
                      required
                      value={visitForm.visitor_email}
                      onChange={(e) => setVisitForm({ ...visitForm, visitor_email: e.target.value })}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitor_phone">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Téléphone *
                    </Label>
                    <Input
                      id="visitor_phone"
                      type="tel"
                      required
                      value={visitForm.visitor_phone}
                      onChange={(e) => setVisitForm({ ...visitForm, visitor_phone: e.target.value })}
                      placeholder="+229 XX XX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_date">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date souhaitée *
                    </Label>
                    <Input
                      id="preferred_date"
                      type="date"
                      required
                      value={visitForm.preferred_date}
                      onChange={(e) => setVisitForm({ ...visitForm, preferred_date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_time">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Heure souhaitée *
                    </Label>
                    <Input
                      id="preferred_time"
                      type="time"
                      required
                      value={visitForm.preferred_time}
                      onChange={(e) => setVisitForm({ ...visitForm, preferred_time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Message (optionnel)
                    </Label>
                    <Textarea
                      id="message"
                      value={visitForm.message}
                      onChange={(e) => setVisitForm({ ...visitForm, message: e.target.value })}
                      placeholder="Questions ou informations supplémentaires..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Envoi en cours..." : "Envoyer la demande"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Nous vous recontacterons dans les 24h pour confirmer votre visite
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}