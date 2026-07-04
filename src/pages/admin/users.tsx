import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, User } from "lucide-react";
import Link from "next/link";

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  agencies: {
    name: string;
  } | null;
  created_at: string;
};

export default function AdminUsers() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "super_admin")) {
      router.push("/dashboard");
    }
  }, [profile, loading, router]);

  useEffect(() => {
    if (profile?.role === "super_admin") {
      loadUsers();
    }
  }, [profile]);

  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }
    
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*, agencies(name)")
      .order("created_at", { ascending: false });

    if (data) {
      setUsers(data as UserProfile[]);
      setFilteredUsers(data as UserProfile[]);
    }
  }

  if (loading || !profile || profile.role !== "super_admin") {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-primary">Gestion des Utilisateurs</h1>
            <Link href="/admin/dashboard">
              <Button variant="outline">Retour</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin_agency">Admin Agence</SelectItem>
              <SelectItem value="secretary">Secrétaire</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="accountant">Comptable</SelectItem>
              <SelectItem value="proprietaire">Propriétaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agence: {user.agencies?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge variant="default">
                    {user.role.replace("_", " ")}
                  </StatusBadge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}