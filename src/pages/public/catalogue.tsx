import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Search, MapPin, Home, DollarSign, Filter, SlidersHorizontal } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const PROPERTY_TYPES = ["appartement", "maison", "villa", "terrain", "bureau", "commerce", "immeuble", "studio"];

export default function PublicCataloguePage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    transaction_type: (router.query.transaction_type as string) || "all",
    property_type: "all",
    city: (router.query.query as string) || "",
    min_price: "",
    max_price: "",
    min_rooms: "",
    min_surface: "",
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  async function loadProperties() {
    try {
      setLoading(true);

      let query = supabase
        .from("properties")
        .select("*")
        .eq("published", true)
        .eq("status", "disponible")
        .order("created_at", { ascending: false });

      if (filters.transaction_type !== "all") {
        query = query.eq("transaction_type", filters.transaction_type);
      }
      if (filters.property_type !== "all") {
        query = query.eq("property_type", filters.property_type);
      }
      if (filters.city) {
        query = query.or(`city.ilike.%${filters.city}%,quartier.ilike.%${filters.city}%,commune.ilike.%${filters.city}%`);
      }
      if (filters.min_price) {
        query = query.gte("price", parseFloat(filters.min_price));
      }
      if (filters.max_price) {
        query = query.lte("price", parseFloat(filters.max_price));
      }
      if (filters.min_rooms) {
        query = query.gte("rooms", parseInt(filters.min_rooms));
      }
      if (filters.min_surface) {
        query = query.gte("surface_area", parseFloat(filters.min_surface));
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Erreur chargement biens:", error);
    } finally {
      setLoading(false);
    }
  }

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
              <Building2 className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-serif font-bold">IMMO360</h1>
                <p className="text-xs text-primary-foreground/80">Catalogue des biens</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/public" className="text-sm hover:text-accent transition-colors">
                Accueil
              </Link>
              <Link href="/public/catalogue" className="text-sm font-semibold text-accent">
                Nos biens
              </Link>
              <Link href="/public/blog" className="text-sm hover:text-accent transition-colors">
                Blog
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Catalogue des biens</h2>
            <p className="text-muted-foreground">
              {loading ? "Chargement..." : `${properties.length} bien${properties.length > 1 ? "s" : ""} disponible${properties.length > 1 ? "s" : ""}`}
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des biens...</p>
          </div>
        ) : properties.length === 0 ? (
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
            {properties.map((property) => (
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
                      {property.city} {property.quartier && `• ${property.quartier}`}
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
      </div>
    </div>
  );
}