import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { Building2, Bell, CheckCheck, Trash2, Home, LogOut } from "lucide-react";

// Notifications mockées
const mockNotifications = [
  {
    id: "1",
    title: "Nouvelle demande de visite",
    message: "Jean Dupont souhaite visiter la Villa Moderne 4 Pièces à Akpakpa",
    read: false,
    link: "/visits",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
  },
  {
    id: "2",
    title: "Paiement reçu",
    message: "Loyer de 350 000 FCFA reçu pour la Villa Moderne",
    read: false,
    link: "/payments",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Il y a 5h
  },
  {
    id: "3",
    title: "Nouvelle réservation",
    message: "Marie Martin a réservé le Studio Meublé à Cadjehoun",
    read: true,
    link: "/bookings",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Il y a 1 jour
  },
  {
    id: "4",
    title: "Intervention terminée",
    message: "Réparation plomberie terminée à la Villa Moderne",
    read: true,
    link: "/interventions",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
  },
  {
    id: "5",
    title: "Nouveau prospect",
    message: "Sophie Leblanc recherche un appartement 3 pièces",
    read: true,
    link: "/crm",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3 jours
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, loading: authLoading } = useProfile();

  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterRead, setFilterRead] = useState<"all" | "unread">("all");

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

  function markAsRead(notificationId: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    toast({
      title: "Notification marquée comme lue",
    });
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: "Toutes les notifications ont été marquées comme lues",
    });
  }

  function deleteNotification(notificationId: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast({
      title: "Notification supprimée",
    });
  }

  function handleNotificationClick(notification: typeof mockNotifications[0]) {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  }

  function getRelativeTime(date: string) {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return notificationDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profile) return null;

  const filteredNotifications =
    filterRead === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell className="w-10 h-10 text-accent" />
              <div>
                <h1 className="text-3xl font-serif font-bold">Notifications</h1>
                <p className="text-sm text-primary-foreground/80">
                  {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Toutes lues"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-primary"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Tout marquer lu
                </Button>
              )}
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

      <main className="container py-8">
        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filterRead === "all" ? "default" : "outline"}
            onClick={() => setFilterRead("all")}
          >
            Toutes ({notifications.length})
          </Button>
          <Button
            variant={filterRead === "unread" ? "default" : "outline"}
            onClick={() => setFilterRead("unread")}
          >
            Non lues ({unreadCount})
          </Button>
        </div>

        {/* Liste notifications */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filterRead === "unread" ? "Aucune notification non lue" : "Aucune notification"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.read ? "bg-accent/5 border-accent/20" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-accent/10 rounded-lg mt-1">
                        <Bell className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {getRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <CheckCheck className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}