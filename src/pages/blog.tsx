import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, Tag, Search, ArrowRight } from "lucide-react";

// Articles de blog mockés
const mockBlogPosts = [
  {
    id: "1",
    slug: "investir-immobilier-cotonou",
    title: "Pourquoi investir dans l'immobilier à Cotonou en 2026 ?",
    excerpt: "Découvrez les opportunités d'investissement immobilier dans la capitale économique du Bénin.",
    content: "",
    category: "Investissement",
    cover_image_url: "/generated/property-1.png",
    published: true,
    published_at: "2026-07-05T10:00:00Z",
    created_at: "2026-07-05T10:00:00Z",
  },
  {
    id: "2",
    slug: "guide-achat-premiere-maison",
    title: "Guide complet pour acheter votre première maison",
    excerpt: "Tous les conseils pour réussir votre premier achat immobilier sans stress.",
    content: "",
    category: "Guides",
    cover_image_url: "/generated/property-2.png",
    published: true,
    published_at: "2026-07-03T10:00:00Z",
    created_at: "2026-07-03T10:00:00Z",
  },
  {
    id: "3",
    slug: "tendances-immobilieres-2026",
    title: "Les tendances immobilières de 2026 au Bénin",
    excerpt: "Analyse des tendances du marché immobilier béninois pour cette année.",
    content: "",
    category: "Actualités",
    cover_image_url: "/generated/property-3.png",
    published: true,
    published_at: "2026-07-01T10:00:00Z",
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "4",
    slug: "location-meuble-avantages",
    title: "Location meublée : avantages et inconvénients",
    excerpt: "Tout savoir sur la location meublée avant de prendre votre décision.",
    content: "",
    category: "Guides",
    cover_image_url: "/generated/property-4.png",
    published: true,
    published_at: "2026-06-28T10:00:00Z",
    created_at: "2026-06-28T10:00:00Z",
  },
  {
    id: "5",
    slug: "vendre-bien-rapidement",
    title: "5 astuces pour vendre votre bien immobilier rapidement",
    excerpt: "Des conseils pratiques pour accélérer la vente de votre propriété.",
    content: "",
    category: "Conseils",
    cover_image_url: "/generated/property-5.png",
    published: true,
    published_at: "2026-06-25T10:00:00Z",
    created_at: "2026-06-25T10:00:00Z",
  },
  {
    id: "6",
    slug: "quartiers-investir-cotonou",
    title: "Les meilleurs quartiers où investir à Cotonou",
    excerpt: "Analyse des quartiers les plus prometteurs pour vos investissements.",
    content: "",
    category: "Investissement",
    cover_image_url: "/generated/property-6.png",
    published: true,
    published_at: "2026-06-22T10:00:00Z",
    created_at: "2026-06-22T10:00:00Z",
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState(mockBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState(mockBlogPosts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory]);

  function filterPosts() {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center gap-3">
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-12 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/public" className="text-sm text-foreground hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link href="/public/catalogue" className="text-sm text-foreground hover:text-primary transition-colors">
                Nos biens
              </Link>
              <Link href="/blog" className="text-sm font-semibold text-primary">
                Blog
              </Link>
              <Link href="/faq" className="text-sm text-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>

            <Link href="/select-profile">
              <Button variant="outline" size="sm">
                Espace Pro
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4"
          >
            Blog Immobilier
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Conseils, actualités et guides pour réussir vos projets immobiliers
          </motion.p>
        </div>
      </section>

      {/* Recherche et filtres */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                Tous
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category || null)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20">
        <div className="container">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement des articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun article trouvé.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                      {post.cover_image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {post.category && (
                            <Badge className="absolute top-3 right-3 bg-accent text-white">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.published_at || post.created_at!)}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-10 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm text-primary-foreground/80">Votre partenaire immobilier de confiance</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <div className="space-y-2 text-sm">
                <Link href="/public" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                  Accueil
                </Link>
                <Link href="/public/catalogue" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                  Catalogue
                </Link>
                <Link href="/blog" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                  Blog
                </Link>
                <Link href="/faq" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 mt-8 text-center text-sm text-primary-foreground/60">
            <p>&copy; 2026 AMIRI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}