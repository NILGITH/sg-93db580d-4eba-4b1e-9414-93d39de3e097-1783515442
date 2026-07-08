import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { mockProperties } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Search, MapPin, Home, Eye } from "lucide-react";

export default function PropertiesPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();
  
  const [properties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || property.type === filterType;
    const matchesStatus = filterStatus === "all" || property.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Gestion des Biens</h1>
                <p className="text-sm text-primary-foreground/80">AMIRI - {properties.length} biens</p>
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
                placeholder="Rechercher par titre, adresse ou ville..."
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
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="bureau">Bureau</SelectItem>
                <SelectItem value="commerce">Commerce</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="loue">Loué</SelectItem>
                <SelectItem value="vendu">Vendu</SelectItem>
                <SelectItem value="reserve">Réservé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Aucun bien trouvé</p>
              <p className="text-sm text-muted-foreground mt-2">
                Essayez de modifier vos filtres
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  {property.photos && property.photos.length > 0 ? (
                    <img
                      src={property.photos[0]}
                      alt={property.title || ""}
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
                    <span className="truncate">{property.title}</span>
                    <span className="text-lg font-bold text-accent">
                      {property.price?.toLocaleString()} FCFA
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
                    <span className="capitalize">{property.type}</span>
                    <span>•</span>
                    <span>{property.rooms} pièces</span>
                    <span>•</span>
                    <span>{property.surface} m²</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/public/properties/${property.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Link>
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