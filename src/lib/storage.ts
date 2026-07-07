import { supabase } from "@/integrations/supabase/client";

/**
 * Service pour gérer les uploads de fichiers vers Supabase Storage
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadFile(bucket: string, file: File): Promise<string> {
  // Validation de la taille
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Le fichier est trop volumineux. Taille maximale : ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Générer un nom de fichier unique
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const extension = file.name.split(".").pop();
  const fileName = `${timestamp}-${randomStr}.${extension}`;
  const filePath = `${fileName}`;

  // Upload vers Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Échec de l'upload : ${error.message}`);
  }

  // Obtenir l'URL publique
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const pathInfo = extractPathFromUrl(url);
    if (!pathInfo) {
      throw new Error("URL invalide");
    }

    const { error } = await supabase.storage
      .from(pathInfo.bucket)
      .remove([pathInfo.path]);

    if (error) {
      console.error("Delete error:", error);
      throw new Error(`Échec de la suppression : ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function listFiles(bucket: string, folder?: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder);

  if (error) {
    throw new Error(`Échec de la liste des fichiers : ${error.message}`);
  }

  return data.map((file) => {
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);
    return urlData.publicUrl;
  });
}

export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  const fileType = file.type;
  const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

  return acceptedTypes.some((type) => {
    if (type === "*") return true;
    if (type.startsWith(".")) return fileExtension === type;
    if (type.endsWith("/*")) {
      const category = type.split("/")[0];
      return fileType.startsWith(category);
    }
    return fileType === type;
  });
}

function extractPathFromUrl(url: string): { bucket: string; path: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.findIndex((part) => part === "object" && pathParts[pathParts.indexOf(part) + 1] === "public");
    
    if (bucketIndex !== -1 && pathParts.length > bucketIndex + 2) {
      const bucket = pathParts[bucketIndex + 2];
      const path = pathParts.slice(bucketIndex + 3).join("/");
      return { bucket, path };
    }
    return null;
  } catch {
    return null;
  }
}