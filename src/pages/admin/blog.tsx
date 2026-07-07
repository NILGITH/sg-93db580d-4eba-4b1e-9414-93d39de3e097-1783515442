import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { FileUpload } from "@/components/FileUpload";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

const CATEGORIES = ["conseils", "actualites", "guides"];

export default function AdminBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPostInsert>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "conseils",
    cover_image_url: "",
    published: false,
  });

  const [uploadedImage, setUploadedImage] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      if (!["admin", "agent"].includes(profile.role)) {
        router.push("/dashboard");
        return;
      }
      loadPosts();
    }
  }, [user, profile]);

  async function loadPosts() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "conseils",
      cover_image_url: "",
      published: false,
    });
    setShowDialog(true);
  }

  function openEditDialog(post: BlogPost) {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      cover_image_url: post.cover_image_url,
      published: post.published,
    });
    setShowDialog(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            cover_image_url: uploadedImage || editingPost.cover_image_url,
            published: formData.published,
            published_at: formData.published && !editingPost.published ? new Date().toISOString() : editingPost.published_at,
          })
          .eq("id", editingPost.id);

        if (error) throw error;

        toast({
          title: "Article modifié",
          description: "L'article a été modifié avec succès",
        });
      } else {
        const { error } = await supabase.from("blog_posts").insert({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category || "conseils",
          cover_image_url: uploadedImage,
          published: formData.published,
          published_at: formData.published ? new Date().toISOString() : null,
          author_id: user?.id,
        });

        if (error) throw error;

        toast({
          title: "Article créé",
          description: "L'article a été créé avec succès",
        });
      }

      setShowDialog(false);
      setUploadedImage("");
      loadPosts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'article",
        variant: "destructive",
      });
    }
  }

  async function deletePost(postId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postId);

      if (error) throw error;

      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès",
      });

      loadPosts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  }

  async function togglePublished(post: BlogPost) {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          published: !post.published,
          published_at: !post.published ? new Date().toISOString() : post.published_at,
        })
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: post.published ? "Article dépublié" : "Article publié",
        description: `L'article a été ${post.published ? "dépublié" : "publié"} avec succès`,
      });

      loadPosts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  }

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Gestion du Blog</h1>
                <p className="text-sm text-primary-foreground/80">
                  Créer et gérer les articles de blog
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={openCreateDialog}
                className="bg-accent text-primary hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel article
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  Tableau de bord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Aucun article créé</p>
              <Button onClick={openCreateDialog} className="bg-accent text-primary hover:bg-accent/90">
                Créer le premier article
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                {post.cover_image_url && (
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {post.category}
                    </Badge>
                    <Badge variant={post.published ? "default" : "outline"} className="text-xs">
                      {post.published ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  {post.excerpt && (
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEditDialog(post)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublished(post)}
                    >
                      {post.published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog création/édition */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
              <DialogDescription>
                {editingPost ? "Modifier les informations de l'article" : "Créer un nouvel article de blog"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de l'article"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="mon-article-blog"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Résumé court de l'article"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu complet de l'article (Markdown supporté)"
                  rows={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Image de couverture</Label>
                <FileUpload
                  bucket="blog"
                  accept="image/*"
                  onUploadComplete={(urls) => setUploadedImage(urls[0])}
                  existingFiles={uploadedImage ? [uploadedImage] : editingPost?.cover_image_url ? [editingPost.cover_image_url] : []}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Publier l'article</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-accent text-primary hover:bg-accent/90">
                  {editingPost ? "Enregistrer" : "Créer l'article"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}