import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, Tag, Search, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, posts]);

  async function loadBlogPosts() {
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (data) {
        setPosts(data);
        setFilteredPosts(data);
      }
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  }

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
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-white to-[#FFF8EC] py-20">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
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
      <section className="py-12 bg-muted">
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
                className={selectedCategory === null ? "bg-primary hover:bg-primary/90" : ""}
              >
                Tous
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category || null)}
                  className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
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
                    <Card className="card-property h-full hover:scale-105 transition-transform duration-300">
                      {post.cover_image_url && (
                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          {post.category && (
                            <Badge className="absolute top-3 right-3 bg-primary text-white">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.published_at || post.created_at!)}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-primary" />
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
      <footer className="bg-[#6E4A24] text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-10 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm opacity-90">Votre partenaire immobilier de confiance</p>
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
          </div>
        </div>
      </footer>
    </div>
  );
}