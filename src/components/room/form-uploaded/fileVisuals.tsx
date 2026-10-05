import {
  FileArchive,
  FileCode,
  FileText,
  Package,
  FileAudio,
  FileVideo,
  File as FileIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { FileItem } from "./types";

// ---------------------------------------------------------------------------
// MAPA DE IMÁGENES / ICONOS PERSONALIZADOS (PARA EL DESARROLLADOR):
// Si tienes imágenes personalizadas (ej: en /public/icons/rar.png o assets),
// puedes agregarlas aquí y tendrán prioridad visual sobre los iconos.
// ---------------------------------------------------------------------------
export const CUSTOM_EXTENSION_IMAGES: Record<string, string> = {
  // rar: "/icons/rar.png",
  // zip: "/icons/zip.png",
  // exe: "/icons/exe.png",
  // apk: "/icons/apk.png",
};

export function renderExtensionVisual(ext: string): ReactNode {
  const lowerExt = ext.toLowerCase();

  // Si definiste una imagen personalizada para esta extensión, la muestra
  if (CUSTOM_EXTENSION_IMAGES[lowerExt]) {
    return (
      <img
        src={CUSTOM_EXTENSION_IMAGES[lowerExt]}
        alt={ext}
        className="size-14 object-contain pointer-events-none select-none"
      />
    );
  }

  // De lo contrario, usamos iconos temáticos por tipo de archivo
  switch (lowerExt) {
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FileArchive className="size-12 text-amber-500 stroke-[1.8]" />;
    case "exe":
    case "msi":
    case "bin":
    case "apk":
      return <Package className="size-12 text-purple-500 stroke-[1.8]" />;
    case "html":
    case "css":
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "json":
      return <FileCode className="size-12 text-cyan-500 stroke-[1.8]" />;
    case "txt":
    case "md":
    case "pdf":
    case "doc":
    case "docx":
      return <FileText className="size-12 text-blue-500 stroke-[1.8]" />;
    case "mp3":
    case "wav":
    case "ogg":
      return <FileAudio className="size-12 text-pink-500 stroke-[1.8]" />;
    case "mp4":
    case "mkv":
    case "webm":
      return <FileVideo className="size-12 text-rose-500 stroke-[1.8]" />;
    default:
      return <FileIcon className="size-12 text-slate-400 stroke-[1.8]" />;
  }
}

export function parseSelectedFiles(files: FileList | File[]): FileItem[] {
  return Array.from(files).map((file) => {
    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpe?g|png|gif|webp|svg|bmp|ico|avif)$/i.test(file.name);

    const extension = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase() || ""
      : "";

    return {
      file,
      url: isImage ? URL.createObjectURL(file) : "",
      name: file.name.replace(/\.[^/.]+$/, ""),
      category: isImage
        ? "Imagen"
        : extension
        ? extension.toUpperCase()
        : "Archivo",
      isImage,
      extension,
    };
  });
}
