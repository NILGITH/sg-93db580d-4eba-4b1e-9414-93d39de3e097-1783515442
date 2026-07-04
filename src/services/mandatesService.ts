import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Mandate = Database["public"]["Tables"]["mandates"]["Row"];
type MandateInsert = Database["public"]["Tables"]["mandates"]["Insert"];
type MandateUpdate = Database["public"]["Tables"]["mandates"]["Update"];

export async function getMandates(agencyId: string) {
  const { data, error } = await supabase
    .from("mandates")
    .select(`
      *,
      properties (*),
      profiles (*)
    `)
    .eq("agency_id", agencyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMandateById(id: string) {
  const { data, error } = await supabase
    .from("mandates")
    .select(`
      *,
      properties (*),
      profiles (*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createMandate(mandate: MandateInsert) {
  const { data, error } = await supabase
    .from("mandates")
    .insert(mandate)
    .select()
    .single();

  if (error) throw error;
  return data as Mandate;
}

export async function updateMandate(id: string, updates: MandateUpdate) {
  const { data, error } = await supabase
    .from("mandates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Mandate;
}