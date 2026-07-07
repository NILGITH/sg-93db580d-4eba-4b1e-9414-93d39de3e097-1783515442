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

export async function getReportsByType(reportType: Database["public"]["Enums"]["report_type"]) {
  const { data, error } = await supabase
    .from("reports")
    .select("*, owners(first_name, last_name)")
    .eq("report_type", reportType)
    .order("period_start", { ascending: false });

  if (error) throw error;
  return data;
}

export async function generateReport(
  ownerId: string, 
  reportType: "mensuel" | "trimestriel" | "semestriel" | "annuel", 
  periodStart: string, 
  periodEnd: string
) {
  const { data: ownerProperties } = await supabase
    .from("properties")
    .select("id")
    .eq("owner_id", ownerId);

  const propertyIds = ownerProperties?.map(p => p.id) || [];

  const { data: payments } = await supabase
    .from("payments")
    .select("amount")
    .in("property_id", propertyIds)
    .gte("payment_date", periodStart)
    .lte("payment_date", periodEnd);

  const { data: interventions } = await supabase
    .from("interventions")
    .select("estimated_cost")
    .in("property_id", propertyIds)
    .gte("intervention_date", periodStart)
    .lte("intervention_date", periodEnd);

  const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const totalExpenses = interventions?.reduce((sum, i) => sum + (i.estimated_cost || 0), 0) || 0;
  const netIncome = totalRevenue - totalExpenses;

  const report: ReportInsert = {
    owner_id: ownerId,
    report_type: reportType,
    period_start: periodStart,
    period_end: periodEnd,
    total_revenue: totalRevenue,
    total_expenses: totalExpenses,
    net_income: netIncome
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