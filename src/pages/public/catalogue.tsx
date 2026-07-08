import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockProperties } from "@/lib/mock-data";
import { Building2, Search, MapPin, Home, DollarSign, Filter, SlidersHorizontal, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const PROPERTY_TYPES = ["appartement", "maison", "villa", "terrain", "bureau", "commerce", "studio"];

export default function PublicCataloguePage() {
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    transaction_type: "all",
    property_type: "all",
    city: "",
    min_price: "",
    max_price: "",
    min_rooms: "",
    min_surface: "",
  });

  // Filtrer les biens publiés
  const filteredProperties = useMemo(() => {
    let result = mockProperties.filter(p => p.is_published && p.status === "disponible");

    if (filters.transaction_type !== "all") {
      result = result.filter(p => p.transaction_type === filters.transaction_type);
    }
    if (filters.property_type !== "all") {
      result = result.filter(p => p.type === filters.property_type);
    }
    if (filters.city) {
      const searchLower = filters.city.toLowerCase();
      result = result.filter(p => 
        p.city.toLowerCase().includes(searchLower) ||
        p.commune.toLowerCase().includes(searchLower) ||
        p.neighborhood.toLowerCase().includes(searchLower)
      );
    }
    if (filters.min_price) {
      result = result.filter(p => p.price >= parseFloat(filters.min_price));
    }
    if (filters.max_price) {
      result = result.filter(p => p.price <= parseFloat(filters.max_price));
    }
    if (filters.min_rooms) {
      result = result.filter(p => p.rooms >= parseInt(filters.min_rooms));
    }
    if (filters.min_surface) {
      result = result.filter(p => p.surface >= parseFloat(filters.min_surface));
    }

    return result;
  }, [filters]);

  function resetFilters() {
    setFilters({
      transaction_type: "all",
      property_type: "all",
      city: "",
      min_price: "",
      max_price: "",
      min_rooms: "",
      min_surface: "",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3">
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-serif font-bold">AMIRI</h1>
                <p className="text-xs text-primary-foreground/80">Catalogue des biens</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/public" className="text-sm hover:text-accent transition-colors">
                Accueil
              </Link>
              <Link href="/public/catalogue" className="text-sm font-semibold text-accent">
                Catalogue
              </Link>
              <Link href="/blog" className="text-sm hover:text-accent transition-colors">
                Blog
              </Link>
              <Link href="/faq" className="text-sm hover:text-accent transition-colors">
                FAQ
              </Link>
              <Link href="/select-profile">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  Espace Pro
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Catalogue des biens</h2>
            <p className="text-muted-foreground">
              {filteredProperties.length} bien{filteredProperties.length > 1 ? "s" : ""} disponible{filteredProperties.length > 1 ? "s" : ""}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </Button>
        </div>

        {/* Filtres */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres de recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction</label>
                  <Select
                    value={filters.transaction_type}
                    onValueChange={(value) => setFilters({ ...filters, transaction_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="vente">Vente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de bien</label>
                  <Select
                    value={filters.property_type}
                    onValueChange={(value) => setFilters({ ...filters, property_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ville / Quartier</label>
                  <Input
                    placeholder="Rechercher..."
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix min (FCFA)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.min_price}
                    onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix max (FCFA)</label>
                  <Input
                    type="number"
                    placeholder="Illimité"
                    value={filters.max_price}
                    onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pièces min</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.min_rooms}
                    onChange={(e) => setFilters({ ...filters, min_rooms: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Surface min (m²)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.min_surface}
                    onChange={(e) => setFilters({ ...filters, min_surface: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={resetFilters} variant="outline" className="gap-2">
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des biens */}
        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Aucun bien ne correspond à vos critères</p>
              <Button onClick={resetFilters} variant="outline">
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/public/properties/${property.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <img
                      src={property.images?.[0] || "/generated/property-1.png"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-1 group-hover:text-accent transition-colors">
                      {property.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {property.city}, {property.commune}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="capitalize">{property.type}</span>
                      <span>•</span>
                      <span>{property.rooms} pièces</span>
                      <span>•</span>
                      <span>{property.surface} m²</span>
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
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-serif font-bold text-xl mb-4">AMIRI</h4>
              <p className="text-sm text-primary-foreground/80">
                Votre partenaire de confiance pour tous vos projets immobiliers
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Navigation</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/public" className="hover:text-accent transition-colors">Accueil</Link></li>
                <li><Link href="/public/catalogue" className="hover:text-accent transition-colors">Catalogue</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +229 XX XX XX XX
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@amiri.bj
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Cotonou, Bénin
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Réseaux Sociaux</h5>
              <div className="flex gap-4">
                <Button size="icon" variant="outline" className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
            <p>&copy; 2026 AMIRI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}