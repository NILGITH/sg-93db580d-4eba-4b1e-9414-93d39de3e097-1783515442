import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File as FileIcon, Image as ImageIcon } from "lucide-react";
import { uploadFile, validateFile, deleteFile } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  bucket: string;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onUploadComplete?: (urls: string[]) => void;
  value?: string[];
  onChange?: (urls: string[]) => void;
  label?: string;
  description?: string;
}

export function FileUpload({
  bucket,
  folder,
  accept,
  maxSizeMB = 10,
  multiple = false,
  onUploadComplete,
  value = [],
  onChange,
  label = "Upload de fichiers",
  description,
}: FileUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; path: string; name: string }>>(
    value.map((url) => ({ url, path: "", name: url.split("/").pop() || "" }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const results = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Valider le fichier
        const validation = validateFile(file, {
          maxSizeMB,
          allowedTypes: accept?.split(",").map((t) => t.trim()),
        });

        if (!validation.valid) {
          toast({
            title: "Fichier invalide",
            description: validation.error,
            variant: "destructive",
          });
          continue;
        }

        // Upload
        const result = await uploadFile(file, bucket, folder);

        if (result) {
          results.push({
            url: result.url,
            path: result.path,
            name: file.name,
          });
        }

        setProgress(((i + 1) / files.length) * 100);
      }

      const newFiles = multiple ? [...uploadedFiles, ...results] : results;
      setUploadedFiles(newFiles);

      if (onChange) {
        onChange(newFiles.map((f) => f.url));
      }

      if (onUploadComplete) {
        onUploadComplete(newFiles.map((f) => f.url));
      }

      toast({
        title: "Upload réussi",
        description: `${results.length} fichier(s) uploadé(s)`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader les fichiers",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function removeFile(index: number) {
    const fileToRemove = uploadedFiles[index];
    
    if (fileToRemove.path) {
      await deleteFile(bucket, fileToRemove.path);
    }

    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    if (onChange) {
      onChange(newFiles.map((f) => f.url));
    }
  }

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium">{label}</label>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Upload en cours..." : "Choisir fichier(s)"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative group border rounded-lg p-2 hover:shadow-md transition-shadow">
              {isImage(file.url) ? (
                <div className="aspect-square bg-muted rounded overflow-hidden mb-2">
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-muted rounded flex items-center justify-center mb-2">
                  <FileIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}

              <p className="text-xs truncate">{file.name}</p>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={() => removeFile(index)}
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