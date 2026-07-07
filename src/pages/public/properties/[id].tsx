import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, MapPin, Maximize, DoorOpen, ArrowLeft, Phone, Mail, 
  Calendar, Home, Play, ChevronLeft, ChevronRight 
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
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showVisitDialog, setShowVisitDialog] = useState(false);

  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [visitForm, setVisitForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    visitDate: "",
    visitTime: "",
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
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id as string)
        .eq("published", true)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error("Erreur chargement bien:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger ce bien",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Créer un prospect
      const { error } = await supabase.from("prospects").insert({
        first_name: contactForm.firstName,
        last_name: contactForm.lastName,
        email: contactForm.email,
        phone: contactForm.phone,
        property_id: property?.id,
        demand_type: "information",
        message: contactForm.message,
        status: "nouveau",
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons très prochainement",
      });

      setShowContactDialog(false);
      setContactForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande",
        variant: "destructive",
      });
    }
  }

  async function handleVisitSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Créer un prospect
      const { data: prospectData, error: prospectError } = await supabase
        .from("prospects")
        .insert({
          first_name: visitForm.firstName,
          last_name: visitForm.lastName,
          email: visitForm.email,
          phone: visitForm.phone,
          property_id: property?.id,
          demand_type: "visite",
          status: "nouveau",
        })
        .select()
        .single();

      if (prospectError) throw prospectError;

      // Créer une demande de visite
      const { error: visitError } = await supabase.from("visits").insert({
        property_id: property?.id,
        prospect_id: prospectData.id,
        preferred_date: `${visitForm.visitDate}T${visitForm.visitTime}:00`,
        visitor_name: `${visitForm.firstName} ${visitForm.lastName}`,
        visitor_email: visitForm.email,
        visitor_phone: visitForm.phone,
        status: "en_attente",
        message: visitForm.message,
      });

      if (visitError) throw visitError;

      toast({
        title: "Demande de visite envoyée",
        description: "Un agent vous contactera pour confirmer",
      });

      setShowVisitDialog(false);
      setVisitForm({ firstName: "", lastName: "", email: "", phone: "", visitDate: "", visitTime: "", message: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de visite",
        variant: "destructive",
      });
    }
  }

  function nextPhoto() {
    const photos = property?.photos as string[] | null;
    if (photos && photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  }

  function prevPhoto() {
    const photos = property?.photos as string[] | null;
    if (photos && photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Home className="w-16 h-16 text-muted-foreground/30" />
        <p className="text-muted-foreground">Bien introuvable</p>
        <Link href="/public/catalogue">
          <Button variant="outline">Retour au catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-serif font-bold">IMMO360</h1>
              </div>
            </Link>

            <Link href="/public/catalogue">
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour au catalogue
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* En-tête du bien */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">{property.title}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.city}</span>
                {property.quartier && <span>• {property.quartier}</span>}
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-accent mb-2">
                {property.price.toLocaleString()} FCFA
              </p>
              <Badge variant="outline" className="capitalize">
                {property.transaction_type}
              </Badge>
            </div>
          </div>

          <Separator />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Galerie et détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie photos */}
            {property.photos && Array.isArray(property.photos) && property.photos.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <img
                      src={(property.photos as string[])[currentPhotoIndex]}
                      alt={`${property.title} - Photo ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {(property.photos as string[]).length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={prevPhoto}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={nextPhoto}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                          {currentPhotoIndex + 1} / {(property.photos as string[]).length}
                        </div>
                      </>
                    )}
                  </div>

                  {(property.photos as string[]).length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {(property.photos as string[]).map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentPhotoIndex ? "border-accent scale-105" : "border-transparent"
                          }`}
                        >
                          <img src={photo} alt={`Miniature ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Vidéos */}
            {property.videos && Array.isArray(property.videos) && property.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Vidéos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(property.videos as string[]).map((video, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <iframe
                        src={video}
                        className="w-full h-full"
                        allowFullScreen
                        title={`Vidéo ${index + 1}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {property.description || "Aucune description disponible"}
                </p>
              </CardContent>
            </Card>

            {/* Équipements */}
            {property.equipments && Array.isArray(property.equipments) && property.equipments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Équipements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(property.equipments as string[]).map((equipment, index) => (
                      <Badge key={index} variant="secondary">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Carte (si GPS disponible) */}
            {property.latitude && property.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed`}
                      className="w-full h-full"
                      title="Carte"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Caractéristiques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{property.property_type}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge variant="outline" className="capitalize">{property.status}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DoorOpen className="w-4 h-4" />
                    Pièces
                  </span>
                  <span className="font-medium">{property.rooms}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Maximize className="w-4 h-4" />
                    Surface
                  </span>
                  <span className="font-medium">{property.surface_area} m²</span>
                </div>
                {property.reference && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Référence</span>
                      <span className="font-mono text-sm">{property.reference}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Intéressé ?</CardTitle>
                <CardDescription>
                  Contactez-nous pour plus d'informations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-accent text-primary hover:bg-accent/90 gap-2">
                      <Calendar className="w-4 h-4" />
                      Demander une visite
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demande de visite</DialogTitle>
                      <DialogDescription>
                        Remplissez ce formulaire et un agent vous contactera
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleVisitSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="visitFirstName">Prénom *</Label>
                          <Input
                            id="visitFirstName"
                            required
                            value={visitForm.firstName}
                            onChange={(e) => setVisitForm({ ...visitForm, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visitLastName">Nom *</Label>
                          <Input
                            id="visitLastName"
                            required
                            value={visitForm.lastName}
                            onChange={(e) => setVisitForm({ ...visitForm, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visitEmail">Email *</Label>
                        <Input
                          id="visitEmail"
                          type="email"
                          required
                          value={visitForm.email}
                          onChange={(e) => setVisitForm({ ...visitForm, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visitPhone">Téléphone *</Label>
                        <Input
                          id="visitPhone"
                          type="tel"
                          required
                          value={visitForm.phone}
                          onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="visitDate">Date souhaitée *</Label>
                          <Input
                            id="visitDate"
                            type="date"
                            required
                            value={visitForm.visitDate}
                            onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visitTime">Heure *</Label>
                          <Input
                            id="visitTime"
                            type="time"
                            required
                            value={visitForm.visitTime}
                            onChange={(e) => setVisitForm({ ...visitForm, visitTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visitMessage">Message</Label>
                        <Textarea
                          id="visitMessage"
                          value={visitForm.message}
                          onChange={(e) => setVisitForm({ ...visitForm, message: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Envoyer la demande
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Mail className="w-4 h-4" />
                      Demander des infos
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demande d'information</DialogTitle>
                      <DialogDescription>
                        Posez-nous vos questions sur ce bien
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactFirstName">Prénom *</Label>
                          <Input
                            id="contactFirstName"
                            required
                            value={contactForm.firstName}
                            onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactLastName">Nom *</Label>
                          <Input
                            id="contactLastName"
                            required
                            value={contactForm.lastName}
                            onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Téléphone *</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactMessage">Message *</Label>
                        <Textarea
                          id="contactMessage"
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Envoyer
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  Appeler
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}