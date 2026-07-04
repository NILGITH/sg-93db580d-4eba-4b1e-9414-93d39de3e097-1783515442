import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getProspects, updateProspect } from "@/services/prospectsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Users, Plus, Mail, Phone } from "lucide-react";

export default function CRMPage() {
  const router = useRouter();
  const { user, profile, agency, loading: authLoading } = useAuth();
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (agency?.id) {
      loadProspects();
    }
  }, [agency?.id]);

  async function loadProspects() {
    if (!agency?.id) return;
    try {
      const data = await getProspects(agency.id);
      setProspects(data);
    } catch (error) {
      console.error("Error loading prospects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDragEnd(prospectId: string, newStatus: string) {
    try {
      await updateProspect(prospectId, { status: newStatus });
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

  if (!user || !profile || !agency) {
    return null;
  }

  const statuses = [
    { value: "nouveau", label: "Nouveaux", variant: "available" as const },
    { value: "contact", label: "Contactés", variant: "default" as const },
    { value: "visite", label: "Visites", variant: "maintenance" as const },
    { value: "negociation", label: "Négociation", variant: "premium" as const },
    { value: "signature", label: "Signature", variant: "rented" as const },
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
                <p className="text-sm text-primary-foreground/80">{agency.name}</p>
              </div>
            </div>
            <Link href="/crm/new">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Prospect
              </Button>
            </Link>
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
                        onClick={() => router.push(`/crm/${prospect.id}`)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold">
                            {prospect.first_name} {prospect.last_name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {prospect.property_interest}
                          </CardDescription>
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
                          {prospect.budget && (
                            <div className="text-xs font-semibold text-accent pt-1">
                              Budget: {prospect.budget.toLocaleString()} €
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