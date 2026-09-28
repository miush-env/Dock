import { useState } from "react";
import { ExternalLink, FileText, Share2, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";

export interface FileItem {
  name: string;
  url: string;
  size?: number;
  formattedSize?: string;
  owner?: string;
  isImage?: boolean;
}

interface FileCardProps {
  file: FileItem;
  badge?: string;
  roomId?: string;
  onDeleted?: (fileName: string) => void;
  onRenamed?: (oldName: string, newName: string) => void;
}

export function FileCard({ file, badge, roomId, onDeleted, onRenamed }: FileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname || "localhost"}:3000`;

  // Compartir enlace directo (Web Share API o portapapeles)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: file.name,
          text: `Descarga ${file.name} en Dock:`,
          url: file.url,
        });
        return;
      } catch {
        // Fallback a copiar enlace
      }
    }

    try {
      await navigator.clipboard.writeText(file.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar enlace:", err);
    }
  };

  // Eliminar archivo en el backend y R2
  const handleDelete = async () => {
    if (!roomId) return;
    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar "${file.name}"?`);
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`${API_URL}/${roomId}/${encodeURIComponent(file.name)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");
      onDeleted?.(file.name);
    } catch (err) {
      console.error("Error al eliminar archivo:", err);
      alert("No se pudo eliminar el archivo.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Renombrar archivo en el backend y R2
  const handleRename = async () => {
    if (!roomId || !newName.trim() || newName.trim() === file.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsRenaming(true);
      const res = await fetch(`${API_URL}/${roomId}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldFileName: file.name,
          newFileName: newName.trim(),
        }),
      });

      if (!res.ok) throw new Error("Error al renombrar");
      const data = await res.json();
      setIsEditing(false);
      onRenamed?.(file.name, data.newName || newName.trim());
    } catch (err) {
      console.error("Error al renombrar archivo:", err);
      alert("No se pudo renombrar el archivo.");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md dark:hover:border-slate-700 transition-all duration-200">
      {badge && (
        <span className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
          {badge}
        </span>
      )}

      {/* Botones de acción rápida arriba a la derecha */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        {roomId && (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              title="Renombrar archivo"
              className="w-7 h-7 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center shadow-xs border border-slate-200/80 dark:border-slate-700 cursor-pointer backdrop-blur-xs transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Eliminar archivo"
              className="w-7 h-7 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center shadow-xs border border-slate-200/80 dark:border-slate-700 cursor-pointer backdrop-blur-xs transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Vista previa / icono */}
      <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden">
        {file.isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement("div");
                fallback.className = "flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500";
                fallback.innerHTML = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-[11px]">Sin vista previa</span>`;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
            <FileText className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] uppercase font-semibold bg-slate-200 dark:bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
              {file.name.includes(".") ? file.name.split(".").pop() : "archivo"}
            </span>
          </div>
        )}
      </div>

      {/* Info, renombrado y enlaces */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2.5 bg-white dark:bg-[#111827]">
        <div className="min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1 mb-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-purple-500 rounded px-1.5 py-1 outline-none text-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleRename}
                disabled={isRenaming}
                className="p-1 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {isRenaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewName(file.name);
                  setIsEditing(false);
                }}
                className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate" title={file.name}>
              {file.name}
            </p>
          )}

          {/* Datos solicitados: Quien lo envió y cuanto pesa */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="truncate max-w-[110px]" title={file.owner}>
              Por: <strong className="text-slate-700 dark:text-slate-300">{file.owner || "Anónimo"}</strong>
            </span>
            <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {file.formattedSize || (file.size ? `${(file.size / 1024).toFixed(1)} KB` : "—")}
            </span>
          </div>
        </div>

        {/* Botones de Abrir y Compartir directamente */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 py-1.5 px-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir</span>
          </a>

          <button
            type="button"
            onClick={handleShare}
            title="Compartir enlace directo"
            className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "¡Copiado!" : "Compartir"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
