import { useRef, useState, ChangeEvent, DragEvent } from "react";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFilesSelected: (files: FileList) => void;
}

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center p-5 sm:py-3 sm:px-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all gap-2 text-center w-full shadow-xs group ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary bg-card hover:bg-muted/50"
        }`}
      >
        <div className="size-10 sm:size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="size-5 sm:size-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground text-center">
            Toca aquí para seleccionar archivos
          </p>
        </div>
      </button>
    </>
  );
}
