import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Search, MapPin, Bed, Bath, Square, Mail, Phone } from "lucide-react";

export default function PublicCatalogPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPublicProperties();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.property_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [searchTerm, properties]);

  async function loadPublicProperties() {
    try {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "disponible")
        .order("created_at", { ascending: false });

      setProperties(data ?? []);
      setFilteredProperties(data ?? []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-12 h-12 text-accent" />
              <div>
                <h1 className="text-4xl font-serif font-bold">IMMO360</h1>
                <p className="text-sm text-primary-foreground/80">
                  Votre plateforme immobilière de confiance
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/login">
                <Button variant="outline" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Découvrez nos biens disponibles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Parcourez notre catalogue de biens immobiliers sélectionnés avec soin.
            Trouvez le bien qui correspond à vos besoins.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ville, adresse ou type de bien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <Card className="text-center py-12 max-w-2xl mx-auto">
            <CardContent>
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun bien disponible</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Aucun bien ne correspond à votre recherche."
                  : "Nos biens sont actuellement tous réservés. Revenez bientôt !"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-2xl transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-serif text-lg group-hover:text-accent transition-colors">
                      {property.title}
                    </CardTitle>
                    <StatusBadge variant="available">
                      {property.status === "disponible" ? "Disponible" : "À vendre"}
                    </StatusBadge>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="w-3 h-3" />
                    {property.address}, {property.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms} ch
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms} sdb
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {property.surface_area}m²
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {property.property_type.replace("_", " ")}
                    </span>
                    <span className="text-2xl font-bold text-accent tabular-nums">
                      {property.price.toLocaleString()} €
                    </span>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Voir le détail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-center">
              Besoin d'accompagnement ?
            </CardTitle>
            <CardDescription className="text-center">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                contact@immo360.fr
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                +33 1 23 45 67 89
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-primary text-primary-foreground mt-16 py-8">
        <div className="container text-center">
          <p className="text-sm text-primary-foreground/80">
            © {new Date().getFullYear()} IMMO360 - Plateforme SaaS de Gestion Immobilière
          </p>
        </div>
      </footer>
    </div>
  );
}