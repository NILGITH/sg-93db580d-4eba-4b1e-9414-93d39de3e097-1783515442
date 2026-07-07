import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Home, Users, DollarSign, Calendar, FileText, Wrench, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";

interface DashboardStats {
  totalProperties?: number;
  availableProperties?: number;
  rentedProperties?: number;
  soldProperties?: number;
  totalRevenue?: number;
  monthlyRent?: number;
  unpaidRent?: number;
  upcomingVisits?: number;
  activeBookings?: number;
  newProspects?: number;
  activeInterventions?: number;
  pendingPayments?: number;
  myProperties?: number;
  myRentCollected?: number;
  myInterventions?: number;
  myMissions?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      loadDashboardStats();
    }
  }, [profile]);

  async function loadDashboardStats() {
    try {
      setLoadingStats(true);
      const newStats: DashboardStats = {};

      switch (profile?.role) {
        case "admin":
        case "agent":
        case "secretary":
          // Stats communes pour le back-office
          const { count: totalProps } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true });
          newStats.totalProperties = totalProps || 0;

          const { count: availableProps } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("status", "disponible");
          newStats.availableProperties = availableProps || 0;

          const { count: rentedProps } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("status", "loue");
          newStats.rentedProperties = rentedProps || 0;

          const { count: soldProps } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("status", "vendu");
          newStats.soldProperties = soldProps || 0;

          const { count: upcomingVisits } = await supabase
            .from("visits")
            .select("*", { count: "exact", head: true })
            .eq("status", "confirmee")
            .gte("visit_date", new Date().toISOString());
          newStats.upcomingVisits = upcomingVisits || 0;

          const { count: activeBookings } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("status", "confirmee")
            .gte("end_date", new Date().toISOString().split("T")[0]);
          newStats.activeBookings = activeBookings || 0;

          const { count: newProspects } = await supabase
            .from("prospects")
            .select("*", { count: "exact", head: true })
            .eq("status", "nouveau");
          newStats.newProspects = newProspects || 0;

          const { count: activeInterventions } = await supabase
            .from("interventions")
            .select("*", { count: "exact", head: true })
            .eq("status", "en_cours");
          newStats.activeInterventions = activeInterventions || 0;

          break;

        case "accountant":
          // Stats financières
          const { data: payments } = await supabase
            .from("payments")
            .select("amount");
          newStats.totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

          const thisMonth = new Date().toISOString().slice(0, 7);
          const { data: monthlyPayments } = await supabase
            .from("payments")
            .select("amount")
            .gte("payment_date", `${thisMonth}-01`)
            .eq("payment_type", "loyer");
          newStats.monthlyRent = monthlyPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

          const { count: unpaid } = await supabase
            .from("payments")
            .select("*", { count: "exact", head: true })
            .eq("is_validated", false);
          newStats.unpaidRent = unpaid || 0;

          break;

        case "owner":
          // Stats propriétaire
          const { count: myProps } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", user?.id);
          newStats.myProperties = myProps || 0;

          const { data: myPayments } = await supabase
            .from("payments")
            .select("amount, properties!inner(owner_id)")
            .eq("properties.owner_id", user?.id);
          newStats.myRentCollected = myPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

          const { count: myInterv } = await supabase
            .from("interventions")
            .select("*, properties!inner(owner_id)", { count: "exact", head: true })
            .eq("properties.owner_id", user?.id)
            .eq("status", "en_cours");
          newStats.myInterventions = myInterv || 0;

          break;

        case "provider":
          // Stats prestataire
          const { count: myMissions } = await supabase
            .from("interventions")
            .select("*", { count: "exact", head: true })
            .eq("provider_id", user?.id)
            .eq("status", "en_cours");
          newStats.myMissions = myMissions || 0;

          break;
      }

      setStats(newStats);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Redirection selon le rôle
  if (profile.role === "provider") {
    router.push("/provider/missions");
    return null;
  }

  if (profile.role === "owner") {
    router.push("/owner");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">IMMO360</h1>
                <p className="text-sm text-primary-foreground/80">Tableau de bord</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
              <StatusBadge variant="premium" className="mt-1">
                {profile.role === "admin" ? "ADMINISTRATEUR" : 
                 profile.role === "agent" ? "AGENT IMMOBILIER" :
                 profile.role === "secretary" ? "SECRÉTAIRE" :
                 profile.role === "accountant" ? "COMPTABLE" : 
                 "UTILISATEUR"}
              </StatusBadge>
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
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.rentedProperties}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.soldProperties} vendus
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
                    {stats.activeBookings} réservations actives
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
                    <Wrench className="h-5 w-5" />
                    Interventions en cours
                  </CardTitle>
                  <CardDescription>Travaux et maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activeInterventions}</div>
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
                  <div className="text-2xl font-bold">{stats.monthlyRent?.toLocaleString()} FCFA</div>
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
                  <div className="text-2xl font-bold">{stats.unpaidRent}</div>
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