import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";

// FAQ mockée
const mockFaqItems = [
  {
    id: "1",
    question: "Comment louer un bien via AMIRI ?",
    answer: "Pour louer un bien, consultez notre catalogue en ligne, sélectionnez la propriété qui vous intéresse, puis contactez-nous via le formulaire de demande de visite. Notre équipe vous accompagnera dans toutes les démarches.",
    category: "Location",
    active: true,
    order_index: 1,
  },
  {
    id: "2",
    question: "Quels sont les documents nécessaires pour louer ?",
    answer: "Vous devez fournir : une pièce d'identité valide, des justificatifs de revenus (3 derniers bulletins de salaire ou attestation d'employeur), un justificatif de domicile, et éventuellement une caution.",
    category: "Location",
    active: true,
    order_index: 2,
  },
  {
    id: "3",
    question: "Puis-je visiter un bien avant de louer ?",
    answer: "Absolument ! Nous encourageons les visites. Utilisez le formulaire en ligne pour demander un rendez-vous, et un de nos agents vous accompagnera lors de la visite.",
    category: "Location",
    active: true,
    order_index: 3,
  },
  {
    id: "4",
    question: "Comment acheter un bien immobilier ?",
    answer: "Parcourez nos biens à vendre, contactez-nous pour une visite, puis nos experts vous guideront dans le processus d'achat : négociation, vérifications légales, signature du contrat et transfert de propriété.",
    category: "Achat",
    active: true,
    order_index: 4,
  },
  {
    id: "5",
    question: "Proposez-vous des facilités de paiement ?",
    answer: "Oui, nous acceptons plusieurs modes de paiement : espèces, Mobile Money (via Kkiapay), virement bancaire et chèque. Des plans de paiement peuvent être discutés selon les biens.",
    category: "Paiement",
    active: true,
    order_index: 5,
  },
  {
    id: "6",
    question: "Les biens sont-ils meublés ?",
    answer: "Cela dépend du bien. Notre catalogue comprend des biens meublés, semi-meublés et non meublés. Les détails sont précisés sur chaque fiche produit.",
    category: "Location",
    active: true,
    order_index: 6,
  },
  {
    id: "7",
    question: "Puis-je réserver un bien en ligne ?",
    answer: "Oui ! Pour les locations courte durée (studios meublés, appartements de vacances), vous pouvez réserver directement en ligne avec paiement d'un acompte via Mobile Money.",
    category: "Réservation",
    active: true,
    order_index: 7,
  },
  {
    id: "8",
    question: "Que faire en cas de problème dans le logement ?",
    answer: "Contactez immédiatement notre service client. Nous disposons d'une équipe de prestataires qualifiés (plombiers, électriciens, etc.) pour intervenir rapidement.",
    category: "Service",
    active: true,
    order_index: 8,
  },
  {
    id: "9",
    question: "Les charges sont-elles incluses dans le loyer ?",
    answer: "Cela varie selon le bien. Certains loyers incluent l'eau et l'électricité, d'autres non. Cette information est clairement indiquée sur chaque fiche bien.",
    category: "Paiement",
    active: true,
    order_index: 9,
  },
  {
    id: "10",
    question: "Comment investir dans l'immobilier avec AMIRI ?",
    answer: "Nous accompagnons les investisseurs en proposant des biens rentables, une gestion locative complète, et des conseils personnalisés. Contactez notre équipe pour discuter de votre projet d'investissement.",
    category: "Investissement",
    active: true,
    order_index: 10,
  },
];

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState(mockFaqItems);
  const [filteredItems, setFilteredItems] = useState(mockFaqItems);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    filterItems();
  }, [searchQuery]);

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
      <section className="py-12 bg-muted/30">
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
                    <h2 className="text-2xl font-serif font-bold mb-6 text-primary">{category || "Général"}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="border rounded-xl px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <AccordionTrigger className="text-left font-semibold hover:text-accent">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
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
            className="mt-16 text-center bg-gradient-to-br from-primary to-accent text-white p-12 rounded-2xl shadow-xl"
          >
            <h3 className="text-2xl font-serif font-bold mb-4">Vous ne trouvez pas votre réponse ?</h3>
            <p className="mb-6 opacity-90 text-lg">Notre équipe est à votre disposition pour répondre à toutes vos questions</p>
            <Link href="/select-profile">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-0">
                Nous contacter
              </Button>
            </Link>
          </motion.div>
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