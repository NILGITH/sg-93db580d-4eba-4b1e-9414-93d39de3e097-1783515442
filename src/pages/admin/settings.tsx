import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function AdminSettings() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || (profile && profile.role !== "admin"))) {
      router.push("/dashboard");
    }
  }, [user, profile, authLoading, router]);

  if (authLoading || !profile || profile.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-primary">Paramètres Système</h1>
            <Link href="/admin/dashboard">
              <Button variant="outline">Retour</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Serveur SMTP</label>
              <Input placeholder="smtp.example.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Port SMTP</label>
              <Input placeholder="587" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Notifications email actives</span>
              <Switch />
            </div>
            <Button className="bg-accent hover:bg-accent/90">Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration SMS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Clé API SMS</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Notifications SMS actives</span>
              <Switch />
            </div>
            <Button className="bg-accent hover:bg-accent/90">Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Stockage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Limite de stockage par agence (Go)</label>
              <Input type="number" placeholder="50" />
            </div>
            <div>
              <label className="text-sm font-medium">Taille maximale fichier (Mo)</label>
              <Input type="number" placeholder="10" />
            </div>
            <Button className="bg-accent hover:bg-accent/90">Enregistrer</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}