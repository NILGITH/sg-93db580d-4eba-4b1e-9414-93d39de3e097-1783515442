import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Bell, CheckCheck, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  async function loadNotifications() {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      loadNotifications();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification",
        variant: "destructive",
      });
    }
  }

  async function markAllAsRead() {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;

      toast({
        title: "Notifications marquées",
        description: "Toutes les notifications ont été marquées comme lues",
      });

      loadNotifications();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer les notifications",
        variant: "destructive",
      });
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId);

      if (error) throw error;

      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée",
      });

      loadNotifications();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive",
      });
    }
  }

  function handleNotificationClick(notification: Notification) {
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

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const filteredNotifications =
    filterRead === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10 text-accent" />
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
                  Tableau de bord
                </Button>
              </Link>
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
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
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
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