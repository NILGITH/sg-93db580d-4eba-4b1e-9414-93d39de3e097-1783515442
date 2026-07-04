import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Building2 } from "lucide-react";
import Link from "next/link";

type Agency = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  created_at: string;
};

export default function AdminAgencies() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "super_admin")) {
      router.push("/dashboard");
    }
  }, [profile, loading, router]);

  useEffect(() => {
    if (profile?.role === "super_admin") {
      loadAgencies();
    }
  }, [profile]);

  useEffect(() => {
    const filtered = agencies.filter(agency =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAgencies(filtered);
  }, [searchTerm, agencies]);

  async function loadAgencies() {
    const { data } = await supabase
      .from("agencies")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setAgencies(data);
      setFilteredAgencies(data);
    }
  }

  async function createAgency() {
    const { error } = await supabase
      .from("agencies")
      .insert([formData]);

    if (!error) {
      setDialogOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "" });
      loadAgencies();
    }
  }

  async function toggleAgency(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("agencies")
      .update({ active: !currentStatus })
      .eq("id", id);

    if (!error) {
      loadAgencies();
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
            <h1 className="text-2xl font-serif font-bold text-primary">Gestion des Agences</h1>
            <Link href="/admin/dashboard">
              <Button variant="outline">Retour</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une agence..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle agence
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle agence</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Agence Immobilière XYZ"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@agence.fr"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Adresse</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 rue de Paris, 75001 Paris"
                  />
                </div>
                <Button onClick={createAgency} className="w-full bg-accent hover:bg-accent/90">
                  Créer l'agence
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {filteredAgencies.map((agency) => (
            <Card key={agency.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-serif">{agency.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{agency.email}</p>
                    </div>
                  </div>
                  <StatusBadge variant={agency.active ? "available" : "default"}>
                    {agency.active ? "Active" : "Inactive"}
                  </StatusBadge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Téléphone</span>
                    <p className="font-medium">{agency.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Adresse</span>
                    <p className="font-medium">{agency.address}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={agency.active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleAgency(agency.id, agency.active)}
                  >
                    {agency.active ? "Désactiver" : "Activer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}