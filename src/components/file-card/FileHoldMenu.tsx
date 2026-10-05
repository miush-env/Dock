import { Share2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";

interface FileHoldMenuProps {
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  copied: boolean;
  isDeleting: boolean;
  onShare: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export function FileHoldMenu({
  fileName,
  isOpen,
  onClose,
  roomId,
  copied,
  isDeleting,
  onShare,
  onDelete,
}: FileHoldMenuProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xs sm:max-w-xs p-4 gap-3">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xs font-bold text-foreground truncate">
            {fileName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-1">
          {/* Opción Compartir */}
          <Button
            type="button"
            variant="secondary"
            onClick={onShare}
            className="w-full h-11 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-transparent"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? "¡Enlace copiado!" : "Compartir"}</span>
          </Button>

          {/* Opción Eliminar */}
          {roomId && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
              className="w-full h-11 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar archivo</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
