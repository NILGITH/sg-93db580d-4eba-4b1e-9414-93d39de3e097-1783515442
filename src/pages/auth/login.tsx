import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, LogIn, Loader2, AlertCircle, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validateEmail(email: string) {
    if (!email) {
      setEmailError("L'email est requis");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Email invalide");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword(password: string) {
    if (!password) {
      setPasswordError("Le mot de passe est requis");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Minimum 6 caractères");
      return false;
    }
    setPasswordError("");
    return true;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);

    try {
      const { user, profile } = await authService.login({
        email,
        password,
      });

      toast({
        title: "✅ Connexion réussie",
        description: `Bienvenue ${profile.first_name} ${profile.last_name}`,
      });

      // Animation de transition
      setTimeout(() => {
        // Redirection selon le rôle
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
      }, 500);
    } catch (error: any) {
      console.error("Erreur login:", error);
      
      // Messages d'erreur contextuels
      let errorMessage = "Identifiants incorrects";
      if (error.message?.includes("Invalid login")) {
        errorMessage = "Email ou mot de passe incorrect. Vérifiez vos identifiants.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Votre email n'est pas confirmé. Vérifiez votre boîte mail.";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Problème de connexion. Vérifiez votre connexion internet.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast({
        title: "❌ Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center animate-in zoom-in duration-700">
              <Building2 className="w-10 h-10 text-accent" />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
              <CardTitle className="text-3xl font-serif text-primary">IMMO360</CardTitle>
              <CardDescription className="text-base mt-2">
                Gestion Immobilière Professionnelle
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                required
                disabled={loading}
                className={emailError ? "border-destructive" : ""}
              />
              {emailError && (
                <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link 
                  href="#" 
                  className="text-xs text-accent hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Mot de passe oublié ?",
                      description: "Contactez l'administrateur à admin@immo360.com",
                    });
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                required
                disabled={loading}
                className={passwordError ? "border-destructive" : ""}
              />
              {passwordError && (
                <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={loading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer select-none"
              >
                Rester connecté
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold transition-all duration-200 hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground mb-3">
                Comptes de test disponibles
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setEmail("admin@immo360.com");
                    setPassword("Admin123!");
                  }}
                  disabled={loading}
                >
                  <KeyRound className="w-3 h-3 mr-1" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setEmail("agent1@immo360.com");
                    setPassword("Agent123!");
                  }}
                  disabled={loading}
                >
                  <KeyRound className="w-3 h-3 mr-1" />
                  Agent
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Vous êtes propriétaire ?{" "}
              <span className="text-accent font-medium">
                Vos identifiants vous ont été envoyés par email
              </span>
            </p>
            
            <div className="w-full">
              <Link href="/auth/signup">
                <Button variant="ghost" className="w-full" type="button">
                  Créer un compte de test
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}