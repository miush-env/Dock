import addFileIcon from "/addFile.svg";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import FormUploaded from "@/components/room/FormUploaded";
import { useState } from "react";
import type { FileItem } from "@components/FileCard";

interface NoFilesRoomProps {
  onFilesUploaded?: (files: FileItem[]) => void;
  onRefreshNeeded?: () => Promise<void>;
}

function NoFilesRoom({ onFilesUploaded, onRefreshNeeded }: NoFilesRoomProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex flex-col items-center justify-center">
      <img src={addFileIcon} alt="Add File" className="w-xl h-xl" onClick={() => setIsOpen(true)} />
      <div className="flex flex-col items-center justify-center gap-2 max-w-xs">
        <p className="text-lg font-bold">
          Aún no hay archivos en esta sala
        </p>
        <p className="text-sm text-gray-500 text-center font-semibold text-balance">
          No te preocupes: para romper el hielo solo hace falta dar el primer
          paso. Elige un documento, foto o recurso desde tu dispositivo y
          comencemos a mover las cosas por aquí.
        </p>
        <Button
          className="py-5 w-full flex items-center gap-2 uppercase mt-4"
          onClick={() => setIsOpen(true)}
        >
          <span>Comenzar a subir</span>
          <Plus />
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md p-5 sm:p-6">
            <DialogHeader className="pr-14 text-left">
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                Subir archivos
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Selecciona fotos, documentos o archivos para compartirlos en la sala
              </DialogDescription>
            </DialogHeader>
            <FormUploaded
              onFilesUploaded={onFilesUploaded}
              onRefreshNeeded={onRefreshNeeded}
              onSuccess={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default NoFilesRoom;
