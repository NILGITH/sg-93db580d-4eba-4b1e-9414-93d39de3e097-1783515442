import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(reference, address, city)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActiveBookings() {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(reference, address, city)")
    .gte("end_date", today)
    .eq("status", "confirmee")
    .order("start_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getBookingsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("property_id", propertyId)
    .order("start_date", { ascending: true });

  if (error) throw error;
  return data as Booking[];
}

export async function checkAvailability(propertyId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("property_id", propertyId)
    .eq("status", "confirmee")
    .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

  if (error) throw error;
  return data.length === 0;
}

export async function createBooking(booking: BookingInsert) {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function updateBooking(id: string, updates: BookingUpdate) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function cancelBooking(id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "annulee" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}