import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Home, FileText, TrendingUp, Users, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, agency, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user || !profile || !agency) {
    return null;
  }

  const stats = [
    {
      title: "Biens actifs",
      value: "24",
      icon: Home,
      change: "+3 ce mois",
      variant: "default" as const,
    },
    {
      title: "Mandats en cours",
      value: "18",
      icon: FileText,
      change: "+2 cette semaine",
      variant: "default" as const,
    },
    {
      title: "Revenus du mois",
      value: "42 850 €",
      icon: DollarSign,
      change: "+12% vs mois dernier",
      variant: "premium" as const,
    },
    {
      title: "Taux d'occupation",
      value: "94%",
      icon: TrendingUp,
      change: "+2% vs mois dernier",
      variant: "default" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">IMMO360</h1>
                <p className="text-sm text-primary-foreground/80">{agency.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
              <StatusBadge variant="premium" className="mt-1">
                {profile.role.replace("_", " ").toUpperCase()}
              </StatusBadge>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Tableau de bord
          </h2>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre activité immobilière
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border/50 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.variant === "premium" ? "text-accent" : "text-primary"}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold tabular-nums ${stat.variant === "premium" ? "text-accent" : "text-foreground"}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-serif">Activité récente</CardTitle>
              <CardDescription>Dernières opérations sur vos biens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Appartement 3 pièces - Paris 15ème</p>
                      <p className="text-xs text-muted-foreground">Nouveau mandat de location</p>
                    </div>
                    <StatusBadge variant="available">Nouveau</StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-serif">Propriétaires</CardTitle>
              <CardDescription>Liste de vos mandants actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Martin Dubois</p>
                      <p className="text-xs text-muted-foreground">3 biens • 2 mandats actifs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}