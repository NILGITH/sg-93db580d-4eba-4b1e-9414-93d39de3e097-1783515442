import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Copy, Sparkles, Wand2, Type, Loader2 } from "lucide-react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type PropertyContext = {
  type: string;
  surface: string;
  rooms: string;
  price: string;
  location: string;
  features: string;
};

export default function AIAssistantPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<"professional" | "warm" | "premium" | "commercial">("professional");
  const [propertyContext, setPropertyContext] = useState<PropertyContext>({
    type: "",
    surface: "",
    rooms: "",
    price: "",
    location: "",
    features: ""
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-assistant-history");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai-assistant-history", JSON.stringify(messages));
    }
  }, [messages]);

  async function handleSend(customPrompt?: string, action: "generate" | "improve" | "title" = "generate") {
    const prompt = customPrompt || input;
    if (!prompt.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const context = {
        type: propertyContext.type,
        surface: propertyContext.surface ? parseFloat(propertyContext.surface) : undefined,
        rooms: propertyContext.rooms ? parseInt(propertyContext.rooms) : undefined,
        price: propertyContext.price ? parseFloat(propertyContext.price) : undefined,
        location: propertyContext.location,
        features: propertyContext.features ? propertyContext.features.split(",").map(f => f.trim()) : []
      };

      const response = await fetch("/api/ai/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          propertyContext: context,
          tone,
          action
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la génération");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Erreur : ${error instanceof Error ? error.message : "Impossible de générer le texte"}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  function clearHistory() {
    setMessages([]);
    localStorage.removeItem("ai-assistant-history");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground py-6 shadow-lg">
        <div className="container mx-auto px-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </Link>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-accent" />
            Assistant IA - Rédaction d'annonces
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Générez des descriptions professionnelles en quelques secondes
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Contexte du bien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Type de bien</Label>
                <Input
                  placeholder="Appartement, Maison, Villa..."
                  value={propertyContext.type}
                  onChange={(e) => setPropertyContext({ ...propertyContext, type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Surface (m²)</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={propertyContext.surface}
                  onChange={(e) => setPropertyContext({ ...propertyContext, surface: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre de pièces</Label>
                <Input
                  type="number"
                  placeholder="4"
                  value={propertyContext.rooms}
                  onChange={(e) => setPropertyContext({ ...propertyContext, rooms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  placeholder="250000"
                  value={propertyContext.price}
                  onChange={(e) => setPropertyContext({ ...propertyContext, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Localisation</Label>
                <Input
                  placeholder="Centre-ville, Proche commerces..."
                  value={propertyContext.location}
                  onChange={(e) => setPropertyContext({ ...propertyContext, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Équipements (séparés par virgules)</Label>
                <Textarea
                  placeholder="Terrasse, Garage, Piscine, Cuisine équipée"
                  value={propertyContext.features}
                  onChange={(e) => setPropertyContext({ ...propertyContext, features: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Ton de rédaction</Label>
                <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professionnel</SelectItem>
                    <SelectItem value="warm">Chaleureux</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Actions rapides</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => handleSend("Génère une description complète attractive pour ce bien immobilier", "generate")}
                    disabled={loading}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Générer description
                  </Button>
                  <Button
                    onClick={() => handleSend("Suggère 3 titres accrocheurs pour cette annonce", "title")}
                    disabled={loading}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Suggérer titres
                  </Button>
                </div>
              </div>
              {messages.length > 0 && (
                <Button
                  onClick={clearHistory}
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                >
                  Effacer l'historique
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 flex flex-col h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle className="text-lg">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-accent" />
                    <p className="text-lg">Commencez une conversation</p>
                    <p className="text-sm mt-2">Remplissez le contexte du bien et posez votre question</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.role === "assistant" && (
                          <Button
                            onClick={() => copyToClipboard(message.content)}
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-8"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copier
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-6 bg-background">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Décrivez ce que vous souhaitez générer ou améliorer..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={2}
                    disabled={loading}
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="self-end"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}