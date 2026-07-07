import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Search, MapPin, Home, DollarSign, Maximize, Sparkles, Phone, Mail } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

export default function PublicHomePage() {
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchType, setSearchType] = useState<string>("location");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);

      // Biens récents (derniers 6 publiés)
      const { data: recent } = await supabase
        .from("properties")
        .select("*")
        .eq("published", true)
        .eq("status", "disponible")
        .order("created_at", { ascending: false })
        .limit(6);

      if (recent) setRecentProperties(recent);

      // Biens vedette (prix élevés ou surfaces importantes)
      const { data: featured } = await supabase
        .from("properties")
        .select("*")
        .eq("published", true)
        .eq("status", "disponible")
        .order("price", { ascending: false })
        .limit(3);

      if (featured) setFeaturedProperties(featured);
    } catch (error) {
      console.error("Erreur chargement biens:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchType !== "all") params.set("transaction_type", searchType);
    if (searchQuery) params.set("query", searchQuery);
    window.location.href = `/public/catalogue?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg"
      >
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3 group">
              <motion.img
                src="/logo-icon.svg"
                alt="IMMO360"
                className="w-10 h-10"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div>
                <h1 className="text-2xl font-serif font-bold group-hover:text-accent transition-colors">IMMO360</h1>
                <p className="text-xs text-primary-foreground/80">Votre partenaire immobilier de confiance</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/public" className="text-sm hover:text-accent transition-colors">
                Accueil
              </Link>
              <Link href="/public/catalogue" className="text-sm hover:text-accent transition-colors">
                Nos biens
              </Link>
              <Link href="/blog" className="text-sm hover:text-accent transition-colors">
                Blog
              </Link>
              <Link href="/faq" className="text-sm hover:text-accent transition-colors">
                FAQ
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  Espace Client
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E4B850' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="border-accent text-accent mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Agence immobilière de confiance
              </Badge>
            </motion.div>
            
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl font-serif font-bold leading-tight"
            >
              Trouvez le bien immobilier de vos rêves
            </motion.h2>
            
            <motion.p variants={fadeIn} className="text-lg text-primary-foreground/90">
              Location, vente, résidences meublées — Découvrez notre sélection exclusive de biens immobiliers
            </motion.p>

            {/* Recherche rapide */}
            <motion.div variants={fadeIn}>
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl mt-8">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger className="md:w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="vente">Vente</SelectItem>
                        <SelectItem value="all">Tous</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Ville, quartier, référence..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1"
                    />

                    <Button onClick={handleSearch} className="bg-accent text-primary hover:bg-accent/90 gap-2">
                      <Search className="w-4 h-4" />
                      Rechercher
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Biens en vedette */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Sélection Premium
              </Badge>
              <h3 className="text-3xl font-serif font-bold mb-4">Biens en vedette</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre sélection de biens d'exception
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProperties.map((property, index) => (
                <motion.div key={property.id} variants={fadeIn}>
                  <Link href={`/public/properties/${property.id}`}>
                    <motion.div
                      variants={scaleOnHover}
                      initial="rest"
                      whileHover="hover"
                    >
                      <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                          {property.photos && property.photos.length > 0 ? (
                            <motion.img
                              src={property.photos[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-16 h-16 text-muted-foreground/30" />
                            </div>
                          )}
                          <Badge className="absolute top-3 right-3 bg-accent text-primary">
                            VEDETTE
                          </Badge>
                        </div>

                        <CardHeader>
                          <CardTitle className="line-clamp-1 group-hover:text-accent transition-colors">
                            {property.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.city}
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="capitalize">{property.property_type}</span>
                              <span>•</span>
                              <span>{property.rooms} pièces</span>
                              <span>•</span>
                              <span>{property.surface_area} m²</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-accent" />
                              <span className="text-2xl font-bold text-accent">
                                {property.price.toLocaleString()} FCFA
                              </span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {property.transaction_type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Biens récents */}
      <section className="py-16">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-serif font-bold mb-4">Biens récents</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les dernières opportunités immobilières disponibles
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <motion.p
                className="text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Chargement des biens...
              </motion.p>
            </div>
          ) : recentProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun bien disponible pour le moment</p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {recentProperties.map((property) => (
                <motion.div key={property.id} variants={fadeIn}>
                  <Link href={`/public/properties/${property.id}`}>
                    <motion.div
                      variants={scaleOnHover}
                      initial="rest"
                      whileHover="hover"
                    >
                      <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                          {property.photos && property.photos.length > 0 ? (
                            <motion.img
                              src={property.photos[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-16 h-16 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        <CardHeader>
                          <CardTitle className="line-clamp-1 group-hover:text-accent transition-colors">
                            {property.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.city}
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

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-accent" />
                              <span className="text-xl font-bold text-accent">
                                {property.price.toLocaleString()} FCFA
                              </span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {property.transaction_type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/public/catalogue">
              <Button size="lg" className="bg-accent text-primary hover:bg-accent/90">
                Voir tous les biens
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-primary text-primary-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-serif font-bold">Besoin d'accompagnement ?</h3>
            <p className="text-lg text-primary-foreground/90">
              Notre équipe est à votre disposition pour vous aider dans votre recherche
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary gap-2">
                <Phone className="w-4 h-4" />
                +221 XX XXX XX XX
              </Button>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 gap-2 w-full sm:w-auto">
                  <Mail className="w-4 h-4" />
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo-icon.svg" alt="IMMO360" className="w-8 h-8" />
                <span className="font-serif font-bold text-lg">IMMO360</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Votre partenaire immobilier de confiance
              </p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} IMMO360. Tous droits réservés.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <div className="space-y-2 text-sm">
                <Link href="/public" className="block text-muted-foreground hover:text-accent transition-colors">
                  Accueil
                </Link>
                <Link href="/public/catalogue" className="block text-muted-foreground hover:text-accent transition-colors">
                  Catalogue
                </Link>
                <Link href="/blog" className="block text-muted-foreground hover:text-accent transition-colors">
                  Blog
                </Link>
                <Link href="/faq" className="block text-muted-foreground hover:text-accent transition-colors">
                  FAQ
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Location</p>
                <p>Vente</p>
                <p>Gestion locative</p>
                <p>Évaluation immobilière</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>contact@immo360.com</p>
                <p>+221 XX XXX XX XX</p>
                <p>Dakar, Sénégal</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}