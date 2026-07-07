import { supabase } from "@/integrations/supabase/client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "admin" | "agent" | "secretary" | "accountant" | "provider" | "owner";
}

export const authService = {
  async login(credentials: LoginCredentials) {
    console.log("🔐 Tentative de connexion pour:", credentials.email);
    
    try {
      // Test de connexion Supabase
      console.log("📡 Test connexion Supabase...");
      const { data: testData, error: testError } = await supabase.from("profiles").select("count").limit(1);
      console.log("Test Supabase:", { success: !testError, error: testError?.message });

      // 1. Authentification Supabase
      console.log("🔑 Authentification en cours...");
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      console.log("Auth response:", { 
        success: !authError, 
        hasUser: !!authData?.user,
        error: authError?.message 
      });

      if (authError) {
        console.error("❌ Erreur auth:", authError);
        throw authError;
      }
      if (!authData.user) {
        console.error("❌ Pas d'utilisateur retourné");
        throw new Error("Authentification échouée");
      }

      console.log("✅ Auth réussie, ID utilisateur:", authData.user.id);

      // 2. Récupérer ou créer le profil
      console.log("👤 Recherche du profil...");
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();

      console.log("Profil trouvé:", !!profile);

      // Si le profil n'existe pas, le créer automatiquement
      if (!profile) {
        console.log("⚠️ Profil inexistant, création...");
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

        if (createError) {
          console.error("❌ Erreur création profil:", createError);
          throw createError;
        }
        console.log("✅ Profil créé");
        return { user: authData.user, profile: newProfile };
      }

      console.log("✅ Login complet réussi");
      return { user: authData.user, profile };
    } catch (error: any) {
      console.error("❌ Erreur login complète:", error);
      throw error;
    }
  },

  async signup(data: SignupData) {
    try {
      // 1. Créer le compte auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            role: data.role,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erreur création compte");

      // 2. Créer le profil immédiatement
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: data.email.trim(),
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        role: data.role,
        is_active: true,
      });

      // Ignorer l'erreur si le profil existe déjà (trigger a fonctionné)
      if (profileError && !profileError.message.includes("duplicate")) {
        throw profileError;
      }

      return { user: authData.user };
    } catch (error: any) {
      console.error("Erreur signup:", error);
      throw error;
    }
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) return null;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      return { user, profile };
    } catch (error) {
      console.error("Erreur getCurrentUser:", error);
      return null;
    }
  },
};