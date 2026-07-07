import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getProspects, updateProspect } from "@/services/prospectsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Plus, Mail, Phone } from "lucide-react";

export default function CRMPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProspects();
    }
  }, [user]);

  async function loadProspects() {
    try {
      const data = await getProspects();
      setProspects(data);
    } catch (error) {
      console.error("Error loading prospects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(prospectId: string, newStatus: string) {
    try {
      await updateProspect(prospectId, { status: newStatus as any });
      await loadProspects();
    } catch (error) {
      console.error("Error updating prospect:", error);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const statuses = [
    { value: "nouveau", label: "Nouveaux", variant: "available" as const },
    { value: "contacte", label: "Contactés", variant: "default" as const },
    { value: "qualifie", label: "Qualifiés", variant: "maintenance" as const },
    { value: "negocie", label: "Négociation", variant: "premium" as const },
    { value: "converti", label: "Convertis", variant: "rented" as const },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Building2 className="w-10 h-10 text-accent cursor-pointer hover:text-accent/80" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-bold">CRM - Pipeline Commercial</h1>
                <p className="text-sm text-primary-foreground/80">IMMO360</p>
              </div>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Prospect
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map((status) => {
            const statusProspects = prospects.filter((p) => p.status === status.value);
            
            return (
              <div key={status.value} className="space-y-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-sm flex items-center justify-between">
                      {status.label}
                      <StatusBadge variant={status.variant} className="ml-2">
                        {statusProspects.length}
                      </StatusBadge>
                    </CardTitle>
                  </CardHeader>
                </Card>

                <div className="space-y-3">
                  {statusProspects.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="py-6 text-center">
                        <p className="text-xs text-muted-foreground">Aucun prospect</p>
                      </CardContent>
                    </Card>
                  ) : (
                    statusProspects.map((prospect) => (
                      <Card
                        key={prospect.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold">
                            {prospect.first_name} {prospect.last_name}
                          </CardTitle>
                          {prospect.properties && (
                            <CardDescription className="text-xs">
                              {prospect.properties.reference}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-1">
                          {prospect.email && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{prospect.email}</span>
                            </div>
                          )}
                          {prospect.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{prospect.phone}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}