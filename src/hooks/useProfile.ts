import { useState, useEffect } from "react";

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demoUser = localStorage.getItem("demo_user");
    if (demoUser) {
      try {
        setProfile(JSON.parse(demoUser));
      } catch {
        setProfile(null);
      }
    }
    setLoading(false);
  }, []);

  return { profile, loading };
}