import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Home, DollarSign, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login");
      } else if (profile && profile.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, profile, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return null;
  }

  const [stats, setStats] = useState({
    agencies: 0,
    users: 0,
    properties: 0,
    totalPayments: 0,
    activeInterventions: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [agenciesResult, usersResult, propertiesResult, paymentsResult, interventionsResult] = await Promise.all([
        supabase.from("agencies").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount"),
        supabase.from("interventions").select("id", { count: "exact", head: true }).eq("status", "en_cours")
      ]);

      const totalPayments = paymentsResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setStats({
        agencies: agenciesResult.count || 0,
        users: usersResult.count || 0,
        properties: propertiesResult.count || 0,
        totalPayments,
        activeInterventions: interventionsResult.count || 0
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-primary">Administration Plateforme</h1>
            <Link href="/dashboard">
              <Button variant="outline">Retour au dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agences</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent tabular-nums">{stats.agencies}</div>
              <p className="text-xs text-muted-foreground">Total agences actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent tabular-nums">{stats.users}</div>
              <p className="text-xs text-muted-foreground">Total utilisateurs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biens</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent tabular-nums">{stats.properties}</div>
              <p className="text-xs text-muted-foreground">Total biens gérés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent tabular-nums">
                {stats.totalPayments.toLocaleString()}€
              </div>
              <p className="text-xs text-muted-foreground">Volume total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interventions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent tabular-nums">{stats.activeInterventions}</div>
              <p className="text-xs text-muted-foreground">En cours</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Link href="/admin/agencies">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Gérer les agences
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Gérer les utilisateurs
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                Paramètres système
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}