import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Provider = Database["public"]["Tables"]["providers"]["Row"];
type ProviderInsert = Database["public"]["Tables"]["providers"]["Insert"];
type ProviderUpdate = Database["public"]["Tables"]["providers"]["Update"];

export async function getProviders() {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .order("company_name", { ascending: true });

  if (error) throw error;
  return data as Provider[];
}

export async function getProviderById(id: string) {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Provider;
}

export async function getProvidersByType(interventionType: string) {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .contains("intervention_types", [interventionType])
    .order("company_name", { ascending: true });

  if (error) throw error;
  return data as Provider[];
}

export async function createProvider(provider: ProviderInsert) {
  const { data, error } = await supabase
    .from("providers")
    .insert(provider)
    .select()
    .single();

  if (error) throw error;
  return data as Provider;
}

export async function updateProvider(id: string, updates: ProviderUpdate) {
  const { data, error } = await supabase
    .from("providers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Provider;
}

export async function deleteProvider(id: string) {
  const { error } = await supabase
    .from("providers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}