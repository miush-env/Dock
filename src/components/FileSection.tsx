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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const filterItems = [
  { label: "Todos", value: "all" },
  { label: "Imágenes", value: "Imagen" },
  { label: "Videos", value: "Video" },
];

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
  const [filter, setFilter] = useState<string>("");

  const onToggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const logFilter = (value: string | null) => {
    setFilter(value === "all" || !value ? "" : value);
  };

  const filteredFiles = filter
    ? allFiles.filter((file) => file.category === filter)
    : allFiles;

  return (
    <div className="w-full lg:px-12 flex flex-col gap-8 mt-4">
      <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Archivos
            </h2>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">
              {filteredFiles.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Selector de filtro por tipo */}
            <Select
              value={filter || "all"}
              onValueChange={logFilter}
            >
              <SelectTrigger className="w-32 sm:w-36 h-8 text-xs cursor-pointer">
                <SelectValue placeholder="Filtrar tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo de archivo</SelectLabel>
                  {filterItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Botones individuales en fila para pantallas medianas/grandes (computadora) */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoadingAll}
                className="h-8 text-xs gap-1.5 cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <RefreshCw
                  className={`size-3.5 text-purple-600 dark:text-purple-400 ${isLoadingAll ? "animate-spin" : ""}`}
                />
                <span>Actualizar</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onToggleViewMode}
                className="h-8 text-xs gap-1.5 cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                {viewMode === "list" ? (
                  <TableIcon className="size-3.5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <List className="size-3.5 text-purple-600 dark:text-purple-400" />
                )}
                <span>{viewMode === "list" ? "Tabla" : "Cuadrícula"}</span>
              </Button>
            </div>

            {/* Menú de Ajustes comprimido solo para pantallas pequeñas (móvil) */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs cursor-pointer"
                    >
                      Ajustes
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48 p-2 flex flex-col gap-1.5">
                  <DropdownMenuGroup className="flex flex-col gap-1.5">
                    <DropdownMenuItem
                      onClick={onRefresh}
                      disabled={isLoadingAll}
                      className="cursor-pointer flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all shadow-2xs text-slate-800 dark:text-slate-200"
                    >
                      <span>Actualizar</span>
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${isLoadingAll ? "animate-spin" : ""}`}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onToggleViewMode}
                      className="cursor-pointer flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all shadow-2xs text-slate-800 dark:text-slate-200"
                    >
                      <span>
                        {viewMode === "list" ? "Ver Cuadrícula" : "Ver Tabla"}
                      </span>
                      {viewMode === "list" ? (
                        <TableIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <List className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {allFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <ImageIcon className="w-8 h-8 mb-1.5 opacity-40 text-slate-400" />
            <p className="text-xs font-medium">
              No hay archivos en esta sala aún
            </p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <ImageIcon className="w-8 h-8 mb-1.5 opacity-40 text-slate-400" />
            <p className="text-xs font-medium">
              No hay archivos en esta categoría
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-hidden">
            {viewMode === "list" && (
              <ListView
                allFiles={filteredFiles}
                roomId={roomId}
                onFileDeleted={onFileDeleted}
                onFileRenamed={onFileRenamed}
                filterValue={filter}
              />
            )}
            {viewMode === "grid" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredFiles.map((file, index) => (
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
