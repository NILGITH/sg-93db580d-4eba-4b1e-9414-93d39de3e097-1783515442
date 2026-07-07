import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"];
type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];

export async function getTenants() {
  const { data, error } = await supabase
    .from("tenants")
    .select("*, properties(reference, address)")
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getTenantById(id: string) {
  const { data, error } = await supabase
    .from("tenants")
    .select("*, properties(reference, address, city)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getTenantsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Tenant[];
}

export async function createTenant(tenant: TenantInsert) {
  const { data, error } = await supabase
    .from("tenants")
    .insert(tenant)
    .select()
    .single();

  if (error) throw error;
  return data as Tenant;
}

export async function updateTenant(id: string, updates: TenantUpdate) {
  const { data, error } = await supabase
    .from("tenants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Tenant;
}

export async function deleteTenant(id: string) {
  const { error } = await supabase
    .from("tenants")
    .delete()
    .eq("id", id);

  if (error) throw error;
}