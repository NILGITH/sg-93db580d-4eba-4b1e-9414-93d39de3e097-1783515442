import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Report = Database["public"]["Tables"]["reports"]["Row"];
type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];

export async function getReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*, owners(first_name, last_name)")
    .order("period_start", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReportsByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("owner_id", ownerId)
    .order("period_start", { ascending: false });

  if (error) throw error;
  return data as Report[];
}

export async function getReportsByType(type: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*, owners(first_name, last_name)")
    .eq("type", type)
    .order("period_start", { ascending: false });

  if (error) throw error;
  return data;
}

export async function generateReport(ownerId: string, type: "monthly" | "quarterly" | "semi-annual", periodStart: string, periodEnd: string) {
  // Calculer les données du rapport
  const { data: payments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "paid")
    .gte("payment_date", periodStart)
    .lte("payment_date", periodEnd)
    .in("property_id", 
      supabase
        .from("properties")
        .select("id")
        .eq("owner_id", ownerId)
    );

  const { data: interventions } = await supabase
    .from("interventions")
    .select("cost")
    .gte("intervention_date", periodStart)
    .lte("intervention_date", periodEnd)
    .in("property_id",
      supabase
        .from("properties")
        .select("id")
        .eq("owner_id", ownerId)
    );

  const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const totalExpenses = interventions?.reduce((sum, i) => sum + (i.cost || 0), 0) || 0;
  const netIncome = totalRevenue - totalExpenses;

  const report: ReportInsert = {
    owner_id: ownerId,
    type,
    period_start: periodStart,
    period_end: periodEnd,
    total_revenue: totalRevenue,
    total_expenses: totalExpenses,
    net_income: netIncome,
    data: {
      payments: payments?.length || 0,
      interventions: interventions?.length || 0
    }
  };

  return createReport(report);
}

export async function createReport(report: ReportInsert) {
  const { data, error } = await supabase
    .from("reports")
    .insert(report)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}