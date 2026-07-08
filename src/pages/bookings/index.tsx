import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { mockBookings, mockProperties } from "@/lib/mock-data";
import { Building2, Calendar, MapPin, User, DollarSign } from "lucide-react";

export default function BookingsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useProfile();

  const [bookings] = useState(mockBookings);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/select-profile");
    }
  }, [profile, authLoading, router]);

  const filteredBookings = bookings.filter((booking) => {
    return filterStatus === "all" || booking.status === filterStatus;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  if (!["admin", "agent", "secretary"].includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Réservations en Ligne</h1>
                <p className="text-sm text-primary-foreground/80">Gestion des réservations - {bookings.length} réservations</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                Tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {bookings.filter(b => b.status === "pending").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === "confirmed").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">
                {bookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()} FCFA
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des réservations */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune réservation</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const property = mockProperties.find(p => p.id === booking.property_id);
              const startDate = new Date(booking.start_date);
              const endDate = new Date(booking.end_date);

              return (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={
                              booking.status === "confirmed" ? "default" :
                              booking.status === "pending" ? "secondary" : "destructive"
                            }
                            className={
                              booking.status === "confirmed" ? "bg-green-600" :
                              booking.status === "cancelled" ? "bg-red-600" :
                              booking.status === "completed" ? "bg-blue-600" : ""
                            }
                          >
                            {booking.status === "pending" ? "En attente" :
                             booking.status === "confirmed" ? "Confirmée" :
                             booking.status === "cancelled" ? "Annulée" : "Terminée"}
                          </Badge>

                          <Badge variant="outline" className={
                            booking.payment_status === "paid" ? "border-green-600 text-green-600" :
                            booking.payment_status === "deposit_paid" ? "border-amber-600 text-amber-600" : ""
                          }>
                            {booking.payment_status === "paid" ? "Payé" :
                             booking.payment_status === "deposit_paid" ? "Acompte payé" : "Non payé"}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            {property && (
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">{property.title}</p>
                                  <p className="text-muted-foreground text-xs">
                                    {property.city}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{booking.customer_name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              {booking.customer_phone}
                            </p>
                            <p className="text-xs text-muted-foreground pl-6">
                              {booking.customer_email}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {startDate.toLocaleDateString("fr-FR")} - {endDate.toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-accent">
                                {booking.total_amount.toLocaleString()} FCFA
                              </span>
                            </div>
                            {booking.deposit_amount > 0 && (
                              <p className="text-xs text-muted-foreground pl-6">
                                Acompte : {booking.deposit_amount.toLocaleString()} FCFA
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}