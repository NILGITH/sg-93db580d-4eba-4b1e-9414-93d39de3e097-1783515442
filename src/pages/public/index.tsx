import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Search,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Property {
  id: string;
  reference: string;
  type: string;
  status: string;
  transaction_type: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  rooms: number;
  surface: number;
  photos: string[];
}

export default function PublicHome() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrousel 1 : Hero Banner
  const [emblaRef1] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  
  // Carrousel 2 : Biens en vedette
  const [emblaRef2, emblaApi2] = useEmblaCarousel({ loop: true, align: "start" });
  
  // Carrousel 3 : Nouveautés
  const [emblaRef3, emblaApi3] = useEmblaCarousel({ loop: true, align: "start" });
  
  // Carrousel 4 : Témoignages
  const [emblaRef4] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "disponible")
        .order("created_at", { ascending: false })
        .limit(8);

      if (data) {
        setFeaturedProperties(data.slice(0, 4));
        setRecentProperties(data.slice(4, 8));
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  }

  const heroSlides = [
    {
      title: "Trouvez votre bien idéal",
      subtitle: "Plus de 50 biens disponibles à Dakar et ses environs",
      image: "/generated/property-1.png",
      cta: "Voir le catalogue"
    },
    {
      title: "Investissez dans l'immobilier",
      subtitle: "Des opportunités uniques pour développer votre patrimoine",
      image: "/generated/property-2.png",
      cta: "Nos offres"
    },
    {
      title: "Location et vente",
      subtitle: "Accompagnement personnalisé pour tous vos projets",
      image: "/generated/property-3.png",
      cta: "Nous contacter"
    },
    {
      title: "Gestion locative",
      subtitle: "Confiez-nous la gestion de vos biens en toute sérénité",
      image: "/generated/property-4.png",
      cta: "En savoir plus"
    }
  ];

  const testimonials = [
    {
      name: "Fatou Diop",
      role: "Propriétaire",
      content: "Service exceptionnel ! AMIRI a trouvé des locataires sérieux pour ma villa en moins de 2 semaines.",
      rating: 5
    },
    {
      name: "Moussa Ndiaye",
      role: "Locataire",
      content: "Équipe professionnelle et à l'écoute. J'ai trouvé l'appartement de mes rêves grâce à eux.",
      rating: 5
    },
    {
      name: "Aïssatou Ba",
      role: "Investisseur",
      content: "Un accompagnement de qualité pour mon investissement immobilier. Je recommande vivement.",
      rating: 5
    }
  ];

  function formatPrice(price: number) {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  }

  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case "disponible":
        return "default";
      case "reserve":
        return "secondary";
      case "loue":
        return "outline";
      case "vendu":
        return "destructive";
      default:
        return "default";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b sticky top-0 z-50 shadow-sm"
      >
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3">
              <img
                src="/logo_Amiri.png"
                alt="AMIRI"
                className="h-12 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/public" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                Accueil
              </Link>
              <Link href="/public/catalogue" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                Nos biens
              </Link>
              <Link href="/blog" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                Blog
              </Link>
              <Link href="/faq" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                FAQ
              </Link>
              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Espace Client
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Carrousel 1 : Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-[#FFF8EC]">
        <div className="embla" ref={emblaRef1}>
          <div className="embla__container flex">
            {heroSlides.map((slide, index) => (
              <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                <div className="container py-20 md:py-32">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="space-y-6"
                    >
                      <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl text-muted-foreground">
                        {slide.subtitle}
                      </p>
                      <div className="flex gap-4">
                        <Link href="/public/catalogue">
                          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                            {slide.cta}
                          </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                          Nous contacter
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="relative"
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="rounded-2xl shadow-2xl w-full h-auto"
                      />
                      <div className="absolute -bottom-6 -right-6 bg-gradient-premium text-white p-6 rounded-xl shadow-lg">
                        <p className="text-3xl font-bold">50+</p>
                        <p className="text-sm">Biens disponibles</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recherche rapide */}
      <section className="py-12 bg-muted">
        <div className="container">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Input placeholder="Type de bien..." className="border-border" />
                <Input placeholder="Ville..." className="border-border" />
                <Input placeholder="Budget max..." type="number" className="border-border" />
                <Link href="/public/catalogue" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Carrousel 2 : Biens en vedette */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Biens en vedette</h2>
              <p className="text-muted-foreground">Nos meilleures offres du moment</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi2?.scrollPrev()}
                className="border-border"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi2?.scrollNext()}
                className="border-border"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="embla overflow-hidden" ref={emblaRef2}>
            <div className="embla__container flex gap-6">
              {featuredProperties.map((property) => (
                <div key={property.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                  <Link href={`/public/properties/${property.id}`}>
                    <Card className="card-property h-full hover:scale-105 transition-transform duration-300">
                      <div className="relative">
                        <img
                          src={property.photos?.[0] || "/generated/property-1.png"}
                          alt={property.title}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <Badge className="absolute top-3 right-3 bg-secondary text-white">
                          {property.transaction_type === "vente" ? "À vendre" : "À louer"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{property.address}, {property.city}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.rooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{property.surface}m²</span>
                          </div>
                        </div>
                        <p className="text-2xl font-price text-secondary">{formatPrice(property.price)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carrousel 3 : Nouveautés */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dernières nouveautés</h2>
              <p className="text-muted-foreground">Les biens ajoutés récemment</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi3?.scrollPrev()}
                className="border-border bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi3?.scrollNext()}
                className="border-border bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="embla overflow-hidden" ref={emblaRef3}>
            <div className="embla__container flex gap-6">
              {recentProperties.map((property) => (
                <div key={property.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                  <Link href={`/public/properties/${property.id}`}>
                    <Card className="card-property h-full hover:scale-105 transition-transform duration-300 bg-white">
                      <div className="relative">
                        <img
                          src={property.photos?.[0] || "/generated/property-2.png"}
                          alt={property.title}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <Badge className="absolute top-3 left-3 bg-primary text-white">
                          Nouveau
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{property.address}, {property.city}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.rooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{property.surface}m²</span>
                          </div>
                        </div>
                        <p className="text-2xl font-price text-secondary">{formatPrice(property.price)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Carrousel 4 : Témoignages */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Ce que disent nos clients</h2>
            <p className="text-muted-foreground">Ils nous font confiance</p>
          </div>

          <div className="embla max-w-3xl mx-auto" ref={emblaRef4}>
            <div className="embla__container flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 px-4">
                  <Card className="border-2 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-lg text-muted-foreground mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-premium text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à trouver votre prochain bien ?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Notre équipe est à votre disposition pour vous accompagner
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/public/catalogue">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Building2 className="w-5 h-5 mr-2" />
                Voir nos biens
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Nous appeler
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#6E4A24] text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-10 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm opacity-90 mb-4">
                Votre partenaire immobilier de confiance
              </p>
              <p className="text-xs opacity-75">
                © {new Date().getFullYear()} AMIRI. Tous droits réservés.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <div className="space-y-2 text-sm">
                <Link href="/public" className="block opacity-90 hover:text-primary transition-colors">
                  Accueil
                </Link>
                <Link href="/public/catalogue" className="block opacity-90 hover:text-primary transition-colors">
                  Catalogue
                </Link>
                <Link href="/blog" className="block opacity-90 hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="/faq" className="block opacity-90 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm opacity-90">
                <p>Location</p>
                <p>Vente</p>
                <p>Gestion locative</p>
                <p>Évaluation immobilière</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <a href="mailto:contact@amiri.sn" className="block opacity-90 hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@amiri.sn
                </a>
                <a href="tel:+221XXXXXXXXX" className="block opacity-90 hover:text-primary transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +221 XX XXX XX XX
                </a>
                <p className="opacity-90 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dakar, Sénégal
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}