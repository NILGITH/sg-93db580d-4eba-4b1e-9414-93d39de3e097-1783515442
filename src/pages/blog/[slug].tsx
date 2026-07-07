import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  async function loadPost() {
    try {
      const slugString = Array.isArray(slug) ? slug[0] : slug;
      
      const { data: postData } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slugString)
        .eq("published", true)
        .single();

      if (postData) {
        setPost(postData);

        // Charger articles similaires
        const { data: related } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("category", postData.category)
          .eq("published", true)
          .neq("id", postData.id)
          .limit(3);

        setRelatedPosts(related || []);
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || "",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white border-b">
          <div className="container py-4">
            <Link href="/public">
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-12 w-auto" />
            </Link>
          </div>
        </header>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-primary/90">
              Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    );
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

      {/* Article */}
      <article className="py-12">
        <div className="container max-w-4xl">
          {/* Back button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Button>
          </Link>

          {/* Header article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Badge className="bg-primary text-white text-sm">
                  {post.category}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at || post.created_at!)}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}

            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>AMIRI</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </motion.div>

          {/* Image de couverture */}
          {post.cover_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-auto"
              />
            </motion.div>
          )}

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* CTA */}
          <Card className="bg-gradient-premium text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Intéressé par nos services ?</h3>
              <p className="mb-6 opacity-90">Découvrez nos biens disponibles</p>
              <Link href="/public/catalogue">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Voir le catalogue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </article>

      {/* Articles similaires */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <Card className="card-property h-full hover:scale-105 transition-transform duration-300 bg-white">
                    {related.cover_image_url && (
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={related.cover_image_url}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{related.title}</h3>
                      {related.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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