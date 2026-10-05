import { useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "cn";
import type { FileItem } from "../FileCard";

interface FileThumbnailProps {
  file: FileItem;
  className?: string;
}

export function FileThumbnail({ file, className }: FileThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full h-32 bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {file.isImage && !imageError ? (
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : file.isImage && imageError ? (
        <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[11px]">Sin vista previa</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-0.5 text-slate-400 dark:text-slate-500 pointer-events-none">
          <FileText className="size-6 text-purple-600 dark:text-purple-400" />
          <span className="text-[9px] uppercase font-semibold bg-slate-200 dark:bg-slate-700/60 px-1 py-0.2 rounded text-slate-700 dark:text-slate-300 max-w-[40px] truncate">
            {file.name.includes(".") ? file.name.split(".").pop() : "archivo"}
          </span>
        </div>
      )}
    </div>
  );
}
