import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Authentification échouée");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Profil utilisateur introuvable");
      }

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${profile.first_name} ${profile.last_name}`,
      });

      switch (profile.role) {
        case "admin":
        case "agent":
        case "secretary":
        case "accountant":
          router.push("/dashboard");
          break;
        case "provider":
          router.push("/provider/missions");
          break;
        case "owner":
          router.push("/owner");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-serif text-primary">IMMO360</CardTitle>
              <CardDescription className="text-base mt-2">
                Gestion Immobilière Professionnelle
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              disabled={loading}
            >
              {loading ? (
                "Connexion en cours..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Vous êtes propriétaire ?{" "}
              <span className="text-accent font-medium">
                Vos identifiants vous ont été envoyés par email
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}