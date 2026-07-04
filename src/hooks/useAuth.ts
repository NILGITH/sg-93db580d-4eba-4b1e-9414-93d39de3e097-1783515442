import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Agency = Database["public"]["Tables"]["agencies"]["Row"];

export interface AuthUser {
  user: User | null;
  profile: Profile | null;
  agency: Agency | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): AuthUser {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!mounted) return;
        setUser(currentUser);

        if (currentUser) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*, agencies(*)")
            .eq("user_id", currentUser.id)
            .single();

          if (profileError) throw profileError;
          
          if (!mounted) return;
          setProfile(profileData);
          setAgency(profileData.agencies as Agency);
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
          .select("*, agencies(*)")
          .eq("user_id", session.user.id)
          .single();

        if (profileData && mounted) {
          setProfile(profileData);
          setAgency(profileData.agencies as Agency);
        }
      } else {
        setUser(null);
        setProfile(null);
        setAgency(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, agency, loading, error };
}