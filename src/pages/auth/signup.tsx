import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, UserPlus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "agent" as "admin" | "agent" | "secretary" | "accountant" | "provider" | "owner",
  });
  const [loading, setLoading] = useState(false);

  if (profile && profile.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        role: formData.role,
      });

      if (profileError) throw profileError;

      toast({
        title: "Utilisateur créé avec succès",
        description: `${formData.firstName} ${formData.lastName} peut maintenant se connecter.`,
      });

      router.push("/admin/users");
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-2xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux utilisateurs
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl font-serif">Créer un utilisateur</CardTitle>
                <CardDescription>
                  Ajouter un membre de l'équipe ou un propriétaire
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSignup}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="agent">Agent Immobilier</SelectItem>
                    <SelectItem value="secretary">Secrétaire</SelectItem>
                    <SelectItem value="accountant">Comptable</SelectItem>
                    <SelectItem value="provider">Prestataire</SelectItem>
                    <SelectItem value="owner">Propriétaire</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.role === "admin" && "Accès complet à toute l'application"}
                  {formData.role === "agent" && "Gestion des biens, visites, locations, ventes"}
                  {formData.role === "secretary" && "Gestion des rendez-vous, prospects, contrats"}
                  {formData.role === "accountant" && "Gestion des paiements, loyers, rapports financiers"}
                  {formData.role === "provider" && "Accès aux missions et interventions affectées"}
                  {formData.role === "owner" && "Espace personnel : biens, loyers, interventions"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe temporaire *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  L'utilisateur devra changer ce mot de passe à sa première connexion
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/admin/users")}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  disabled={loading}
                >
                  {loading ? "Création en cours..." : "Créer l'utilisateur"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}