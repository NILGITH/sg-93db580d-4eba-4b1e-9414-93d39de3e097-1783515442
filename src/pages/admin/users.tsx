import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";
import { mockProfiles } from "@/lib/mock-data";
import {
  Users,
  Search,
  Home,
  LogOut,
  Shield,
  Mail,
  Phone,
} from "lucide-react";

export default function AdminUsers() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");

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

  const users = Object.values(mockProfiles);
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  function getRoleLabel(role: string) {
    const labels: Record<string, string> = {
      admin: "Administrateur",
      agent: "Agent",
      secretary: "Secrétaire",
      accountant: "Comptable",
      provider: "Prestataire",
      owner: "Propriétaire",
    };
    return labels[role] || role;
  }

  function getRoleBadgeVariant(role: string) {
    if (role === "admin") return "destructive";
    if (role === "agent") return "default";
    return "secondary";
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Utilisateurs</h1>
                <p className="text-sm text-primary-foreground/80">
                  Gestion des comptes utilisateurs
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                  <Home className="w-4 h-4 mr-2" />
                  Admin
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
        {/* Recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.filter(u => u.role === "agent").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Secrétaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.filter(u => u.role === "secretary").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Comptables</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.filter(u => u.role === "accountant").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Prestataires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.filter(u => u.role === "provider").length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">
                          {user.first_name} {user.last_name}
                        </p>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Actif
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}