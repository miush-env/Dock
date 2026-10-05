import { useParams } from "react-router";

/**
 * Extrae el roomId directamente desde la URL del navegador.
 */
export const getRoomId = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  return pathParts[pathParts.length - 1] || undefined;
};

/**
 * Hook de React para obtener el roomId desde los parámetros de la ruta,
 * con fallback a la extracción directa de la URL.
 */
export const useRoomId = (): string | undefined => {
  const params = useParams();
  return params?.roomId || getRoomId();
};
