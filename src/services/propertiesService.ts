import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*, owners(first_name, last_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPublishedProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Property[];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*, owners(first_name, last_name, email, phone)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function searchProperties(filters: {
  transaction_type?: string;
  property_type?: string;
  city?: string;
  district?: string;
  min_price?: number;
  max_price?: number;
  min_rooms?: number;
  min_surface?: number;
}) {
  let query = supabase
    .from("properties")
    .select("*")
    .eq("published", true);

  if (filters.transaction_type) {
    query = query.eq("transaction_type", filters.transaction_type);
  }
  if (filters.property_type) {
    query = query.eq("property_type", filters.property_type);
  }
  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }
  if (filters.district) {
    query = query.ilike("district", `%${filters.district}%`);
  }
  if (filters.min_price) {
    query = query.gte("price", filters.min_price);
  }
  if (filters.max_price) {
    query = query.lte("price", filters.max_price);
  }
  if (filters.min_rooms) {
    query = query.gte("rooms", filters.min_rooms);
  }
  if (filters.min_surface) {
    query = query.gte("surface", filters.min_surface);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data as Property[];
}

export async function createProperty(property: PropertyInsert) {
  const { data, error } = await supabase
    .from("properties")
    .insert(property)
    .select()
    .single();

  if (error) throw error;
  return data as Property;
}

export async function updateProperty(id: string, updates: PropertyUpdate) {
  const { data, error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Property;
}

export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) throw error;
}