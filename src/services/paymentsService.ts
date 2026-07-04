import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];

export async function getPayments(agencyId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      properties (*)
    `)
    .eq("agency_id", agencyId)
    .order("payment_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOwnerPayments(ownerId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      properties (*)
    `)
    .eq("owner_id", ownerId)
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

export async function uploadPaymentProof(file: File, paymentId: string) {
  const fileExt = file.name.split(".").pop();
  const filePath = `payments/${paymentId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("documents")
    .getPublicUrl(filePath);

  return publicUrl;
}