import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Contract = Database["public"]["Tables"]["contracts"]["Row"];
type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"];
type ContractUpdate = Database["public"]["Tables"]["contracts"]["Update"];

export async function getContracts() {
  const { data, error } = await supabase
    .from("contracts")
    .select("*, properties(reference, address), tenants(first_name, last_name)")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActiveContracts() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("contracts")
    .select("*, properties(reference, address), tenants(first_name, last_name)")
    .eq("status", "en_cours")
    .lte("start_date", today)
    .gte("end_date", today)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getContractsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("contracts")
    .select("*, tenants(first_name, last_name, phone)")
    .eq("property_id", propertyId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getContractsByTenant(tenantId: string) {
  const { data, error } = await supabase
    .from("contracts")
    .select("*, properties(reference, address, city)")
    .eq("tenant_id", tenantId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createContract(contract: ContractInsert) {
  const { data, error } = await supabase
    .from("contracts")
    .insert(contract)
    .select()
    .single();

  if (error) throw error;
  return data as Contract;
}

export async function updateContract(id: string, updates: ContractUpdate) {
  const { data, error } = await supabase
    .from("contracts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Contract;
}

export async function deleteContract(id: string) {
  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}