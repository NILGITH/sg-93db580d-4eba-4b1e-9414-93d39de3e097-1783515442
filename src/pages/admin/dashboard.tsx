import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { mockStats, mockProperties, mockProspects, mockVisits } from "@/lib/mock-data";
import {
  Users,
  Building2,
  FileText,
  Settings,
  Home,
  LogOut,
  TrendingUp,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
    if (profile && profile.role !== "admin") {
      router.push("/dashboard");
    }
  }, [profile, authLoading, router]);

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/select-profile");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return null;
  }

  const totalUsers = 6;
  const totalPublishedProperties = mockProperties.filter(p => p.is_published).length;
  const totalProspects = mockProspects.length;
  const totalVisits = mockVisits.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Administration</h1>
                <p className="text-sm text-primary-foreground/80">
                  Panneau de contrôle administrateur
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard Principal
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="border-accent text-accent hover:bg-accent hover:text-primary">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalUsers}</p>
              <p className="text-xs text-muted-foreground mt-1">Comptes actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Biens Publiés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalPublishedProperties}</p>
              <p className="text-xs text-muted-foreground mt-1">Sur {mockProperties.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Prospects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalProspects}</p>
              <p className="text-xs text-muted-foreground mt-1">Nouveaux contacts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Visites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalVisits}</p>
              <p className="text-xs text-muted-foreground mt-1">Demandes enregistrées</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Administrateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/users">
                <Button className="w-full" variant="outline">
                  <Users className="w-5 h-5 mr-2" />
                  Gérer les Utilisateurs
                </Button>
              </Link>

              <Link href="/admin/properties-public">
                <Button className="w-full" variant="outline">
                  <Building2 className="w-5 h-5 mr-2" />
                  Biens Publiés
                </Button>
              </Link>

              <Link href="/admin/blog">
                <Button className="w-full" variant="outline">
                  <FileText className="w-5 h-5 mr-2" />
                  Gérer le Blog
                </Button>
              </Link>

              <Link href="/admin/faq">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Gérer la FAQ
                </Button>
              </Link>

              <Link href="/admin/contracts">
                <Button className="w-full" variant="outline">
                  <FileText className="w-5 h-5 mr-2" />
                  Modèles de Contrats
                </Button>
              </Link>

              <Link href="/admin/settings">
                <Button className="w-full" variant="outline">
                  <Settings className="w-5 h-5 mr-2" />
                  Paramètres
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Mode démo info */}
        <Card className="bg-accent/10 border-accent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-accent border-accent">Mode Démo</Badge>
              <p className="text-sm text-muted-foreground">
                Application en mode démonstration sans authentification. Toutes les données sont mockées.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}