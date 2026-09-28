import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Upload, Loader2, KeyRound } from "lucide-react";
import { useParams } from "react-router";
import type { FileItem } from "@/components/FileCard";
import { FileSection } from "@/components/FileSection";
import Header from "./components/header";

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname || "localhost"}:3000`;

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomId) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("roomId", roomId);

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

      <main className="w-full max-w-4xl flex flex-col items-center pt-24 pb-16 px-4 gap-8">
        
        {/* Encabezado de la Sala */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Sala activa
              </p>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
                #{roomId}
              </h1>
            </div>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Archivos efímeros • Compartir seguro
          </span>
        </div>

        {/* Formulario de Subida Estilizado */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col gap-5"
        >
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Subir archivos a la sala
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Selecciona fotos, documentos o archivos para compartirlos con quienes tengan el código.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Propietario */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="ownerFiles"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Tu nombre o alias
              </label>
              <input
                type="text"
                name="ownerFiles"
                id="ownerFiles"
                placeholder="Ej: Bautista"
                className="w-full bg-slate-50/60 dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-lg p-2.5 text-xs outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/15 transition-all"
              />
            </div>

            {/* Nombres personalizados */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="filesNames"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Nombres personalizados (opcional)
              </label>
              <input
                type="text"
                name="fileName"
                id="filesNames"
                placeholder='Separa con "," (ej: apunte1, plano)'
                className="w-full bg-slate-50/60 dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-lg p-2.5 text-xs outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/15 transition-all"
              />
            </div>
          </div>

          {/* Selector de archivos */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="imageInput"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Archivos o imágenes
            </label>
            <input
              id="imageInput"
              type="file"
              name="image"
              multiple={true}
              required
              className="w-full bg-slate-50/60 dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 dark:file:bg-purple-950/60 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 cursor-pointer outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-all"
            />
          </div>

          {/* Botón de subida */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Subiendo archivos a Cloudflare R2...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Subir archivos</span>
              </>
            )}
          </button>
        </form>

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
