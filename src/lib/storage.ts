import { supabase } from "@/integrations/supabase/client";

/**
 * Service pour gérer les uploads de fichiers vers Supabase Storage
 */

// Buckets disponibles
export const STORAGE_BUCKETS = {
  PROPERTIES: "properties",
  DOCUMENTS: "documents",
  INTERVENTIONS: "interventions",
  PAYMENTS: "payments",
  CONTRACTS: "contracts",
  BLOG: "blog",
} as const;

/**
 * Upload un fichier vers un bucket Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder?: string
): Promise<{ url: string; path: string } | null> {
  try {
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload le fichier
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erreur upload fichier:", error);
      return null;
    }

    // Obtenir l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Erreur upload fichier:", error);
    return null;
  }
}

/**
 * Upload plusieurs fichiers
 */
export async function uploadMultipleFiles(
  files: File[],
  bucket: string,
  folder?: string
): Promise<Array<{ url: string; path: string }>> {
  const uploadPromises = files.map((file) => uploadFile(file, bucket, folder));
  const results = await Promise.all(uploadPromises);
  return results.filter((result) => result !== null) as Array<{
    url: string;
    path: string;
  }>;
}

/**
 * Supprime un fichier du storage
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Erreur suppression fichier:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur suppression fichier:", error);
    return false;
  }
}

/**
 * Supprime plusieurs fichiers
 */
export async function deleteMultipleFiles(
  bucket: string,
  filePaths: string[]
): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove(filePaths);

    if (error) {
      console.error("Erreur suppression fichiers:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur suppression fichiers:", error);
    return false;
  }
}

/**
 * Obtient l'URL publique d'un fichier
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return publicUrl;
}

/**
 * Valide le type et la taille d'un fichier
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMB = 10, allowedTypes = [] } = options;

  // Vérifier la taille
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Taille maximum : ${maxSizeMB}MB`,
    };
  }

  // Vérifier le type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés : ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Extrait le path d'une URL Supabase Storage
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Format: /storage/v1/object/public/{bucket}/{path}
    const bucketIndex = pathParts.indexOf("public");
    if (bucketIndex !== -1 && pathParts.length > bucketIndex + 2) {
      return pathParts.slice(bucketIndex + 2).join("/");
    }
    return null;
  } catch {
    return null;
  }
}