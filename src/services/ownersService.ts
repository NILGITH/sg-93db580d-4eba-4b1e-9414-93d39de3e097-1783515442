import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Owner = Database["public"]["Tables"]["owners"]["Row"];
type OwnerInsert = Database["public"]["Tables"]["owners"]["Insert"];
type OwnerUpdate = Database["public"]["Tables"]["owners"]["Update"];

export async function getOwners() {
  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data as Owner[];
}

export async function getOwnerById(id: string) {
  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Owner;
}

export async function getOwnerProperties(ownerId: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createOwner(owner: OwnerInsert) {
  const { data, error } = await supabase
    .from("owners")
    .insert(owner)
    .select()
    .single();

  if (error) throw error;
  return data as Owner;
}

export async function updateOwner(id: string, updates: OwnerUpdate) {
  const { data, error } = await supabase
    .from("owners")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Owner;
}

export async function deleteOwner(id: string) {
  const { error } = await supabase
    .from("owners")
    .delete()
    .eq("id", id);

  if (error) throw error;
}