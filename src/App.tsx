import { useState, useEffect } from "react";
import Header from "@/components/header";
import { FileSection } from "@/components/FileSection";
import type { FileItem } from "@/components/FileCard";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

// Permite conectar al backend tanto desde localhost como desde un celular en la misma red Wi-Fi
const API_URL = `http://${window.location.hostname || "localhost"}:3000`;

function App() {
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const navigate = useNavigate();

  // Función para obtener todos los archivos recibidos desde Cloudflare R2 a través del backend
  async function viewFiles() {
    try {
      setIsLoadingFiles(true);
      const res = await fetch(`${API_URL}/files`);
      if (!res.ok) {
        throw new Error("Error al obtener los archivos");
      }
      const data: FileItem[] = await res.json();
      console.log(data);
      setAllFiles(data);
    } catch (err) {
      console.error("Error al cargar archivos:", err);
    } finally {
      setIsLoadingFiles(false);
    }
  }

  // Cargar los archivos al iniciar el componente
  useEffect(() => {
    viewFiles();
  }, []);
  const handleInputChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = new FormData(e.currentTarget).get("code");
    if (code) {
      navigate(`/room/${code}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <Header />

      <main className="w-full flex flex-col gap-6 items-center justify-center py-10 px-4">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide text-gray-800">
          Esto es Dock
        </h1>

        <section>
          <form
            onSubmit={handleInputChange}
            className="flex gap-2 items-center justify-center"
          >
            <input
              type="text"
              name="code"
              maxLength={4}
              minLength={4}
              placeholder="Ingresa el código de la sala"
              className="p-2 border border-blue-500 rounded-md"
            />
            <Button type="submit">Ir a la sala</Button>
          </form>
        </section>

        {/* Componente con las 2 secciones: recién enviados y todos los recibidos */}
        <FileSection
          recentFiles={recentFiles}
          allFiles={allFiles}
          onRefresh={viewFiles}
          isLoadingAll={isLoadingFiles}
        />
      </main>
    </div>
  );
}

export default App;
