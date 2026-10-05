import { ExternalLink, Info, Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { FileThumbnail } from "./file-card/FileThumbnail";
import { FileDetailsModal } from "./file-card/FileDetailsModal";
import { FileHoldMenu } from "./file-card/FileHoldMenu";
import { useFileActions } from "./file-card/useFileActions";

export interface FileItem {
  name: string;
  url: string;
  size?: number;
  formattedSize?: string;
  owner?: string;
  group?: string;
  category?: string;
  lastModified?: string | Date;
  isImage?: boolean;
}

export interface FileCardProps {
  file: FileItem;
  badge?: string;
  roomId?: string;
  onDeleted?: (fileName: string) => void;
  onRenamed?: (oldName: string, newName: string) => void;
}

export function FileCard({
  file,
  badge,
  roomId: roomIdProp,
  onDeleted,
  onRenamed,
}: FileCardProps) {

  const {
    roomId,
    showDetailsModal,
    setShowDetailsModal,
    showHoldMenu,
    setShowHoldMenu,
    isEditing,
    setIsEditing,
    newName,
    setNewName,
    isDeleting,
    isRenaming,
    copied,
    formattedDate,
    handleShare,
    handleDelete,
    handleRename,
    startLongPress,
    cancelLongPress,
  } = useFileActions({ file, roomId: roomIdProp, onDeleted, onRenamed });

  return (
    <>
      {/* TARJETA DEL ARCHIVO */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setShowHoldMenu(true);
        }}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        className="group relative flex flex-col bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md dark:hover:border-slate-700 transition-all select-none"
      >
        {badge && (
          <span className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
            {badge}
          </span>
        )}

        {/* Indicador de carga si se está borrando */}
        {isDeleting && (
          <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        )}

        {/* Vista previa o icono */}
        <FileThumbnail file={file} />

        {/* Info y Botones Cómodos */}
        <div className="p-3 flex flex-col justify-between flex-1 gap-2.5 bg-white dark:bg-[#111827]">
          <div className="min-w-0">
            <p
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate"
              title={file.name}
            >
              {file.name}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="truncate max-w-[100px]">
                {file.owner ? `Por: ${file.owner}` : "Anónimo"}
              </span>
              <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {file.formattedSize ||
                  (file.size ? `${(file.size / 1024).toFixed(1)} KB` : "—")}
              </span>
            </div>
          </div>

          {/* Botones de acción cómodos con Shadcn Button */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailsModal(true);
              }}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Detalles</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(file.url, "_blank", "noopener,noreferrer");
              }}
              className="h-8 gap-1 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir</span>
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL 1: DETALLES */}
      <FileDetailsModal
        file={file}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        roomId={roomId}
        newName={newName}
        setNewName={setNewName}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isRenaming={isRenaming}
        isDeleting={isDeleting}
        copied={copied}
        formattedDate={formattedDate}
        onShare={handleShare}
        onDelete={handleDelete}
        onRename={handleRename}
      />

      {/* MODAL 2: MENÚ DE PULSACIÓN PROLONGADA */}
      <FileHoldMenu
        fileName={file.name}
        isOpen={showHoldMenu}
        onClose={() => setShowHoldMenu(false)}
        roomId={roomId}
        copied={copied}
        isDeleting={isDeleting}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </>
  );
}
