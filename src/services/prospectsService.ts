import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Prospect = Database["public"]["Tables"]["prospects"]["Row"];
type ProspectInsert = Database["public"]["Tables"]["prospects"]["Insert"];
type ProspectUpdate = Database["public"]["Tables"]["prospects"]["Update"];

export async function getProspects() {
  const { data, error } = await supabase
    .from("prospects")
    .select("*, properties(reference, address)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProspectsByStatus(status: string) {
  const { data, error } = await supabase
    .from("prospects")
    .select("*, properties(reference, address)")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProspectById(id: string) {
  const { data, error } = await supabase
    .from("prospects")
    .select("*, properties(reference, address, city)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProspect(prospect: ProspectInsert) {
  const { data, error } = await supabase
    .from("prospects")
    .insert(prospect)
    .select()
    .single();

  if (error) throw error;
  return data as Prospect;
}

export async function updateProspect(id: string, updates: ProspectUpdate) {
  const { data, error } = await supabase
    .from("prospects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Prospect;
}

export async function deleteProspect(id: string) {
  const { error } = await supabase
    .from("prospects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}