import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, ExternalLink, Info } from "lucide-react";
import { isInDemoMode } from "@/lib/mock-data";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [networkError, setNetworkError] = useState(false);

  function validateEmail(value: string) {
    if (!value) {
      setEmailError("Email requis");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Email invalide");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword(value: string) {
    if (!value) {
      setPasswordError("Mot de passe requis");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("8 caractères minimum");
      return false;
    }
    setPasswordError("");
    return true;
  }

  function fillTestAccount(type: "admin" | "agent") {
    if (type === "admin") {
      setEmail("admin@immo360.com");
      setPassword("Admin123!");
    } else {
      setEmail("agent1@immo360.com");
      setPassword("Agent123!");
    }
    setEmailError("");
    setPasswordError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid || !passwordValid) {
      return;
    }

    setLoading(true);
    setNetworkError(false);

    try {
      const { user, profile } = await authService.login({
        email,
        password,
      });

      // Vérifier si mode démo activé
      const isDemoMode = localStorage.getItem("demo_mode_active") === "true";

      if (isDemoMode) {
        toast({
          title: "🎭 Mode Démo Activé",
          description: `Bienvenue ${profile.first_name} ! Application en mode démonstration avec données mockées.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "✅ Connexion réussie",
          description: `Bienvenue ${profile.first_name} ${profile.last_name}`,
        });
      }

      // Redirection selon le rôle
      setTimeout(() => {
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
      const isNetworkError =
        error.message?.includes("fetch") ||
        error.message?.includes("network") ||
        error.message?.includes("Failed to fetch");

      if (isNetworkError) {
        setNetworkError(true);
        toast({
          title: "⚠️ Problème de connexion",
          description: "Utilisez les boutons 'Test Admin' ou 'Test Agent' pour activer le mode démo avec données mockées.",
          variant: "destructive",
          duration: 8000,
        });
      } else {
        toast({
          title: "❌ Erreur de connexion",
          description: error.message || "Identifiants incorrects. Vérifiez votre email et mot de passe.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-4">
            <motion.img 
              src="/logo_Amiri.png" 
              alt="AMIRI" 
              className="h-16 w-auto mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            />
            <div>
              <CardTitle className="text-2xl font-serif">Connexion</CardTitle>
              <CardDescription>
                Accédez à votre espace AMIRI
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              {networkError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <p className="font-semibold mb-2">💡 Mode Démo Disponible</p>
                    <p className="mb-2">Connexion Supabase indisponible en développement.</p>
                    <p className="text-xs">
                      <strong>Solution :</strong> Cliquez sur <strong>"Test Admin"</strong> ou <strong>"Test Agent"</strong> ci-dessous pour activer le mode démo avec données mockées. Vous pourrez explorer toute l'application !
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@immo360.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    className={`pl-10 ${emailError ? "border-destructive" : ""}`}
                    disabled={loading}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={(e) => validatePassword(e.target.value)}
                    className={`pl-10 pr-10 ${passwordError ? "border-destructive" : ""}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Rester connecté
                  </Label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Fonctionnalité à venir",
                      description: "La réinitialisation du mot de passe sera bientôt disponible",
                    });
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillTestAccount("admin")}
                    disabled={loading}
                  >
                    Test Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillTestAccount("agent")}
                    disabled={loading}
                  >
                    Test Agent
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Créer un compte
                </Link>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                <Link href="/public" className="hover:underline">
                  Retour au site public
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}