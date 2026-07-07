import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];
type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data as Notification[];
}

export async function getUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("read", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Notification[];
}

export async function getUnreadCount(userId: string) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
  return count || 0;
}

export async function createNotification(data: NotificationInsert) {
  const { error } = await supabase.from("notifications").insert(data);
  
  if (error) throw error;
}

export async function notifyNewVisit(visitId: string, propertyRef: string, visitorName: string) {
  // Notification pour les agents et secrétaires
  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "agent", "secretary"]);

  if (users) {
    const notifications = users.map((user) => ({
      user_id: user.id,
      notification_type: "visite" as const,
      title: "Nouvelle demande de visite",
      message: `${visitorName} souhaite visiter le bien ${propertyRef}`,
      link: "/visits",
    }));

    await supabase.from("notifications").insert(notifications);
  }
}

export async function notifyNewBooking(bookingId: string, propertyRef: string, clientName: string) {
  // Notification pour les agents et secrétaires
  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "agent", "secretary"]);

  if (users) {
    const notifications = users.map((user) => ({
      user_id: user.id,
      notification_type: "reservation" as const,
      title: "Nouvelle réservation",
      message: `${clientName} a réservé le bien ${propertyRef}`,
      link: "/bookings",
    }));

    await supabase.from("notifications").insert(notifications);
  }
}

export async function notifyNewProspect(prospectId: string, prospectName: string, demandType: string) {
  // Notification pour les agents et secrétaires
  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "agent", "secretary"]);

  if (users) {
    const notifications = users.map((user) => ({
      user_id: user.id,
      notification_type: "prospect" as const,
      title: "Nouveau prospect",
      message: `${prospectName} a envoyé une demande de ${demandType}`,
      link: "/crm",
    }));

    await supabase.from("notifications").insert(notifications);
  }
}

export async function notifyInterventionCompleted(interventionId: string, propertyRef: string, providerName: string) {
  // Notification pour les agents
  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "agent"]);

  if (users) {
    const notifications = users.map((user) => ({
      user_id: user.id,
      notification_type: "intervention" as const,
      title: "Intervention terminée",
      message: `${providerName} a terminé l'intervention sur ${propertyRef}`,
      link: "/interventions",
    }));

    await supabase.from("notifications").insert(notifications);
  }
}

export async function notifyPaymentReceived(paymentId: string, amount: number, propertyRef: string) {
  // Notification pour les comptables et admins
  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "accountant"]);

  if (users) {
    const notifications = users.map((user) => ({
      user_id: user.id,
      notification_type: "paiement" as const,
      title: "Nouveau paiement",
      message: `Paiement de ${amount} FCFA reçu pour ${propertyRef}`,
      link: "/payments",
    }));

    await supabase.from("notifications").insert(notifications);
  }
}

export async function notifyReportGenerated(reportId: string, ownerId: string, period: string) {
  // Notification pour le propriétaire
  await supabase.from("notifications").insert({
    user_id: ownerId,
    notification_type: "rapport" as const,
    title: "Rapport disponible",
    message: `Votre rapport de gestion ${period} est disponible`,
    link: "/reports",
  });
}

export async function markAsRead(id: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id);

  if (error) throw error;
}