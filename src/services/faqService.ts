import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type FaqItem = Database["public"]["Tables"]["faq_items"]["Row"];
type FaqItemInsert = Database["public"]["Tables"]["faq_items"]["Insert"];
type FaqItemUpdate = Database["public"]["Tables"]["faq_items"]["Update"];

export async function getFaqItems() {
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data as FaqItem[];
}

export async function getFaqItemsByCategory(category: string) {
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("category", category)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data as FaqItem[];
}

export async function createFaqItem(item: FaqItemInsert) {
  const { data, error } = await supabase
    .from("faq_items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data as FaqItem;
}

export async function updateFaqItem(id: string, updates: FaqItemUpdate) {
  const { data, error } = await supabase
    .from("faq_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as FaqItem;
}

export async function deleteFaqItem(id: string) {
  const { error } = await supabase
    .from("faq_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}