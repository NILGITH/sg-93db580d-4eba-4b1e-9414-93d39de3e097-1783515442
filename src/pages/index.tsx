import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Users, FileText, TrendingUp, Shield, Clock, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-accent" />
              <span className="text-2xl font-serif font-bold text-primary">IMMO360</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm font-medium hover:text-accent transition-colors">Services</a>
              <a href="#fonctionnalites" className="text-sm font-medium hover:text-accent transition-colors">Fonctionnalités</a>
              <a href="#tarifs" className="text-sm font-medium hover:text-accent transition-colors">Tarifs</a>
              <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-accent hover:bg-accent/90">Essayer gratuitement</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
              La Plateforme SaaS de
              <span className="block text-accent">Gestion Immobilière</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Digitalisez l'ensemble de vos activités immobilières dans une seule plateforme collaborative. 
              Transparence totale, traçabilité complète, automatisation intelligente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold">
                  Démarrer gratuitement
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline">
                  Demander une démo
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>14 jours d'essai</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>Support 7j/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-serif font-bold">Nos Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une solution complète pour gérer tous les aspects de votre activité immobilière
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Gestion Locative",
                description: "Gérez vos biens, locataires, loyers et quittances en quelques clics. Automatisez les relances et encaissements."
              },
              {
                icon: Users,
                title: "CRM Intégré",
                description: "Suivez vos prospects, visites et réservations. Pipeline commercial complet de la première prise de contact à la signature."
              },
              {
                icon: FileText,
                title: "GED Centralisée",
                description: "Tous vos documents au même endroit : contrats, factures, photos, plans. Versioning automatique et partage sécurisé."
              },
              {
                icon: TrendingUp,
                title: "Tableaux de Bord",
                description: "Statistiques en temps réel, graphiques interactifs, indicateurs clés. Vue d'ensemble instantanée de votre activité."
              },
              {
                icon: Shield,
                title: "Multi-Agences",
                description: "Architecture SaaS multi-tenant. Isolation stricte des données par agence. RBAC granulaire pour chaque utilisateur."
              },
              {
                icon: Clock,
                title: "Automatisation",
                description: "Rapports mensuels automatiques, notifications temps réel, relances programmées. Gagnez un temps précieux."
              }
            ].map((service, i) => (
              <Card key={i} className="border-border hover:border-accent transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section */}
      <section id="fonctionnalites" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-serif font-bold">Fonctionnalités Complètes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer votre patrimoine immobilier
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Gestion des biens et mandats",
              "Portail propriétaire dédié",
              "Module interventions/travaux",
              "Encaissement multi-moyens",
              "Rapports automatiques PDF",
              "Notifications temps réel",
              "Catalogue public des biens",
              "Mobile responsive",
              "API REST complète",
              "Export comptable",
              "Historique complet",
              "Support prioritaire"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-serif font-bold">Tarifs Simples et Transparents</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez le plan adapté à votre agence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "49",
                description: "Pour les petites agences",
                features: [
                  "Jusqu'à 50 biens",
                  "3 utilisateurs",
                  "Modules essentiels",
                  "Support email",
                  "Stockage 10 Go"
                ]
              },
              {
                name: "Pro",
                price: "149",
                description: "Pour les agences en croissance",
                features: [
                  "Jusqu'à 200 biens",
                  "10 utilisateurs",
                  "Tous les modules",
                  "Support prioritaire",
                  "Stockage 50 Go",
                  "API complète"
                ],
                highlighted: true
              },
              {
                name: "Enterprise",
                price: "Sur mesure",
                description: "Pour les grandes structures",
                features: [
                  "Biens illimités",
                  "Utilisateurs illimités",
                  "Modules personnalisés",
                  "Support dédié 24/7",
                  "Stockage illimité",
                  "SLA garanti"
                ]
              }
            ].map((plan, i) => (
              <Card key={i} className={`border-border ${plan.highlighted ? 'border-accent border-2 shadow-lg' : ''}`}>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-serif font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-accent">{plan.price}</span>
                    {plan.price !== "Sur mesure" && <span className="text-muted-foreground">€/mois</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup">
                    <Button className={`w-full ${plan.highlighted ? 'bg-accent hover:bg-accent/90' : ''}`} variant={plan.highlighted ? "default" : "outline"}>
                      {plan.price === "Sur mesure" ? "Nous contacter" : "Commencer"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-serif font-bold">Contactez-nous</h2>
              <p className="text-lg text-muted-foreground">
                Une question ? Notre équipe est là pour vous accompagner
              </p>
            </div>
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nom complet</label>
                    <Input placeholder="Jean Dupont" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="jean@example.com" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Téléphone</label>
                    <Input type="tel" placeholder="+33 6 12 34 56 78" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Votre message..." rows={5} className="mt-2" />
                  </div>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90">
                  Envoyer le message
                </Button>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: Mail, label: "Email", value: "contact@immo360.fr" },
                { icon: Phone, label: "Téléphone", value: "+33 1 23 45 67 89" },
                { icon: MapPin, label: "Adresse", value: "Paris, France" }
              ].map((contact, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <contact.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{contact.label}</div>
                    <div className="text-sm font-medium">{contact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-accent" />
                <span className="text-xl font-serif font-bold">IMMO360</span>
              </div>
              <p className="text-sm opacity-80">
                La plateforme SaaS de référence pour la gestion immobilière professionnelle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>© 2026 IMMO360. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}