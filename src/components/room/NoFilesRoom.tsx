import addFileIcon from "/folder&&files.png";
import dockPet from "/cloudee-snapshot.svg";
import { Button } from "@components/ui/button";
import { Plus, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createAvatar } from "@bible-strong/avatar-react";
import cloudeeJson from "../../../public/onee-avatar/cloudee.avatar.json";

import FormUploaded from "@/components/room/FormUploaded";
import { useState } from "react";
import type { FileItem } from "@components/FileCard";

const CloudeeAvatar = createAvatar(cloudeeJson);

interface NoFilesRoomProps {
  onFilesUploaded?: (files: FileItem[]) => void;
  onRefreshNeeded?: () => Promise<void>;
}

function NoFilesRoom({
  onFilesUploaded,
  onRefreshNeeded,
}: NoFilesRoomProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex flex-col items-center justify-center">
      {/* <img src={dockPet} alt="mascota de la app" className="w-30 h-30" /> */}
      <CloudeeAvatar animation="search" size={150} />
      <img
        src={addFileIcon}
        alt="Add File"
        className="w-30 h-30"
        onClick={() => setIsOpen(true)}
      />
      <div className="flex flex-col items-center justify-center gap-1 max-w-xs">
        <p className="text-lg font-bold">Aún no hay archivos</p>
        <p className="text-sm text-gray-500 text-center font-semibold text-balance">
          Subi tu primer archivo para comenzar.
        </p>
        <Button
          className="py-5 w-full flex items-center gap-2 uppercase mt-4"
          onClick={() => setIsOpen(true)}
        >
          <span>Comenzar a subir</span>
          <Upload />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-5 sm:p-6">
          <DialogHeader className="pr-14 text-left">
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              Subir archivos
            </DialogTitle>
          </DialogHeader>
          <FormUploaded
            onFilesUploaded={onFilesUploaded}
            onRefreshNeeded={onRefreshNeeded}
            onSuccess={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default NoFilesRoom;
