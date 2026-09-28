import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Upload, Loader2 } from "lucide-react";
import { useParams } from "react-router";
import type { FileItem } from "@/components/FileCard";
import { FileSection } from "@/components/FileSection";

function Room() {
  const API_URL = `http://${window.location.hostname || "localhost"}:3000`;
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

  // Función para obtener todos los archivos recibidos desde Cloudflare R2 a través del backend

  useEffect(() => {
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

    viewFiles();
    console.log(allFiles)
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      console.log(message);

      // Si el servidor nos devuelve la lista de archivos recién subidos, los guardamos para la vista previa
      if (message.files && Array.isArray(message.files)) {
        setRecentFiles(message.files);
      }

      form.reset();
    } catch (err) {
      console.error("Error al enviar archivos:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center">
      <h1 className="text-white">Esto es la room del codigo {roomId}</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col gap-6 items-center justify-center bg-blue-300 w-full max-w-lg rounded-2xl p-6 shadow-md transition-all"
      >
        <div className="w-full flex flex-col gap-1.5">
          <label
            htmlFor="ownerFiles"
            className="text-xs font-semibold text-blue-950 uppercase tracking-wide"
          >
            Nombre del propietario
          </label>
          <input
            type="text"
            name="ownerFiles"
            id="ownerFiles"
            placeholder="ingrese su nombre para marcar los archivos de su propiedad"
            className="w-full bg-white border-gray-300 border-2 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <label
            htmlFor="filesNames"
            className="text-xs font-semibold text-blue-950 uppercase tracking-wide"
          >
            Nombres personalizados (opcional)
          </label>
          <input
            type="text"
            name="fileName"
            id="filesNames"
            placeholder='Separa con "," para nombrar cada archivo (ej: foto1, foto2)'
            className="w-full bg-white border-gray-300 border-2 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <label
            htmlFor="imageInput"
            className="text-xs font-semibold text-blue-950 uppercase tracking-wide"
          >
            Seleccionar archivos o imágenes
          </label>
          <input
            id="imageInput"
            type="file"
            name="image"
            multiple={true}
            required
            className="w-full bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 border-gray-300 border-2 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-600 transition-colors cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 border-gray-400 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-semibold border-2 rounded-lg p-3 focus:outline-none focus:border-blue-600 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Subiendo archivos a Cloudflare R2...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Upload</span>
            </>
          )}
        </button>
      </form>

      <FileSection recentFiles={recentFiles} allFiles={allFiles} />
    </div>
  );
}

export default Room;
