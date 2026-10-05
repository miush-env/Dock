import type { Dispatch, SetStateAction } from "react";
import type { FileItem } from "@components/FileCard";

/**
 * Actualiza la lista de archivos recientes subidos.
 */
export const handleFilesUploaded = (
  newFiles: FileItem[],
  setRecentFiles: Dispatch<SetStateAction<FileItem[]>>
) => {
  setRecentFiles(newFiles);
};

/**
 * Elimina un archivo de las listas filtrando por su nombre.
 */
export const handleFileDeleted = (
  deletedName: string,
  setAllFiles: Dispatch<SetStateAction<FileItem[]>>,
  setRecentFiles?: Dispatch<SetStateAction<FileItem[]>>
) => {
  setAllFiles((prev) => prev.filter((f) => f.name !== deletedName));
  if (setRecentFiles) {
    setRecentFiles((prev) => prev.filter((f) => f.name !== deletedName));
  }
};

/**
 * Actualiza el nombre de un archivo en las listas y opcionalmente vuelve a consultar los archivos.
 */
export const handleFileRenamed = (
  oldName: string,
  newName: string,
  setAllFiles: Dispatch<SetStateAction<FileItem[]>>,
  setRecentFiles?: Dispatch<SetStateAction<FileItem[]>>,
  viewFiles?: () => void
) => {
  const updateList = (files: FileItem[]) =>
    files.map((f) => (f.name === oldName ? { ...f, name: newName } : f));
  setAllFiles(updateList);
  if (setRecentFiles) {
    setRecentFiles(updateList);
  }
  viewFiles?.();
};

export interface FileHandlersConfig {
  setRecentFiles: Dispatch<SetStateAction<FileItem[]>>;
  setAllFiles: Dispatch<SetStateAction<FileItem[]>>;
  viewFiles?: () => void;
}

/**
 * Genera los manejadores de archivos vinculados a los estados del componente.
 */
export const createFileHandlers = ({
  setRecentFiles,
  setAllFiles,
  viewFiles,
}: FileHandlersConfig) => {
  return {
    handleFilesUploaded: (newFiles: FileItem[]) =>
      handleFilesUploaded(newFiles, setRecentFiles),
    handleFileDeleted: (deletedName: string) =>
      handleFileDeleted(deletedName, setAllFiles, setRecentFiles),
    handleFileRenamed: (oldName: string, newName: string) =>
      handleFileRenamed(oldName, newName, setAllFiles, setRecentFiles, viewFiles),
  };
};
