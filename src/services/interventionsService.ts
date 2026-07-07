import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Intervention = Database["public"]["Tables"]["interventions"]["Row"];
type InterventionInsert = Database["public"]["Tables"]["interventions"]["Insert"];
type InterventionUpdate = Database["public"]["Tables"]["interventions"]["Update"];

export async function getInterventions() {
  const { data, error } = await supabase
    .from("interventions")
    .select("*, properties(reference, address, city), providers(company_name)")
    .order("intervention_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getInterventionById(id: string) {
  const { data, error } = await supabase
    .from("interventions")
    .select("*, properties(reference, address, city), providers(company_name, phone)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Intervention;
}

export async function getInterventionsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("interventions")
    .select("*, providers(company_name)")
    .eq("property_id", propertyId)
    .order("intervention_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getInterventionsByProvider(providerId: string) {
  const { data, error } = await supabase
    .from("interventions")
    .select("*, properties(reference, address, city)")
    .eq("provider_id", providerId)
    .order("intervention_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getInterventionsByStatus(status: Database["public"]["Enums"]["intervention_status"]) {
  const { data, error } = await supabase
    .from("interventions")
    .select("*, properties(reference, address, city), providers(company_name)")
    .eq("status", status)
    .order("intervention_date", { ascending: true });

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

export async function updateIntervention(id: string, intervention: InterventionUpdate) {
  const { data, error } = await supabase
    .from("interventions")
    .update(intervention)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Intervention;
}

export async function deleteIntervention(id: string) {
  const { error } = await supabase
    .from("interventions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}