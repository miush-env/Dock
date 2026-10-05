import {
  Check,
  Loader2,
  Edit2,
  User,
  HardDrive,
  Calendar,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import type { FileItem } from "../FileCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

interface FileDetailsModalProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  newName: string;
  setNewName: (name: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isRenaming: boolean;
  isDeleting: boolean;
  copied: boolean;
  formattedDate: string | null;
  onShare: () => Promise<void>;
  onDelete: () => Promise<void>;
  onRename: () => Promise<void>;
}

export function FileDetailsModal({
  file,
  isOpen,
  onClose,
  roomId,
  newName,
  setNewName,
  isEditing,
  setIsEditing,
  isRenaming,
  isDeleting,
  copied,
  formattedDate,
  onShare,
  onDelete,
  onRename,
}: FileDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm p-5 gap-4">
        {/* Header del modal */}
        <DialogHeader className="pr-8">
          <DialogTitle className="text-sm font-bold text-foreground">
            Detalles del archivo
          </DialogTitle>
        </DialogHeader>

        {/* Renombrar o ver nombre */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Nombre del archivo
          </span>

          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="flex-1 text-xs h-8"
              />
              <Button
                type="button"
                onClick={onRename}
                disabled={isRenaming}
                size="sm"
                className="h-8 px-2.5 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                {isRenaming ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setNewName(file.name);
                  setIsEditing(false);
                }}
                className="h-8 px-2.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-lg border border-border">
              <span className="text-xs font-medium text-foreground break-all">
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setIsEditing(true)}
                className="text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/50 flex items-center gap-1 ml-2 shrink-0 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Cambiar</span>
              </Button>
            </div>
          )}
        </div>

        {/* Metadatos (Quién lo envió, peso, fecha) */}
        <div className="flex flex-col gap-2 bg-muted/40 p-3 rounded-xl border border-border text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <User className="w-3.5 h-3.5 text-purple-500" />
              <span>Enviado por:</span>
            </span>
            <span className="font-semibold text-foreground">
              {file.owner || "Anónimo"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <HardDrive className="w-3.5 h-3.5 text-purple-500" />
              <span>Tamaño:</span>
            </span>
            <span className="font-mono font-medium text-foreground">
              {file.formattedSize ||
                (file.size
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : "Desconocido")}
            </span>
          </div>

          {formattedDate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span>Fecha:</span>
              </span>
              <span className="text-foreground">{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Botones de acción del Modal (Compartir / Eliminar) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={onShare}
            className="w-full h-10 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-transparent"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {copied
                ? "¡Enlace copiado al portapapeles!"
                : "Compartir archivo"}
            </span>
          </Button>

          {roomId && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
              className="w-full h-10 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar archivo de la sala</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
