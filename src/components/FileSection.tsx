import { RefreshCw, Clock, FolderOpen, Image as ImageIcon } from "lucide-react";
import { FileCard, type FileItem } from "./FileCard";
import { Button } from "./ui/button";

interface FileSectionProps {
  recentFiles?: FileItem[];
  allFiles?: FileItem[];
  onRefresh?: () => void;
  isLoadingAll?: boolean;
}

export function FileSection({
  recentFiles = [],
  allFiles = [],
  onRefresh,
  isLoadingAll = false,
}: FileSectionProps) {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-10 mt-6 px-4">
      {/* SECCIÓN 1: Archivos recién enviados */}
      <section className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            Archivos recién enviados (Vista previa)
          </h2>
          <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full ml-auto">
            {recentFiles.length} {recentFiles.length === 1 ? "archivo" : "archivos"}
          </span>
        </div>

        {recentFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <ImageIcon className="w-10 h-10 mb-2 opacity-50 text-blue-400" />
            <p className="text-sm font-medium">Aún no has subido archivos en esta sesión</p>
            <p className="text-xs text-gray-400 mt-1">
              Envía archivos usando el formulario para previsualizarlos aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentFiles.map((file, index) => (
              <FileCard key={`${file.name}-${index}`} file={file} badge="Recién enviado" />
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN 2: Todos los archivos recibidos */}
      <section className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Todos los archivos recibidos
            </h2>
            <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full">
              {allFiles.length}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoadingAll}
            className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-100"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAll ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </Button>
        </div>

        {allFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <FolderOpen className="w-10 h-10 mb-2 opacity-40 text-gray-400" />
            <p className="text-sm font-medium">No hay archivos en el servidor</p>
            <p className="text-xs text-gray-400 mt-1">
              Los archivos que se almacenen en el servidor aparecerán en esta sección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allFiles.map((file, index) => (
              <FileCard key={`${file.name}-${index}`} file={file} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
