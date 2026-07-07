import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Search, HelpCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type FaqItem = Database["public"]["Tables"]["faq_items"]["Row"];

const CATEGORY_LABELS: Record<string, string> = {
  general: "Général",
  location: "Location",
  vente: "Vente",
  paiements: "Paiements",
};

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadFaqItems();
  }, []);

  async function loadFaqItems() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setFaqItems(data || []);
    } catch (error) {
      console.error("Erreur chargement FAQ:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = faqItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Grouper par catégorie
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category || "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Foire Aux Questions</h1>
                <p className="text-sm text-primary-foreground/80">
                  Trouvez des réponses à vos questions
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                Retour au site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12">
        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              Toutes
            </Button>
            {Object.keys(CATEGORY_LABELS).map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
              >
                {CATEGORY_LABELS[cat]}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune question trouvée</p>
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

                <Accordion type="single" collapsible className="space-y-2">
                  {items.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="bg-card border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-20">
        <div className="container py-8">
          <div className="text-center">
            <p className="text-sm">&copy; 2026 IMMO360. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}