import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
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
import { mockStats, mockRevenueData, mockPropertyTypeData, mockTopProperties } from "@/lib/mock-data";

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
  const { profile, loading } = useProfile();
  const [stats] = useState(mockStats);
  const [chartData] = useState({
    monthlyRevenue: mockRevenueData,
    propertyTypes: mockPropertyTypeData,
    revenueByProperty: mockTopProperties.map(p => ({
      name: p.name,
      revenue: p.prix,
    })),
  });

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/select-profile");
  }

  useEffect(() => {
    if (!loading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, loading, router]);

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

  if (!profile) {
    return null;
  }

  const dashboardStats = {
    totalProperties: stats.totalProperties,
    availableProperties: stats.availableProperties,
    rentedProperties: stats.rentedProperties,
    soldProperties: stats.soldProperties,
    totalRevenue: stats.totalRevenue,
    monthlyRevenue: stats.monthlyRevenue,
    pendingPayments: stats.pendingPayments,
    upcomingVisits: stats.scheduledVisits,
    activeContracts: 12,
    newProspects: stats.newProspects,
  };

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
              <Button variant="outline" size="sm" onClick={handleLogout}>
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
                  <div className="text-2xl font-bold">{dashboardStats.totalProperties}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dashboardStats.availableProperties} disponibles • {dashboardStats.rentedProperties} loués
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