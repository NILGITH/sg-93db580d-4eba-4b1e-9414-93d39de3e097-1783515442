import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function TestConnection() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function runTests() {
    setTesting(true);
    const testResults: any = {
      clientInitialized: false,
      databaseConnection: false,
      authConnection: false,
      envVars: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      errors: [],
    };

    try {
      // Test 1: Client existe
      testResults.clientInitialized = !!supabase;

      // Test 2: Connexion DB
      try {
        const { data, error } = await supabase.from("properties").select("count").limit(1);
        testResults.databaseConnection = !error;
        if (error) testResults.errors.push(`DB Error: ${error.message}`);
      } catch (e: any) {
        testResults.errors.push(`DB Exception: ${e.message}`);
      }

      // Test 3: Auth
      try {
        const { data, error } = await supabase.auth.getSession();
        testResults.authConnection = !error;
        if (error) testResults.errors.push(`Auth Error: ${error.message}`);
      } catch (e: any) {
        testResults.errors.push(`Auth Exception: ${e.message}`);
      }

      // Test 4: API endpoint
      try {
        const response = await fetch("/api/test-supabase");
        const apiResult = await response.json();
        testResults.apiTest = apiResult;
      } catch (e: any) {
        testResults.errors.push(`API Exception: ${e.message}`);
      }

      setResults(testResults);
    } catch (error: any) {
      testResults.errors.push(`Global error: ${error.message}`);
      setResults(testResults);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔧 Test de Connexion Supabase</h1>

        <Button onClick={runTests} disabled={testing} size="lg">
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Test en cours...
            </>
          ) : (
            "Lancer les tests"
          )}
        </Button>

        {results && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Résultats des tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {results.clientInitialized ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span>Client Supabase initialisé</span>
                </div>

                <div className="flex items-center gap-2">
                  {results.databaseConnection ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span>Connexion à la base de données</span>
                </div>

                <div className="flex items-center gap-2">
                  {results.authConnection ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span>Connexion Auth Supabase</span>
                </div>

                {results.errors.length > 0 && (
                  <div className="bg-destructive/10 p-4 rounded-lg">
                    <p className="font-semibold text-destructive mb-2">Erreurs détectées :</p>
                    {results.errors.map((error: string, i: number) => (
                      <p key={i} className="text-sm text-destructive">
                        • {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold mb-2">Variables d'environnement :</p>
                  <p className="text-sm font-mono">
                    NEXT_PUBLIC_SUPABASE_URL: {results.envVars.url || "❌ NON DÉFINI"}
                  </p>
                  <p className="text-sm font-mono">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY: {results.envVars.hasKey ? "✅ Défini" : "❌ NON DÉFINI"}
                  </p>
                </div>

                {results.apiTest && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold mb-2">Test API :</p>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(results.apiTest, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}