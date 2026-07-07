import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Search, MapPin, Home, DollarSign, Maximize, Sparkles, Phone, Mail } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

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
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-serif font-bold">IMMO360</h1>
                <p className="text-xs text-primary-foreground/80">Votre partenaire immobilier</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/public" className="text-sm hover:text-accent transition-colors">
                Accueil
              </Link>
              <Link href="/public/catalogue" className="text-sm hover:text-accent transition-colors">
                Nos biens
              </Link>
              <Link href="/public/blog" className="text-sm hover:text-accent transition-colors">
                Blog
              </Link>
              <Link href="/public/contact" className="text-sm hover:text-accent transition-colors">
                Contact
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="border-accent text-accent mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Agence immobilière de confiance
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Trouvez le bien immobilier de vos rêves
            </h2>
            
            <p className="text-lg text-primary-foreground/90">
              Location, vente, résidences meublées — Découvrez notre sélection exclusive de biens immobiliers
            </p>

            {/* Recherche rapide */}
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
          </div>
        </div>
      </section>

      {/* Biens en vedette */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Sélection Premium
              </Badge>
              <h3 className="text-3xl font-serif font-bold mb-4">Biens en vedette</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre sélection de biens d'exception
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <Link key={property.id} href={`/public/properties/${property.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      {property.photos && property.photos.length > 0 ? (
                        <img
                          src={property.photos[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Biens récents */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold mb-4">Biens récents</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les dernières opportunités immobilières disponibles
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des biens...</p>
            </div>
          ) : recentProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun bien disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <Link key={property.id} href={`/public/properties/${property.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      {property.photos && property.photos.length > 0 ? (
                        <img
                          src={property.photos[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/public/catalogue">
              <Button size="lg" className="bg-accent text-primary hover:bg-accent/90">
                Voir tous les biens
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-serif font-bold">Besoin d'accompagnement ?</h3>
            <p className="text-lg text-primary-foreground/90">
              Notre équipe est à votre disposition pour vous aider dans votre recherche
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary gap-2">
                <Phone className="w-4 h-4" />
                Nous appeler
              </Button>
              <Link href="/public/contact">
                <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 gap-2 w-full sm:w-auto">
                  <Mail className="w-4 h-4" />
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-accent" />
                <span className="font-serif font-bold text-lg">IMMO360</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Votre agence immobilière de confiance
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
                <Link href="/public/blog" className="block text-muted-foreground hover:text-accent transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Location</p>
                <p className="text-muted-foreground">Vente</p>
                <p className="text-muted-foreground">Gestion locative</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>contact@immo360.com</p>
                <p>+XXX XX XX XX XX</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} IMMO360. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}