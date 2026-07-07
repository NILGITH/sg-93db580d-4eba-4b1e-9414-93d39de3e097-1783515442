import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  Briefcase,
  LogOut
} from "lucide-react";

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  totalRevenue: number;
  pendingPayments: number;
  upcomingVisits: number;
  activeContracts: number;
  newProspects: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    upcomingVisits: 0,
    activeContracts: 0,
    newProspects: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  async function loadDashboardStats() {
    try {
      const [
        propertiesResult,
        paymentsResult,
        visitsResult,
        contractsResult,
        prospectsResult,
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact" }),
        supabase.from("payments").select("amount", { count: "exact" }),
        supabase.from("visits").select("*", { count: "exact" }).eq("status", "programmee"),
        supabase.from("contracts").select("*", { count: "exact" }).eq("status", "actif"),
        supabase.from("prospects").select("*", { count: "exact" }).eq("status", "nouveau"),
      ]);

      const properties = propertiesResult.data || [];
      const totalRevenue = paymentsResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setStats({
        totalProperties: properties.length,
        availableProperties: properties.filter(p => p.status === "disponible").length,
        rentedProperties: properties.filter(p => p.status === "loue").length,
        totalRevenue,
        pendingPayments: 0,
        upcomingVisits: visitsResult.count || 0,
        activeContracts: contractsResult.count || 0,
        newProspects: prospectsResult.count || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold">AMIRI</h1>
                <p className="text-sm text-muted-foreground">Gestion Immobilière</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
                <Badge variant="outline" className="text-xs">
                  {profile.role === "admin" && "Administrateur"}
                  {profile.role === "agent" && "Agent"}
                  {profile.role === "secretary" && "Secrétaire"}
                  {profile.role === "accountant" && "Comptable"}
                  {profile.role === "owner" && "Propriétaire"}
                  {profile.role === "provider" && "Prestataire"}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Navigation rapide */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button asChild variant="outline">
            <Link href="/properties">Biens</Link>
          </Button>
          {(profile.role === "admin" || profile.role === "agent" || profile.role === "secretary") && (
            <>
              <Button asChild variant="outline">
                <Link href="/crm">Prospects</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/visits">Visites</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/bookings">Réservations</Link>
              </Button>
            </>
          )}
          {(profile.role === "admin" || profile.role === "accountant") && (
            <Button asChild variant="outline">
              <Link href="/payments">Paiements</Link>
            </Button>
          )}
          {(profile.role === "admin" || profile.role === "agent") && (
            <Button asChild variant="outline">
              <Link href="/interventions">Interventions</Link>
            </Button>
          )}
          {profile.role === "admin" && (
            <Button asChild variant="outline">
              <Link href="/admin/users">Utilisateurs</Link>
            </Button>
          )}
        </div>

        {/* KPI Cards - Admin, Agent, Secrétaire */}
        {(profile.role === "admin" || profile.role === "agent" || profile.role === "secretary") && (
          <>
            <h2 className="text-2xl font-serif font-semibold mb-4">Vue d'ensemble</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Biens</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProperties}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.availableProperties} disponibles
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Biens Loués</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.rentedProperties}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalProperties} vendus
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visites à venir</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingVisits}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeContracts} réservations actives
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nouveaux Prospects</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.newProspects}</div>
                  <p className="text-xs text-muted-foreground">
                    À traiter
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Interventions en cours
                  </CardTitle>
                  <CardDescription>Travaux et maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activeContracts}</div>
                  <Button asChild variant="link" className="mt-2 px-0">
                    <Link href="/interventions">Voir tout →</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Actions rapides
                  </CardTitle>
                  <CardDescription>Gestion quotidienne</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/properties/new">+ Nouveau Bien</Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/crm">Gérer Prospects</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* KPI Cards - Comptable */}
        {profile.role === "accountant" && (
          <>
            <h2 className="text-2xl font-serif font-semibold mb-4">Vue Financière</h2>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue?.toLocaleString()} FCFA</div>
                  <p className="text-xs text-muted-foreground">
                    Tous paiements confondus
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Loyers du mois</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue?.toLocaleString()} FCFA</div>
                  <p className="text-xs text-muted-foreground">
                    Mois en cours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impayés</CardTitle>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                  <p className="text-xs text-muted-foreground">
                    Paiements en attente
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Actions Comptables</CardTitle>
                <CardDescription>Gestion des paiements et rapports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/payments">Enregistrer un Paiement</Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/reports">Générer Rapport</Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/payments?filter=unpaid">Gérer Impayés</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}