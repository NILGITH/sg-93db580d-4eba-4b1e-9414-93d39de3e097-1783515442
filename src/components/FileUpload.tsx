import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, File } from "lucide-react";
import { uploadFile, deleteFile } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export interface FileUploadProps {
  bucket: string;
  accept?: string;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
  existingFiles?: string[];
  disabled?: boolean;
}

export function FileUpload({
  bucket,
  accept = "*",
  multiple = false,
  onUploadComplete,
  existingFiles = [],
  disabled = false,
}: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<string[]>(existingFiles);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = await uploadFile(bucket, file);
        uploadedUrls.push(url);
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      const newFiles = multiple ? [...files, ...uploadedUrls] : uploadedUrls;
      setFiles(newFiles);
      onUploadComplete(newFiles);

      toast({
        title: "Upload réussi",
        description: `${uploadedUrls.length} fichier(s) uploadé(s)`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: error instanceof Error ? error.message : "Impossible d'uploader le fichier",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveFile(url: string) {
    try {
      await deleteFile(url);
      const newFiles = files.filter((f) => f !== url);
      setFiles(newFiles);
      onUploadComplete(newFiles);

      toast({
        title: "Fichier supprimé",
        description: "Le fichier a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Upload en cours..." : "Choisir fichier(s)"}
        </Button>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-xs text-muted-foreground text-center">{Math.round(uploadProgress)}%</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
            >
              <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm flex-1 truncate">{url.split("/").pop()}</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveFile(url)}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}