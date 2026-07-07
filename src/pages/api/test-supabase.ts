import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test avec credentials hardcodés
    const SUPABASE_URL = "https://qfswgjvyxiuumepepuml.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmc3dnanZ5eGl1dW1lcGVwdW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5OTg3MDgsImV4cCI6MjA1MTU3NDcwOH0.Dy9fZ_EUW0IcNqVEX3vPO5W9FbILiEVFJc5lI8kvOOE";

    const testClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Test 1: Connexion basique
    const { data: testData, error: testError } = await testClient
      .from("properties")
      .select("count")
      .limit(1);

    if (testError) {
      return res.status(500).json({
        success: false,
        error: "Connexion Supabase échouée",
        details: testError.message,
        url: SUPABASE_URL,
      });
    }

    // Test 2: Auth
    const { data: authTest, error: authError } = await testClient.auth.getSession();

    return res.status(200).json({
      success: true,
      message: "Connexion Supabase OK",
      url: SUPABASE_URL,
      databaseTest: "OK",
      authTest: authError ? `Error: ${authError.message}` : "OK",
      environment: process.env.NODE_ENV,
      envVars: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}