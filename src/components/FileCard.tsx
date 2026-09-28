import { useState, useRef } from "react";
import {
  ExternalLink,
  FileText,
  Share2,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Info,
  User,
  HardDrive,
  Calendar,
} from "lucide-react";

export interface FileItem {
  name: string;
  url: string;
  size?: number;
  formattedSize?: string;
  owner?: string;
  lastModified?: string | Date;
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHoldMenu, setShowHoldMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [copied, setCopied] = useState(false);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname || "localhost"}:3000`;

  // Compartir archivo
  const handleShare = async () => {
    setShowHoldMenu(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: file.name,
          text: `Descarga ${file.name} en Dock:`,
          url: file.url,
        });
        return;
      } catch {
        // Fallback a portapapeles
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

  // Eliminar archivo
  const handleDelete = async () => {
    setShowHoldMenu(false);
    setShowDetailsModal(false);
    if (!roomId) return;

    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar "${file.name}" de Cloudflare R2?`);
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`${API_URL}/${roomId}/${encodeURIComponent(file.name)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");
      onDeleted?.(file.name);
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el archivo.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Renombrar archivo
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
      console.error("Error al renombrar:", err);
      alert("No se pudo renombrar el archivo.");
    } finally {
      setIsRenaming(false);
    }
  };

  // Lógica para detectar pulsación prolongada (Long-press para móvil y mouse)
  const startLongPress = () => {
    isLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50);
      }
      setShowHoldMenu(true);
    }, 600);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const formattedDate = file.lastModified
    ? new Date(file.lastModified).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      {/* TARJETA DEL ARCHIVO */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setShowHoldMenu(true);
        }}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        className="group relative flex flex-col bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md dark:hover:border-slate-700 transition-all select-none"
      >
        {badge && (
          <span className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
            {badge}
          </span>
        )}

        {/* Indicador de carga si se está borrando */}
        {isDeleting && (
          <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        )}

        {/* Vista previa o icono */}
        <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden">
          {file.isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
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
            <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 pointer-events-none">
              <FileText className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              <span className="text-[10px] uppercase font-semibold bg-slate-200 dark:bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                {file.name.includes(".") ? file.name.split(".").pop() : "archivo"}
              </span>
            </div>
          )}
        </div>

        {/* Info y Botones Cómodos */}
        <div className="p-3 flex flex-col justify-between flex-1 gap-2.5 bg-white dark:bg-[#111827]">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="truncate max-w-[100px]">
                {file.owner ? `Por: ${file.owner}` : "Anónimo"}
              </span>
              <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {file.formattedSize || (file.size ? `${(file.size / 1024).toFixed(1)} KB` : "—")}
              </span>
            </div>
          </div>

          {/* Botones de acción cómodos (Ver datos / Abrir) */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailsModal(true);
              }}
              className="h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Detalles</span>
            </button>

            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-8 flex items-center justify-center gap-1 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir</span>
            </a>
          </div>
        </div>
      </div>

      {/* MODAL 1: VER DETALLES Y GESTIONAR (Renombrar, Compartir y Eliminar) */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Detalles del archivo
              </h3>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Renombrar o ver nombre */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Nombre del archivo
              </label>

              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                    className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-purple-500 rounded-lg p-2 text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRename}
                    disabled={isRenaming}
                    className="h-8 px-3 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {isRenaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewName(file.name);
                      setIsEditing(false);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100 break-all">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1 ml-2 shrink-0 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Cambiar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Metadatos (Quién lo envió, peso, fecha) */}
            <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  <span>Enviado por:</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {file.owner || "Anónimo"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                  <span>Tamaño:</span>
                </span>
                <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                  {file.formattedSize || (file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Desconocido")}
                </span>
              </div>

              {formattedDate && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>Fecha:</span>
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {formattedDate}
                  </span>
                </div>
              )}
            </div>

            {/* Botones de acción del Modal (Compartir / Eliminar) */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleShare}
                className="w-full h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? "¡Enlace copiado al portapapeles!" : "Compartir archivo"}</span>
              </button>

              {roomId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full h-10 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar archivo de la sala</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL / MENÚ DE PULSACIÓN PROLONGADA (HOLD MENU: Eliminar o Compartir) */}
      {showHoldMenu && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowHoldMenu(false)}
        >
          <div
            className="w-full max-w-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 mb-4 sm:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                {file.name}
              </p>
              <button
                type="button"
                onClick={() => setShowHoldMenu(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {/* Opción Compartir */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? "¡Enlace copiado!" : "Compartir"}</span>
              </button>

              {/* Opción Eliminar */}
              {roomId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar archivo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
