import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router";
import type { FileItem } from "@components/FileCard";
import { useUser } from "@clerk/react";
import { FileSection } from "@components/FileSection";
import Header from "@components/header";
import FormUpload from "@components/room/FormUpload";
import addFileIcon from "/addFile.svg";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname || "localhost"}:3000`;

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const { user } = useUser();
  const ownerFiles = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomId) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("roomId", roomId);
    if (ownerFiles) {
      formData.append("ownerFiles", ownerFiles);
    }

    try {
      setIsUploading(true);
      const res = await fetch(`${API_URL}/sendFiles`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error en la subida");
      }

      const message = await res.json();

      if (message.files && Array.isArray(message.files)) {
        setRecentFiles(message.files);
      }

      await viewFiles();
      form.reset();
    } catch (err) {
      console.error("Error al enviar archivos:", err);
    } finally {
      setIsUploading(false);
    }
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

      <img src={addFileIcon} alt="Add File" className="w-xl h-xl" />

      <main className="w-full max-w-4xl flex flex-col items-center pt-24 pb-16 px-4 gap-8">
        {/* Formulario migrado a componente modular */}
        <FormUpload isUploading={isUploading} handleSubmit={handleSubmit} />

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
