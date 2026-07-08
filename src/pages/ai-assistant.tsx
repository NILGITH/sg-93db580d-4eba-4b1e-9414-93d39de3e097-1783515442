import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Send,
  Home,
  LogOut,
  Lightbulb,
  TrendingUp,
  FileText,
  Building2,
} from "lucide-react";

// Suggestions prédéfinies
const suggestions = [
  {
    icon: Building2,
    title: "Générer une description",
    prompt: "Génère une description attractive pour une villa moderne de 4 pièces à Cocody avec piscine et jardin.",
  },
  {
    icon: TrendingUp,
    title: "Analyse de marché",
    prompt: "Donne-moi une analyse du marché immobilier à Abidjan pour les appartements haut standing.",
  },
  {
    icon: FileText,
    title: "Rédiger un contrat",
    prompt: "Aide-moi à rédiger les clauses importantes d'un contrat de location meublée.",
  },
  {
    icon: Lightbulb,
    title: "Conseils investissement",
    prompt: "Quels sont les meilleurs quartiers pour investir dans l'immobilier locatif à Abidjan ?",
  },
];

export default function AIAssistant() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, loading: authLoading } = useProfile();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/select-profile");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      // Simulation de réponse IA
      setTimeout(() => {
        setResponse(
          "**Mode démo actif** - L'assistant IA n'est pas encore connecté à un modèle de langage.\n\n" +
          "Dans la version de production, cette fonctionnalité utilisera une API d'IA (OpenAI, Claude, etc.) pour générer des réponses personnalisées à vos questions immobilières.\n\n" +
          "**Exemples de fonctionnalités disponibles en production :**\n" +
          "- Génération de descriptions de biens attractives\n" +
          "- Analyse de marché et tendances immobilières\n" +
          "- Aide à la rédaction de contrats\n" +
          "- Conseils en investissement immobilier\n" +
          "- Estimation de prix de marché\n" +
          "- Recommandations personnalisées"
        );
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  function handleSuggestionClick(suggestionPrompt: string) {
    setPrompt(suggestionPrompt);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Assistant IA</h1>
                <p className="text-sm text-primary-foreground/80">
                  Votre copilote immobilier intelligent
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="border-accent text-accent hover:bg-accent hover:text-primary">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Info mode démo */}
          <Card className="bg-accent/10 border-accent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-accent border-accent">Mode Démo</Badge>
                <p className="text-sm text-muted-foreground">
                  L'assistant IA sera connecté à un modèle de langage en production
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {suggestion.prompt}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Formulaire */}
          <Card>
            <CardHeader>
              <CardTitle>Posez votre question</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Exemple : Génère une description pour un appartement 3 pièces..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button type="submit" disabled={loading || !prompt.trim()} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Génération en cours..." : "Envoyer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Réponse */}
          {response && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Réponse IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {response.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">
                      {line.startsWith('**') ? (
                        <strong>{line.replace(/\*\*/g, '')}</strong>
                      ) : line.startsWith('-') ? (
                        <span className="ml-4">{line}</span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}