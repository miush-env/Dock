import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router";
import type { FileItem } from "@components/FileCard";
import { FileSection } from "@components/FileSection";
import Header from "@components/header";
import FormUpload from "@components/room/FormUpload";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname || "localhost"}:3000`;

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

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
    if (!roomId) return;

    try {
      setIsLoadingFiles(true);
      const res = await fetch(`${API_URL}/${roomId}`);
      const data: FileItem[] = await res.json();
      setAllFiles(data);
    } catch (err) {
      console.error("Error al cargar archivos:", err);
    } finally {
      setIsLoadingFiles(false);
    }
  }

  useEffect(() => {
    viewFiles();
  }, [roomId]);

  const handleFilesUploaded = (newFiles: FileItem[]) => {
    setRecentFiles(newFiles);
  };

  const handleFileDeleted = (deletedName: string) => {
    setAllFiles((prev) => prev.filter((f) => f.name !== deletedName));
    setRecentFiles((prev) => prev.filter((f) => f.name !== deletedName));
  };

  const handleFileRenamed = (oldName: string, newName: string) => {
    const updateList = (files: FileItem[]) =>
      files.map((f) => (f.name === oldName ? { ...f, name: newName } : f));
    setAllFiles(updateList);
    setRecentFiles(updateList);
    viewFiles();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] flex flex-col items-center transition-colors duration-200">
      <Header />

      <main className="w-full max-w-4xl flex flex-col items-center pt-24 pb-16 px-4 gap-8">
        {/* Formulario de subida de archivos */}
        <FormUpload
          roomId={roomId}
          apiUrl={API_URL}
          onFilesUploaded={handleFilesUploaded}
          onRefreshNeeded={viewFiles}
        />

        {/* Listado de archivos recién subidos y todos los de la sala */}
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
    </div>
  );
}

export default Room;
