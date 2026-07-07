import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const testAccounts = [
      {
        email: "admin@immo360.com",
        password: "Admin123!",
        firstName: "Admin",
        lastName: "Système",
        phone: "+22997000001",
        role: "admin"
      },
      {
        email: "agent1@immo360.com",
        password: "Agent123!",
        firstName: "Kofi",
        lastName: "Mensah",
        phone: "+22997000002",
        role: "agent"
      }
    ];

    const results = [];

    for (const account of testAccounts) {
      // Créer l'utilisateur avec l'API Admin
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          first_name: account.firstName,
          last_name: account.lastName,
          phone: account.phone,
          role: account.role
        }
      });

      if (authError) {
        results.push({ email: account.email, success: false, error: authError.message });
        continue;
      }

      // Créer le profil
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: authData.user.id,
        email: account.email,
        first_name: account.firstName,
        last_name: account.lastName,
        phone: account.phone,
        role: account.role,
        is_active: true
      });

      results.push({
        email: account.email,
        success: !profileError,
        error: profileError?.message
      });
    }

    return res.status(200).json({ success: true, results });
  } catch (error: any) {
    console.error("Erreur création comptes:", error);
    return res.status(500).json({ error: error.message });
  }
}