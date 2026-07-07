import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Calendar, Search, MapPin, User, Phone, Mail, DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingWithDetails = Booking & {
  properties?: { reference: string; title: string; address: string; city: string; price: number } | null;
  prospects?: { first_name: string; last_name: string; phone: string; email: string } | null;
};

type BookingStatus = Database["public"]["Enums"]["booking_status"];

export default function BookingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && profile) {
      loadBookings();
    }
  }, [user, profile]);

  async function loadBookings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*, properties(reference, title, address, city, price), prospects(first_name, last_name, phone, email)")
        .order("start_date", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(bookingId: string, newStatus: BookingStatus) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Réservation ${newStatus === "confirmee" ? "confirmée" : newStatus === "annulee" ? "annulée" : "terminée"}`,
      });

      loadBookings();
      setShowDetailDialog(false);
      setActionNote("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  }

  async function confirmDeposit(bookingId: string) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ 
          deposit_paid: true,
          status: "confirmee"
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Acompte confirmé",
        description: "La réservation a été confirmée",
      });

      loadBookings();
      setShowDetailDialog(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de confirmer l'acompte",
        variant: "destructive",
      });
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch = !searchQuery || 
      booking.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.properties?.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

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
                <h1 className="text-3xl font-serif font-bold">Réservations</h1>
                <p className="text-sm text-primary-foreground/80">Gestion des réservations meublés</p>
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher (nom, email, référence bien)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as BookingStatus | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="confirmee">Confirmée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {bookings.filter(b => b.status === "en_attente").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === "confirmee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === "terminee").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annulées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === "annulee").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des réservations */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune réservation</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const startDate = new Date(booking.start_date);
              const endDate = new Date(booking.end_date);
              const isUpcoming = startDate > new Date();
              const isActive = startDate <= new Date() && endDate >= new Date();

              return (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={
                              booking.status === "confirmee" ? "default" : 
                              booking.status === "en_attente" ? "secondary" : 
                              booking.status === "terminee" ? "outline" : 
                              "destructive"
                            }
                          >
                            {booking.status === "en_attente" ? "En attente" :
                             booking.status === "confirmee" ? "Confirmée" :
                             booking.status === "annulee" ? "Annulée" : "Terminée"}
                          </Badge>

                          {booking.deposit_paid && (
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              Acompte payé
                            </Badge>
                          )}

                          {isActive && booking.status === "confirmee" && (
                            <Badge variant="outline" className="border-blue-600 text-blue-600">
                              En cours
                            </Badge>
                          )}

                          {isUpcoming && booking.status === "confirmee" && (
                            <Badge variant="outline" className="border-amber-600 text-amber-600">
                              À venir
                            </Badge>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{booking.client_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              {booking.client_phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              {booking.client_email}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">{booking.properties?.title}</p>
                                <p className="text-muted-foreground text-xs">
                                  {booking.properties?.reference} • {booking.properties?.city}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">
                                  {startDate.toLocaleDateString("fr-FR")} → {endDate.toLocaleDateString("fr-FR")}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {booking.nights} nuit{booking.nights > 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">
                                  {booking.total_price.toLocaleString("fr-FR")} FCFA
                                </p>
                                {booking.deposit_amount && (
                                  <p className="text-muted-foreground text-xs">
                                    Acompte: {booking.deposit_amount.toLocaleString("fr-FR")} FCFA
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="text-muted-foreground italic">{booking.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailDialog(true);
                          }}
                        >
                          Détails
                        </Button>

                        {booking.status === "en_attente" && !booking.deposit_paid && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => confirmDeposit(booking.id)}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Confirmer acompte
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateBookingStatus(booking.id, "annulee")}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Annuler
                            </Button>
                          </>
                        )}

                        {booking.status === "confirmee" && endDate < new Date() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, "terminee")}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dialog détails */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la réservation</DialogTitle>
              <DialogDescription>
                Réservation de {selectedBooking?.client_name}
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Client</p>
                    <p className="font-medium">{selectedBooking.client_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client_phone}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client_email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bien</p>
                    <p className="font-medium">{selectedBooking.properties?.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.properties?.reference}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.properties?.address}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Période</p>
                    <p className="text-muted-foreground">
                      Du {new Date(selectedBooking.start_date).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-muted-foreground">
                      Au {new Date(selectedBooking.end_date).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ({selectedBooking.nights} nuit{selectedBooking.nights > 1 ? "s" : ""})
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Montants</p>
                    <p className="text-lg font-bold text-primary">
                      {selectedBooking.total_price.toLocaleString("fr-FR")} FCFA
                    </p>
                    {selectedBooking.deposit_amount && (
                      <p className="text-sm text-muted-foreground">
                        Acompte: {selectedBooking.deposit_amount.toLocaleString("fr-FR")} FCFA
                        {selectedBooking.deposit_paid && " ✓"}
                      </p>
                    )}
                    {selectedBooking.payment_method && (
                      <p className="text-sm text-muted-foreground capitalize">
                        Paiement: {selectedBooking.payment_method.replace("_", " ")}
                      </p>
                    )}
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedBooking.status === "en_attente" && !selectedBooking.deposit_paid && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => confirmDeposit(selectedBooking.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirmer acompte
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => updateBookingStatus(selectedBooking.id, "annulee")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  )}

                  {selectedBooking.status === "confirmee" && new Date(selectedBooking.end_date) < new Date() && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => updateBookingStatus(selectedBooking.id, "terminee")}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Marquer terminée
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}