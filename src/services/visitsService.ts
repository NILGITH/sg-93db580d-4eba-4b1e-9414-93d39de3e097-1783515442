import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Visit = Database["public"]["Tables"]["visits"]["Row"];
type VisitInsert = Database["public"]["Tables"]["visits"]["Insert"];
type VisitUpdate = Database["public"]["Tables"]["visits"]["Update"];

export async function getVisits() {
  const { data, error } = await supabase
    .from("visits")
    .select("*, properties(reference, address, city), prospects(first_name, last_name, phone)")
    .order("visit_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getVisitsByStatus(status: string) {
  const { data, error } = await supabase
    .from("visits")
    .select("*, properties(reference, address, city), prospects(first_name, last_name, phone)")
    .eq("status", status)
    .order("visit_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getUpcomingVisits() {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from("visits")
    .select("*, properties(reference, address, city), prospects(first_name, last_name, phone)")
    .gte("visit_date", today)
    .eq("status", "confirmee")
    .order("visit_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createVisit(visit: VisitInsert) {
  const { data, error } = await supabase
    .from("visits")
    .insert(visit)
    .select()
    .single();

  if (error) throw error;
  return data as Visit;
}

export async function updateVisit(id: string, updates: VisitUpdate) {
  const { data, error } = await supabase
    .from("visits")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Visit;
}

export async function deleteVisit(id: string) {
  const { error } = await supabase
    .from("visits")
    .delete()
    .eq("id", id);

  if (error) throw error;
}