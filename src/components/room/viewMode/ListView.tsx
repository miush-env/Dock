import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Send, Trash, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FileThumbnail } from "@/components/file-card/FileThumbnail";
import { FileDetailsModal } from "@components/file-card/FileDetailsModal";
import { useFileActions } from "@components/file-card/useFileActions";
import type { FileItem } from "@components/FileCard";

interface FileTableRowProps {
  file: FileItem;
  roomId?: string;
  onDeleted?: (fileName: string) => void;
  onRenamed?: (oldName: string, newName: string) => void;
}

function FileTableRow({
  file,
  roomId,
  onDeleted,
  onRenamed,
}: FileTableRowProps) {
  const {
    showDetailsModal,
    setShowDetailsModal,
    newName,
    setNewName,
    isEditing,
    setIsEditing,
    isRenaming,
    isDeleting,
    copied,
    formattedDate,
    handleShare,
    handleDelete,
    handleRename,
  } = useFileActions({ file, roomId, onDeleted, onRenamed });

  return (
    <>
      <TableRow className="hover:bg-muted/50 transition-colors">
        <TableCell className="w-16 p-2">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
            <FileThumbnail file={file} className="w-10 h-10" />
          </div>
        </TableCell>

        <TableCell className="max-w-[200px] sm:max-w-xs">
          <div className="flex flex-col min-w-0">
            <span
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate"
              title={file.name}
            >
              {file.name}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
              <span>{file.owner ? `Por: ${file.owner}` : "Anónimo"}</span>
              <span>•</span>
              <span className="font-mono text-[10px]">
                {file.formattedSize ||
                  (file.size ? `${(file.size / 1024).toFixed(1)} KB` : "—")}
              </span>
            </div>
          </div>
        </TableCell>

        <TableCell className="text-right w-20 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <Ellipsis className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  setIsEditing(false);
                  setShowDetailsModal(true);
                }}
                className="cursor-pointer flex items-center justify-between"
              >
                <span>Detalles</span>
                <Info className="size-3.5" />
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setIsEditing(true);
                  setShowDetailsModal(true);
                }}
                className="cursor-pointer flex items-center justify-between"
              >
                <span>Editar</span>
                <Pencil className="size-3.5" />
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleShare}
                className="cursor-pointer flex items-center justify-between"
              >
                <span>Compartir</span>
                <Send className="size-3.5" />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleDelete}
                variant="destructive"
                className="cursor-pointer flex items-center justify-between"
              >
                <span>Eliminar</span>
                <Trash className="size-3.5" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

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
    </>
  );
}

interface ListViewProps {
  allFiles?: FileItem[];
  roomId?: string;
  onFileDeleted?: (fileName: string) => void;
  onFileRenamed?: (oldName: string, newName: string) => void;
}

export default function ListView({
  allFiles = [],
  roomId,
  onFileDeleted,
  onFileRenamed,
}: ListViewProps) {
  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Icono</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead className="text-right w-20">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allFiles.map((file, index) => (
          <FileTableRow
            key={`list-${file.name}-${index}`}
            file={file}
            roomId={roomId}
            onDeleted={onFileDeleted}
            onRenamed={onFileRenamed}
          />
        ))}
      </TableBody>
    </Table>
  );
}
