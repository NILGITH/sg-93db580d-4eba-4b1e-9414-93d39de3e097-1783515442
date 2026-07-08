import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { mockStats, mockRevenueData, mockTopProperties } from "@/lib/mock-data";
import {
  FileText,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Building2,
  Home,
  LogOut,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ReportsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  function handleLogout() {
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_mode_active");
    router.push("/select-profile");
  }

  async function handleGenerateReport() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Rapport généré avec succès ! (Mode démo)");
    }, 1500);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Rapports</h1>
                <p className="text-sm text-primary-foreground/80">
                  Analyses et statistiques détaillées
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
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
        {/* Période et génération */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Période</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="semiannual">Semestriel</SelectItem>
                    <SelectItem value="annual">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerateReport} disabled={loading} size="lg">
                <Download className="w-5 h-5 mr-2" />
                {loading ? "Génération..." : "Générer Rapport PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Biens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-3xl font-bold">{mockStats.totalProperties}</p>
                  <p className="text-xs text-muted-foreground">
                    {mockStats.availableProperties} disponibles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenus Totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-3xl font-bold">
                    {(mockStats.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground">FCFA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenus Mensuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-3xl font-bold">
                    {(mockStats.monthlyRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground">FCFA/mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Biens Loués
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Home className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-3xl font-bold">{mockStats.rentedProperties}</p>
                  <p className="text-xs text-muted-foreground">Locations actives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="properties">Biens</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenus"
                      stroke="#3282B8"
                      strokeWidth={2}
                      name="Revenus (FCFA)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Biens par Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockTopProperties}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="prix" fill="#3282B8" name="Prix (FCFA)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Aperçu Top Biens */}
        <Card>
          <CardHeader>
            <CardTitle>Biens les Plus Performants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProperties.map((property, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{property.name}</p>
                      <p className="text-sm text-muted-foreground">{property.ville}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{property.prix.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {property.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}