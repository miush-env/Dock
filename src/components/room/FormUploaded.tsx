import { Button } from "@components/ui/button";
import { useUser } from "@clerk/react";
import { Loader2 } from "lucide-react";
import { useState, useEffect, MouseEvent as ReactMouseEvent } from "react";
import type { FileItem } from "./form-uploaded";
import {
  parseSelectedFiles,
  useCarousel,
  FileDropzone,
  FileCarousel,
  FileMetadataFields,
  FilePrefixSection,
} from "./form-uploaded";
import { useRoomId } from "@utils/WhatIsRoomId";

export interface FormUploadedProps {
  roomId?: string;
  apiUrl?: string;
  onFilesUploaded?: (newFiles: any[]) => void;
  onRefreshNeeded?: () => Promise<void>;
  onSuccess?: () => void;
}

function FormUploaded({
  roomId: propRoomId,
  apiUrl: propApiUrl,
  onFilesUploaded,
  onRefreshNeeded,
  onSuccess,
}: FormUploadedProps = {}) {
  const roomId = useRoomId();
  const activeRoomId = propRoomId || roomId;
  const API_URL =
    propApiUrl ||
    import.meta.env.VITE_API_URL ||
    `http://${window.location.hostname || "localhost"}:3000`;

  const { user } = useUser();
  const ownerFiles = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [showPrefix, setShowPrefix] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carousel = useCarousel(fileItems.length);

  // Si la cantidad de archivos baja a 2 o menos, replegar la opción de prefijo
  useEffect(() => {
    if (fileItems.length <= 2) {
      setShowPrefix(false);
    }
  }, [fileItems.length]);

  // Liberar URLs de memoria al desmontar
  useEffect(() => {
    return () => {
      fileItems.forEach((item) => {
        if (item.url) URL.revokeObjectURL(item.url);
      });
    };
  }, [fileItems]);

  const handleFilesSelected = (files: FileList) => {
    const newItems = parseSelectedFiles(files);
    setFileItems((prev) => [...prev, ...newItems]);

    if (fileItems.length === 0) {
      carousel.resetToFirst();
    }
  };

  const handleDeleteCurrent = (e?: ReactMouseEvent) => {
    if (e) e.stopPropagation();
    if (fileItems.length === 0) return;

    const targetIndex = carousel.displayIndex;
    const itemToDelete = fileItems[targetIndex];
    if (itemToDelete && itemToDelete.url) {
      URL.revokeObjectURL(itemToDelete.url);
    }

    const updated = fileItems.filter((_, index) => index !== targetIndex);
    setFileItems(updated);
    carousel.handleAfterDelete(targetIndex, updated.length);
  };

  const handleFieldChange = (field: "name" | "category", value: string) => {
    setFileItems((prev) =>
      prev.map((item, index) =>
        index === carousel.displayIndex ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileItems.length === 0 || isUploading) return;

    if (!activeRoomId) {
      setErrorMessage("No se encontró el ID de la sala.");
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append("roomId", activeRoomId);
      if (ownerFiles) {
        formData.append("ownerFiles", ownerFiles);
      }

      const trimmedPrefix = prefix.trim();

      fileItems.forEach((item) => {
        formData.append("image", item.file);

        // Si se especificó prefijo, se antepone al nombre
        const rawName = item.name.trim() || item.file.name.replace(/\.[^/.]+$/, "");
        const finalName = trimmedPrefix ? `${trimmedPrefix}${rawName}` : rawName;
        formData.append("fileName", finalName);

        // Grupo / Categoría
        formData.append("group", (item.category || "").trim());
      });

      const res = await fetch(`${API_URL}/sendFiles`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Error al subir los archivos");
      }

      const message = await res.json();

      if (message.files && Array.isArray(message.files)) {
        onFilesUploaded?.(message.files);
      }

      if (onRefreshNeeded) {
        await onRefreshNeeded();
      }

      // Limpiar estados y revocar URLs de vista previa
      fileItems.forEach((item) => {
        if (item.url) URL.revokeObjectURL(item.url);
      });
      setFileItems([]);
      setPrefix("");
      setShowPrefix(false);

      onSuccess?.();
    } catch (err: any) {
      console.error("Error al subir archivos:", err);
      setErrorMessage(err.message || "Error al subir archivos a la sala");
    } finally {
      setIsUploading(false);
    }
  };

  const currentItem = fileItems[carousel.displayIndex];

  // Si hay más de 1 archivo, preparamos los clones para el scroll infinito
  const slides =
    fileItems.length > 1
      ? [fileItems[fileItems.length - 1], ...fileItems, fileItems[0]]
      : fileItems;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-1 w-full max-w-full overflow-hidden box-border"
    >
      {/* Selector de archivos */}
      <FileDropzone onFilesSelected={handleFilesSelected} />

      {fileItems.length > 0 && currentItem && (
        <div className="flex flex-col gap-4 w-full min-w-0">
          {/* Carrusel de previsualización */}
          <FileCarousel
            slides={slides}
            totalFiles={fileItems.length}
            displayIndex={carousel.displayIndex}
            currentTransformIndex={carousel.currentTransformIndex}
            enableTransition={carousel.enableTransition}
            onTransitionEnd={carousel.handleTransitionEnd}
            onPrev={carousel.handlePrev}
            onNext={carousel.handleNext}
            onDeleteCurrent={handleDeleteCurrent}
            touchHandlers={carousel.touchHandlers}
          />

          {/* Campos Nombre y Categoría con outline claro */}
          <FileMetadataFields
            name={currentItem.name}
            category={currentItem.category}
            onChange={handleFieldChange}
          />
        </div>
      )}

      {/* Sección de Prefijo (solo con >2 archivos) */}
      {fileItems.length > 2 && (
        <FilePrefixSection
          showPrefix={showPrefix}
          prefix={prefix}
          onToggleShow={setShowPrefix}
          onPrefixChange={setPrefix}
        />
      )}

      {errorMessage && (
        <p className="text-xs text-destructive text-center font-medium">
          {errorMessage}
        </p>
      )}

      {/* Botón de subida */}
      <Button
        type="submit"
        disabled={fileItems.length === 0 || isUploading}
        className="w-full h-11 text-sm font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
      >
        {isUploading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            <span>
              Subiendo {fileItems.length} archivo{fileItems.length > 1 ? "s" : ""}...
            </span>
          </span>
        ) : (
          <span>
            Subir {fileItems.length > 0 ? `(${fileItems.length})` : ""}
          </span>
        )}
      </Button>
    </form>
  );
}

export default FormUploaded;
