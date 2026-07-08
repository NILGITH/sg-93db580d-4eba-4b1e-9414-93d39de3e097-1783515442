import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockProperties } from "@/lib/mock-data";
import { 
  Building2, 
  MapPin, 
  Home, 
  DollarSign, 
  Maximize, 
  Bed, 
  Bath,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      // Charger depuis mockProperties
      const found = mockProperties.find(p => p.id === id);
      setProperty(found);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Bien non trouvé</p>
          <Link href="/public/catalogue">
            <Button variant="outline">Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || ["/generated/property-1.png"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3">
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-serif font-bold">AMIRI</h1>
                <p className="text-xs text-primary-foreground/80">Détail du bien</p>
              </div>
            </Link>

            <div className="flex gap-3">
              <Link href="/public/catalogue">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <Link href="/select-profile">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  Espace Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Photos et détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie photos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img
                    src={images[selectedImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-accent text-white">
                      {property.transaction_type === "vente" ? "À vendre" : "À louer"}
                    </Badge>
                    <Badge variant="outline" className="bg-white/90 capitalize">
                      {property.type}
                    </Badge>
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === idx ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Informations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-5 h-5 mr-2" />
                      {property.address}, {property.city}, {property.commune}
                    </div>
                  </div>

                  <Separator />

                  {/* Caractéristiques clés */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Maximize className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold">{property.surface}</p>
                      <p className="text-sm text-muted-foreground">m²</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Bed className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold">{property.rooms}</p>
                      <p className="text-sm text-muted-foreground">Pièces</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Bath className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold">{property.bathrooms || 1}</p>
                      <p className="text-sm text-muted-foreground">Salles de bain</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-serif font-bold mb-3">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Équipements */}
                  {property.equipment && property.equipment.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h2 className="text-xl font-serif font-bold mb-3">Équipements</h2>
                        <div className="grid grid-cols-2 gap-3">
                          {property.equipment.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-accent" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Colonne droite - Prix et contact */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-6">
                  {/* Prix */}
                  <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.transaction_type === "vente" ? "Prix de vente" : "Loyer mensuel"}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-8 h-8 text-accent" />
                      <p className="text-4xl font-bold text-accent">
                        {property.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">FCFA</p>
                  </div>

                  <Separator />

                  {/* Formulaire de contact */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-center">Intéressé par ce bien ?</h3>
                    
                    <Link href="/select-profile">
                      <Button className="w-full" size="lg">
                        <Calendar className="w-5 h-5 mr-2" />
                        Demander une visite
                      </Button>
                    </Link>

                    <div className="space-y-2 text-sm text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>+229 XX XX XX XX</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>contact@amiri.bj</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}