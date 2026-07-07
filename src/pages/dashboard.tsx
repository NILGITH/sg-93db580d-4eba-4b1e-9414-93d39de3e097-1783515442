import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
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
  LogOut,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockStats, mockRevenueData, mockPropertyTypeData, mockTopProperties, isInDemoMode } from "@/lib/mock-data";

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  soldProperties: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  upcomingVisits: number;
  activeContracts: number;
  newProspects: number;
}

interface ChartData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  propertyTypes: Array<{ name: string; value: number }>;
  revenueByProperty: Array<{ name: string; revenue: number }>;
}

const COLORS = ["#3282B8", "#16213E", "#BBE1FA", "#1A1A2E", "#0B4F6C"];

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0,
    soldProperties: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    upcomingVisits: 0,
    activeContracts: 0,
    newProspects: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    monthlyRevenue: [],
    propertyTypes: [],
    revenueByProperty: [],
  });

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Vérifier le mode démo en premier
        const demoUser = localStorage.getItem("demo_user");
        const demoModeActive = localStorage.getItem("demo_mode_active") === "true";

        if (demoUser && demoModeActive) {
          // Mode démo : charger les données mockées immédiatement
          setStats({
            totalProperties: mockStats.totalProperties,
            availableProperties: mockStats.availableProperties,
            rentedProperties: mockStats.rentedProperties,
            soldProperties: mockStats.soldProperties,
            totalRevenue: mockStats.totalRevenue,
            monthlyRevenue: mockStats.monthlyRevenue,
            pendingPayments: mockStats.pendingPayments,
            upcomingVisits: mockStats.totalVisits,
            activeContracts: 12,
            newProspects: mockStats.newProspects,
          });

          setChartData({
            monthlyRevenue: mockRevenueData,
            propertyTypes: mockPropertyTypeData,
            revenueByProperty: mockTopProperties.map(p => ({
              name: p.name,
              revenue: p.prix,
            })),
          });
          return;
        }

        // Sinon charger depuis Supabase
        if (user) {
          await loadDashboardStats();
          await loadChartData();
        }
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
        // En cas d'erreur, fallback sur données mockées
        setStats({
          totalProperties: mockStats.totalProperties,
          availableProperties: mockStats.availableProperties,
          rentedProperties: mockStats.rentedProperties,
          soldProperties: mockStats.soldProperties,
          totalRevenue: mockStats.totalRevenue,
          monthlyRevenue: mockStats.monthlyRevenue,
          pendingPayments: mockStats.pendingPayments,
          upcomingVisits: mockStats.totalVisits,
          activeContracts: 12,
          newProspects: mockStats.newProspects,
        });

        setChartData({
          monthlyRevenue: mockRevenueData,
          propertyTypes: mockPropertyTypeData,
          revenueByProperty: mockTopProperties.map(p => ({
            name: p.name,
            revenue: p.prix,
          })),
        });
      }
    }

    loadDashboardData();
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
        supabase.from("payments").select("amount, created_at"),
        supabase.from("visits").select("*", { count: "exact" }).eq("status", "confirmee"),
        supabase.from("contracts").select("*", { count: "exact" }).eq("status", "en_cours"),
        supabase.from("prospects").select("*", { count: "exact" }).eq("status", "nouveau"),
      ]);

      const properties = propertiesResult.data || [];
      const payments = paymentsResult.data || [];
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      // Revenus du mois en cours
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = payments
        .filter(p => {
          const date = new Date(p.created_at);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalProperties: properties.length,
        availableProperties: properties.filter(p => p.status === "disponible").length,
        rentedProperties: properties.filter(p => p.status === "loue").length,
        soldProperties: properties.filter(p => p.status === "vendu").length,
        totalRevenue,
        monthlyRevenue,
        pendingPayments: 0,
        upcomingVisits: visitsResult.count || 0,
        activeContracts: contractsResult.count || 0,
        newProspects: prospectsResult.count || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  }

  async function loadChartData() {
    try {
      const { data: payments } = await supabase
        .from("payments")
        .select("amount, created_at")
        .order("created_at", { ascending: true });

      const { data: properties } = await supabase
        .from("properties")
        .select("property_type, price, title");

      // Revenus mensuels des 6 derniers mois
      const monthlyRevenueData = [];
      const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        
        const monthRevenue = (payments || [])
          .filter(p => {
            const paymentDate = new Date(p.created_at);
            return paymentDate.getMonth() === monthIndex && paymentDate.getFullYear() === year;
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        monthlyRevenueData.push({
          month: months[monthIndex],
          revenue: monthRevenue,
        });
      }

      // Types de biens
      const propertyTypeCounts: Record<string, number> = {};
      (properties || []).forEach(p => {
        propertyTypeCounts[p.property_type] = (propertyTypeCounts[p.property_type] || 0) + 1;
      });

      const propertyTypesData = Object.entries(propertyTypeCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

      // Top 5 biens par prix
      const topProperties = (properties || [])
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 5)
        .map(p => ({
          name: p.title.length > 20 ? p.title.substring(0, 20) + "..." : p.title,
          revenue: p.price || 0,
        }));

      setChartData({
        monthlyRevenue: monthlyRevenueData,
        propertyTypes: propertyTypesData,
        revenueByProperty: topProperties,
      });
    } catch (error) {
      console.error("Error loading chart data:", error);
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
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo_Amiri.png" alt="AMIRI" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold font-serif">AMIRI</h1>
                <p className="text-sm text-muted-foreground">Gestion Immobilière</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
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
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
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
          <Button asChild variant="default">
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
            <>
              <Button asChild variant="outline">
                <Link href="/admin/properties-public">Biens Publics</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/blog">Blog</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/users">Utilisateurs</Link>
              </Button>
            </>
          )}
        </div>

        {/* KPI Cards - Admin, Agent, Secrétaire */}
        {(profile.role === "admin" || profile.role === "agent" || profile.role === "secretary") && (
          <>
            <h2 className="text-2xl font-serif font-semibold mb-6">Vue d'ensemble</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Biens</CardTitle>
                  <Home className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProperties}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.availableProperties} disponibles • {stats.rentedProperties} loués
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} FCFA</div>
                  <p className="text-xs text-green-600 mt-1">
                    +{stats.monthlyRevenue.toLocaleString()} FCFA ce mois
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visites à venir</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingVisits}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.activeContracts} contrats actifs
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nouveaux Prospects</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.newProspects}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    À traiter cette semaine
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques Analytiques */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Évolution des Revenus
                  </CardTitle>
                  <CardDescription>6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toLocaleString()} FCFA`, "Revenus"]}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3282B8" 
                        strokeWidth={3}
                        dot={{ fill: "#3282B8", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-accent" />
                    Répartition par Type
                  </CardTitle>
                  <CardDescription>Types de biens immobiliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.propertyTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.propertyTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Top 5 Biens par Prix
                  </CardTitle>
                  <CardDescription>Biens les plus valorisés</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.revenueByProperty}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toLocaleString()} FCFA`, "Prix"]}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                      />
                      <Bar dataKey="revenue" fill="#3282B8" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent" />
                    Actions Rapides
                  </CardTitle>
                  <CardDescription>Gestion quotidienne</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Link href="/admin/properties-public">+ Nouveau Bien</Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline" size="lg">
                    <Link href="/crm">Gérer Prospects</Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline" size="lg">
                    <Link href="/visits">Planifier Visite</Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline" size="lg">
                    <Link href="/reports">Générer Rapport</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* KPI Cards - Comptable */}
        {profile.role === "accountant" && (
          <>
            <h2 className="text-2xl font-serif font-semibold mb-6">Vue Financière</h2>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} FCFA</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tous paiements confondus
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Loyers du mois</CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} FCFA</div>
                  <p className="text-xs text-green-600 mt-1">
                    Mois en cours
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impayés</CardTitle>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Paiements en attente
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Revenus Mensuels
                  </CardTitle>
                  <CardDescription>6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toLocaleString()} FCFA`, "Revenus"]}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3282B8" 
                        strokeWidth={3}
                        dot={{ fill: "#3282B8", r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Comptables</CardTitle>
                  <CardDescription>Gestion des paiements et rapports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Link href="/payments">Enregistrer un Paiement</Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline" size="lg">
                    <Link href="/reports">Générer Rapport</Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline" size="lg">
                    <Link href="/payments?filter=unpaid">Gérer Impayés</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}