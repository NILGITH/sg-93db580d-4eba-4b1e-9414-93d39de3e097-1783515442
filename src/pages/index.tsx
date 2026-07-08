import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si un profil est déjà sélectionné
    const demoUser = localStorage.getItem("demo_user");
    const demoModeActive = localStorage.getItem("demo_mode_active") === "true";

    if (demoUser && demoModeActive) {
      // Rediriger vers le dashboard approprié
      try {
        const profile = JSON.parse(demoUser);
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
      } catch {
        router.push("/select-profile");
      }
    } else {
      // Pas de profil → sélecteur
      router.push("/select-profile");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}