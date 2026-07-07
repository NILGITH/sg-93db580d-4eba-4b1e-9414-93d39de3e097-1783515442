import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

export async function getPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*, properties(reference, address, city)")
    .order("payment_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPaymentById(id: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*, properties(reference, address, city)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function getPaymentsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("property_id", propertyId)
    .order("payment_date", { ascending: false });

  if (error) throw error;
  return data as Payment[];
}

export async function getPaymentsByDateRange(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*, properties(reference, address)")
    .gte("payment_date", startDate)
    .lte("payment_date", endDate)
    .order("payment_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPaymentsByMethod(method: Database["public"]["Enums"]["payment_method"]) {
  const { data, error } = await supabase
    .from("payments")
    .select("*, properties(reference, address)")
    .eq("payment_method", method)
    .order("payment_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPayment(payment: PaymentInsert) {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function updatePayment(id: string, payment: PaymentUpdate) {
  const { data, error } = await supabase
    .from("payments")
    .update(payment)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function deletePayment(id: string) {
  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id);

  if (error) throw error;
}