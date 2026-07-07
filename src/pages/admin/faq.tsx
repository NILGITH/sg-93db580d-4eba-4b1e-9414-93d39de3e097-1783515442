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
import { Building2, Plus, Edit, Trash2, Eye, EyeOff, HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type FaqItem = Database["public"]["Tables"]["faq_items"]["Row"];
type FaqItemInsert = Database["public"]["Tables"]["faq_items"]["Insert"];

const CATEGORIES = ["general", "location", "vente", "paiements"];

const CATEGORY_LABELS: Record<string, string> = {
  general: "Général",
  location: "Location",
  vente: "Vente",
  paiements: "Paiements",
};

export default function AdminFaqPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);

  const [formData, setFormData] = useState<Partial<FaqItemInsert>>({
    question: "",
    answer: "",
    category: "general",
    order_index: 0,
    active: true,
  });

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
      loadFaqItems();
    }
  }, [user, profile]);

  async function loadFaqItems() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setFaqItems(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingItem(null);
    const maxOrder = faqItems.reduce((max, item) => Math.max(max, item.order_index || 0), 0);
    setFormData({
      question: "",
      answer: "",
      category: "general",
      order_index: maxOrder + 1,
      active: true,
    });
    setShowDialog(true);
  }

  function openEditDialog(item: FaqItem) {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      order_index: item.order_index,
      active: item.active,
    });
    setShowDialog(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("faq_items")
          .update({
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            order_index: formData.order_index,
            active: formData.active,
          })
          .eq("id", editingItem.id);

        if (error) throw error;

        toast({
          title: "Question modifiée",
          description: "La question a été modifiée avec succès",
        });
      } else {
        const { error } = await supabase.from("faq_items").insert({
          question: formData.question,
          answer: formData.answer,
          category: formData.category || "general",
          order_index: formData.order_index || 0,
          active: formData.active !== false,
        });

        if (error) throw error;

        toast({
          title: "Question créée",
          description: "La question a été créée avec succès",
        });
      }

      setShowDialog(false);
      loadFaqItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la question",
        variant: "destructive",
      });
    }
  }

  async function deleteItem(itemId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) return;

    try {
      const { error } = await supabase.from("faq_items").delete().eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Question supprimée",
        description: "La question a été supprimée avec succès",
      });

      loadFaqItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  }

  async function toggleActive(item: FaqItem) {
    try {
      const { error } = await supabase
        .from("faq_items")
        .update({ active: !item.active })
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: item.active ? "Question désactivée" : "Question activée",
        description: `La question a été ${item.active ? "désactivée" : "activée"} avec succès`,
      });

      loadFaqItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  }

  async function moveItem(item: FaqItem, direction: "up" | "down") {
    const currentIndex = faqItems.findIndex((i) => i.id === item.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= faqItems.length) return;

    const swapItem = faqItems[swapIndex];

    try {
      await supabase
        .from("faq_items")
        .update({ order_index: swapItem.order_index })
        .eq("id", item.id);

      await supabase
        .from("faq_items")
        .update({ order_index: item.order_index })
        .eq("id", swapItem.id);

      loadFaqItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réordonner les questions",
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

  // Grouper par catégorie
  const itemsByCategory = faqItems.reduce((acc, item) => {
    const category = item.category || "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Gestion de la FAQ</h1>
                <p className="text-sm text-primary-foreground/80">
                  Créer et gérer les questions fréquentes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={openCreateDialog}
                className="bg-accent text-primary hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle question
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
        ) : faqItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Aucune question créée</p>
              <Button onClick={openCreateDialog} className="bg-accent text-primary hover:bg-accent/90">
                Créer la première question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-serif font-bold">
                    {CATEGORY_LABELS[category] || category}
                  </h2>
                  <Badge variant="secondary">{items.length} questions</Badge>
                </div>

                <div className="space-y-2">
                  {items.map((item, index) => (
                    <Card key={item.id} className={!item.active ? "opacity-50" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-base">{item.question}</CardTitle>
                            <CardDescription className="mt-2 line-clamp-2">
                              {item.answer}
                            </CardDescription>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveItem(item, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveItem(item, "down")}
                              disabled={index === items.length - 1}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleActive(item)}
                            >
                              {item.active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog création/édition */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Modifier la question" : "Nouvelle question"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Modifier les informations de la question" : "Créer une nouvelle question FAQ"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        {CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Ex: Comment réserver un bien ?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Réponse *</Label>
                <Textarea
                  id="answer"
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Réponse détaillée à la question"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Ordre d'affichage</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">
                  Plus le nombre est bas, plus la question apparaît en haut
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Question active (visible sur le site)</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-accent text-primary hover:bg-accent/90">
                  {editingItem ? "Enregistrer" : "Créer la question"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}