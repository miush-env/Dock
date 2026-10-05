import { useState, useRef, useEffect } from "react";
import type { FileItem } from "../FileCard";
import { useRoomId } from "@utils/WhatIsRoomId";

interface UseFileActionsProps {
  file?: FileItem;
  roomId?: string;
  onDeleted?: (fileName: string) => void;
  onRenamed?: (oldName: string, newName: string) => void;
}

export function useFileActions({
  file,
  roomId: roomIdProp,
  onDeleted,
  onRenamed,
}: UseFileActionsProps = {}) {
  const fallbackRoomId = useRoomId();
  const roomId = roomIdProp || fallbackRoomId;

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHoldMenu, setShowHoldMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file?.name || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (file?.name) {
      setNewName(file.name);
    }
  }, [file?.name]);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    `http://${window.location.hostname || "localhost"}:3000`;

  const handleShare = async () => {
    if (!file) return;
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

  const handleDelete = async () => {
    if (!file) return;
    setShowHoldMenu(false);
    setShowDetailsModal(false);
    if (!roomId) return;

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar "${file.name}" de Cloudflare R2?`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(
        `${API_URL}/${roomId}/${encodeURIComponent(file.name)}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Error al eliminar");
      onDeleted?.(file.name);
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el archivo.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRename = async () => {
    if (!file || !roomId || !newName.trim() || newName.trim() === file.name) {
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

  const formattedDate = file?.lastModified
    ? new Date(file.lastModified).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return {
    roomId,
    showDetailsModal,
    setShowDetailsModal,
    showHoldMenu,
    setShowHoldMenu,
    isEditing,
    setIsEditing,
    newName,
    setNewName,
    isDeleting,
    isRenaming,
    copied,
    formattedDate,
    handleShare,
    handleDelete,
    handleRename,
    startLongPress,
    cancelLongPress,
  };
}
