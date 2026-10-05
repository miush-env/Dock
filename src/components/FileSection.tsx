import {
  RefreshCw,
  FolderOpen,
  List,
  Table as TableIcon,
  Image as ImageIcon,
} from "lucide-react";
import { FileCard, type FileItem } from "./FileCard";
import { Button } from "@components/ui/button";
import { useState } from "react";
import ListView from "@components/room/viewMode/ListView";

interface FileSectionProps {
  allFiles?: FileItem[];
  onRefresh?: () => void;
  isLoadingAll?: boolean;
  roomId?: string;
  onFileDeleted?: (fileName: string) => void;
  onFileRenamed?: (oldName: string, newName: string) => void;
  recentFiles?: FileItem[];
}

export function FileSection({
  allFiles = [],
  onRefresh,
  isLoadingAll = false,
  roomId,
  onFileDeleted,
  onFileRenamed,
}: FileSectionProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const onToggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 mt-4">
      <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Archivos
            </h2>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">
              {allFiles.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoadingAll}
              className="flex items-center gap-1.5 cursor-pointer text-xs h-8 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw
                className={`w-3 h-3 ${isLoadingAll ? "animate-spin" : ""}`}
              />
              <span>Actualizar</span>
            </Button>
            <Button onClick={onToggleViewMode}>
              {viewMode === "list" ? <TableIcon /> : <List />}
              <span>{viewMode === "list" ? "Tabla" : "Lista"}</span>
            </Button>
          </div>
        </div>

        {allFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <ImageIcon className="w-8 h-8 mb-1.5 opacity-40 text-slate-400" />
            <p className="text-xs font-medium">
              No hay archivos en esta sala aún
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-hidden">
            {viewMode === "list" && (
              <ListView
                allFiles={allFiles}
                roomId={roomId}
                onFileDeleted={onFileDeleted}
                onFileRenamed={onFileRenamed}
              />
            )}
            {viewMode === "grid" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {allFiles.map((file, index) => (
                  <FileCard
                    key={`all-${file.name}-${index}`}
                    file={file}
                    onDeleted={onFileDeleted}
                    onRenamed={onFileRenamed}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
