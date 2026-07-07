import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { authService } from "@/services/authService";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

export interface AuthUser {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): AuthUser {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        // Vérifier d'abord le mode démo
        const demoUser = localStorage.getItem("demo_user");
        const demoModeActive = localStorage.getItem("demo_mode_active") === "true";

        if (demoUser && demoModeActive) {
          const demoProfile = JSON.parse(demoUser);
          setProfile(demoProfile);
          setUser({ id: demoProfile.id, email: demoProfile.email } as User);
          setLoading(false);
          return;
        }

        // Sinon, charger depuis Supabase
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!mounted) return;
        setUser(currentUser);

        if (currentUser) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          if (profileError) throw profileError;
          
          if (!mounted) return;
          setProfile(profileData);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData && mounted) {
          setProfile(profileData);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading, error };
}