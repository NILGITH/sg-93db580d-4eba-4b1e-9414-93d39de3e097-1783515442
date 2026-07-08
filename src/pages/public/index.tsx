import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProperties } from "@/lib/mock-data";
import { Search, MapPin, Home, Building2, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  
  // Biens publiés et vedettes
  const publishedProperties = mockProperties.filter(p => p.is_published);
  const featuredProperties = publishedProperties.slice(0, 3);
  const recentProperties = publishedProperties.slice(3, 9);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-serif font-bold">AMIRI</h1>
                <p className="text-xs text-primary-foreground/80">Votre partenaire immobilier</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="/public" className="hover:text-accent transition-colors">Accueil</Link>
              <Link href="/public/catalogue" className="hover:text-accent transition-colors">Catalogue</Link>
              <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
              <Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link>
            </nav>
            <Link href="/select-profile">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                Espace Pro
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              Trouvez le bien immobilier de vos rêves
            </h2>
            <p className="text-lg text-muted-foreground">
              Location et vente de biens immobiliers de qualité à Cotonou et environs
            </p>

            {/* Recherche */}
            <Card className="p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="md:col-span-2"
                />
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de bien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="bureau">Bureau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link href="/public/catalogue">
                <Button className="w-full mt-4" size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Biens à la une */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">
            Biens à la Une
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Link href={`/public/properties/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={property.images?.[0] || "/generated/property-1.png"}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 right-4 bg-accent text-white">
                        ⭐ Vedette
                      </Badge>
                    </div>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">{property.type}</Badge>
                        <Badge variant={property.transaction_type === "vente" ? "default" : "secondary"}>
                          {property.transaction_type === "vente" ? "À vendre" : "À louer"}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-lg line-clamp-1">{property.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.city}, {property.commune}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-muted-foreground">{property.rooms} pièces • {property.surface}m²</span>
                        <span className="text-xl font-bold text-primary">
                          {property.price.toLocaleString()} FCFA
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Biens récents */}
      <section className="py-16">
        <div className="container">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">
            Nouveautés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recentProperties.map((property) => (
              <Link key={property.id} href={`/public/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images?.[0] || "/generated/property-2.png"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">{property.type}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {property.transaction_type === "vente" ? "Vente" : "Location"}
                      </Badge>
                    </div>
                    <h4 className="font-semibold line-clamp-1">{property.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.city}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t text-sm">
                      <span className="text-muted-foreground">{property.rooms}p • {property.surface}m²</span>
                      <span className="font-bold text-primary">
                        {(property.price / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/public/catalogue">
              <Button size="lg" variant="outline">
                Voir tous les biens
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
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