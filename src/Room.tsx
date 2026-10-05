import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { FileItem } from "@components/FileCard";
import { FileSection } from "@components/FileSection";
import Header from "@components/header";
import NoFilesRoom from "@components/room/NoFilesRoom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Button } from "@components/ui/Button";
import { FilePlus, LoaderCircle } from "lucide-react";
import FormUploaded from "@components/room/FormUploaded";
import { useRoomId } from "@utils/WhatIsRoomId";
import { createFileHandlers } from "@utils/handleFiles";
import RecentFiles from "@components/room/RecentFiles";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname || "localhost"}:3000`;

function Room() {
  const roomId = useRoomId();
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Conexión y escucha de Socket.io
  useEffect(() => {
    const socket = io(API_URL);

    if (!roomId) return;
    socket.emit("joinRoom", { roomId });

    return () => {
      socket.emit("leaveRoom", { roomId });
    };
  }, [roomId]);

  // Función para obtener todos los archivos recibidos desde Cloudflare R2
  async function viewFiles() {
    if (!roomId) {
      setIsInitialLoading(false);
      return;
    }

    try {
      setIsLoadingFiles(true);
      const res = await fetch(`${API_URL}/${roomId}`);
      const data: FileItem[] = await res.json();
      setAllFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar archivos:", err);
    } finally {
      setIsLoadingFiles(false);
      setIsInitialLoading(false);
    }
  }

  useEffect(() => {
    viewFiles();
  }, [roomId]);

  const { handleFilesUploaded, handleFileDeleted, handleFileRenamed } =
    createFileHandlers({ setRecentFiles, setAllFiles, viewFiles });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] flex flex-col items-center transition-colors duration-200">
      <Header />

      {isInitialLoading ? (
        <article className="flex flex-col items-center justify-center flex-1 min-h-[calc(100vh-6rem)] gap-3">
          <LoaderCircle className="size-10 animate-spin text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Cargando archivos de la sala...
          </p>
        </article>
      ) : allFiles.length === 0 ? (
        <article className="flex items-center justify-center h-screen">
          <NoFilesRoom
            onFilesUploaded={handleFilesUploaded}
            onRefreshNeeded={viewFiles}
          />
        </article>
      ) : (
        <main className="w-full flex flex-col items-center pt-20">
          <div className="bottom-0 right-0 fixed z-100 p-5">
            <Button
              className="rounded-full w-15 h-15"
              onClick={() => setIsOpen(true)}
            >
              <FilePlus className="size-8 scale-x-[-1]" />
            </Button>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md p-5 sm:p-6">
              <DialogHeader className="pr-14 text-left">
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                  Subir archivos
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Selecciona fotos, documentos o archivos para compartirlos en
                  la sala
                </DialogDescription>
              </DialogHeader>
              <FormUploaded
                onFilesUploaded={handleFilesUploaded}
                onRefreshNeeded={viewFiles}
                onSuccess={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <article>
            <RecentFiles
              recentFiles={recentFiles}
              onFileDeleted={handleFileDeleted}
              onFileRenamed={handleFileRenamed}
              roomId={roomId}
            />
          </article>

          <FileSection
            recentFiles={recentFiles}
            allFiles={allFiles}
            onRefresh={viewFiles}
            isLoadingAll={isLoadingFiles}
            roomId={roomId}
            onFileDeleted={handleFileDeleted}
            onFileRenamed={handleFileRenamed}
          />
        </main>
      )}
    </div>
  );
}

export default Room;
