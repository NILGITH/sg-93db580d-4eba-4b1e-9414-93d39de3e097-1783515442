import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];

export async function getDocuments() {
  const { data, error } = await supabase
    .from("documents")
    .select("*, properties(reference, address)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDocumentsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Document[];
}

export async function getDocumentsByType(propertyId: string, type: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("property_id", propertyId)
    .eq("type", type)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Document[];
}

export async function uploadDocument(file: File, propertyId: string, type: string, title: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("documents")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(fileName);

  const document: DocumentInsert = {
    property_id: propertyId,
    name: title,
    type,
    file_url: urlData.publicUrl,
    mime_type: file.type,
    file_size: file.size
  };

  return createDocument(document);
}

export async function createDocument(document: DocumentInsert) {
  const { data, error } = await supabase
    .from("documents")
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

export async function updateDocument(id: string, updates: DocumentUpdate) {
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) throw error;
}