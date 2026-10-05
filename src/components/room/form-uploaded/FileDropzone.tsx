import { useRef, ChangeEvent } from "react";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFilesSelected: (files: FileList) => void;
}

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        id="file-input-dock"
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-border hover:border-primary rounded-2xl bg-card hover:bg-muted/50 cursor-pointer transition-all gap-2 text-center w-full shadow-xs group"
      >
        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="size-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">
            Toca aquí para seleccionar archivos
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Archivos, imágenes, ZIP, RAR, APK, EXE, documentos...
          </p>
        </div>
      </button>
    </>
  );
}
