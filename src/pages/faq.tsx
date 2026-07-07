import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";

type FaqItem = Database["public"]["Tables"]["faq_items"]["Row"];

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadFaqItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, faqItems]);

  async function loadFaqItems() {
    try {
      const { data } = await supabase
        .from("faq_items")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });

      if (data) {
        setFaqItems(data);
        setFilteredItems(data);
      }
    } catch (error) {
      console.error("Error loading FAQ items:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterItems() {
    if (!searchQuery) {
      setFilteredItems(faqItems);
      return;
    }

    const filtered = faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }

  const categories = Array.from(new Set(faqItems.map((item) => item.category).filter(Boolean)));

  function getItemsByCategory(category: string | null) {
    return filteredItems.filter((item) => item.category === category);
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
              <Link href="/blog" className="text-sm text-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/faq" className="text-sm font-semibold text-primary">
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
            Questions Fréquentes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Trouvez rapidement les réponses à vos questions
          </motion.p>
        </div>
      </section>

      {/* Recherche */}
      <section className="py-12 bg-muted">
        <div className="container max-w-3xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </section>

      {/* FAQ par catégories */}
      <section className="py-20">
        <div className="container max-w-4xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement des questions...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune question trouvée.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const items = getItemsByCategory(category);
                if (items.length === 0) return null;

                return (
                  <motion.div
                    key={category || "general"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">{category || "Général"}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="border rounded-xl px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <AccordionTrigger className="text-left font-semibold hover:text-primary">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center bg-gradient-premium text-white p-12 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h3>
            <p className="mb-6 opacity-90">Notre équipe est à votre disposition pour répondre à toutes vos questions</p>
            <Link href="/auth/login">
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Nous contacter
              </button>
            </Link>
          </motion.div>
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