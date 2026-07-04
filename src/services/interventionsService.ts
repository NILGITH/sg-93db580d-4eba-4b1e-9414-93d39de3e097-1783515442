import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Intervention = Database["public"]["Tables"]["interventions"]["Row"];
type InterventionInsert = Database["public"]["Tables"]["interventions"]["Insert"];
type InterventionUpdate = Database["public"]["Tables"]["interventions"]["Update"];

export async function getInterventions(agencyId: string) {
  const { data, error } = await supabase
    .from("interventions")
    .select(`
      *,
      properties (*),
      providers (*)
    `)
    .eq("agency_id", agencyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProviderInterventions(providerId: string) {
  const { data, error } = await supabase
    .from("interventions")
    .select(`
      *,
      properties (*)
    `)
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createIntervention(intervention: InterventionInsert) {
  const { data, error } = await supabase
    .from("interventions")
    .insert(intervention)
    .select()
    .single();

  if (error) throw error;
  return data as Intervention;
}

export async function updateIntervention(id: string, updates: InterventionUpdate) {
  const { data, error } = await supabase
    .from("interventions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Intervention;
}