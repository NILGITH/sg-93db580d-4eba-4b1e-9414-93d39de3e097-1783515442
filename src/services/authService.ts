import { supabase } from "@/integrations/supabase/client";
import { getMockProfile, isInDemoMode } from "@/lib/mock-data";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "admin" | "agent" | "secretary" | "accountant" | "provider" | "owner";
}

export const authService = {
  async login(credentials: LoginCredentials) {
    // NOUVEAU : Vérifier mode démo AVANT d'appeler Supabase
    const isValidDemoCredentials =
      credentials.password === "Admin123!" &&
      (credentials.email === "admin@immo360.com" ||
        credentials.email === "agent1@immo360.com");

    // Si credentials de démo valides ET environnement de développement → activer mode démo directement
    if (isValidDemoCredentials && isInDemoMode()) {
      const profile = getMockProfile(credentials.email);
      localStorage.setItem("demo_user", JSON.stringify(profile));
      localStorage.setItem("demo_mode_active", "true");
      
      return {
        user: { id: profile.id, email: profile.email } as any,
        profile,
      };
    }

    // Sinon, tentative de connexion Supabase normale
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: credentials.email.trim(),
          password: credentials.password,
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Authentification échouée");

      // Récupérer le profil
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!profile) {
        // Créer le profil si manquant
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: credentials.email.trim(),
            first_name: authData.user.user_metadata?.first_name || "User",
            last_name: authData.user.user_metadata?.last_name || "Account",
            phone: authData.user.user_metadata?.phone || null,
            role: authData.user.user_metadata?.role || "agent",
            is_active: true,
          })
          .select()
          .single();

        if (createError) throw createError;
        return { user: authData.user, profile: newProfile };
      }

      return { user: authData.user, profile };
    } catch (error: any) {
      // Propager l'erreur (credentials invalides ou autre problème)
      throw error;
    }
  },

  async signup(credentials: SignupCredentials) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email.trim(),
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            phone: credentials.phone,
            role: credentials.role,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Inscription échouée");

      // Créer le profil
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: credentials.email.trim(),
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        phone: credentials.phone,
        role: credentials.role,
        is_active: true,
      });

      if (profileError) throw profileError;

      return { user: authData.user };
    } catch (error: any) {
      throw error;
    }
  },

  async logout() {
    // Nettoyer session démo
    localStorage.removeItem("demo_user");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Erreur logout:", error);
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return { user, profile };
    } catch (error) {
      // Vérifier session démo
      const demoUser = localStorage.getItem("demo_user");
      const demoModeActive = localStorage.getItem("demo_mode_active") === "true";
      
      if (demoUser && demoModeActive && isInDemoMode()) {
        const profile = JSON.parse(demoUser);
        return {
          user: { id: profile.id, email: profile.email } as any,
          profile,
        };
      }
      return null;
    }
  },
};