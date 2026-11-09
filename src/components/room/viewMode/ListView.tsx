import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import type { FileItem } from "@components/FileCard";
import FileTableRow from "@components/room/viewMode/TableView";

interface ListViewProps {
  allFiles?: FileItem[];
  roomId?: string;
  onFileDeleted?: (fileName: string) => void;
  onFileRenamed?: (oldName: string, newName: string) => void;
  filterValue: string;
}

export default function ListView({
  allFiles = [],
  roomId,
  onFileDeleted,
  onFileRenamed,
  filterValue,
}: ListViewProps) {
  return (
    <>
      {filterValue === null || filterValue == " " || filterValue == ""
        ? console.log("todos los archivos")
        : console.log("archivos de tipo : " + filterValue)}
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Icono</TableHead>
            <TableHead className="">Nombre</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap text-center w-20">Tipo</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap text-center ">Autor</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap text-center w-30">Tamaño</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap text-center">Modificado</TableHead>
            <TableHead className="text-right w-20">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterValue === null || filterValue == " " || filterValue == ""
            ? allFiles.map((file, index) => (
                <FileTableRow
                  key={`list-${file.name}-${index}`}
                  file={file}
                  roomId={roomId}
                  onDeleted={onFileDeleted}
                  onRenamed={onFileRenamed}
                />
              ))
            : allFiles
                .filter((file) => {
                  return file.category === filterValue;
                })
                .map((file, index) => (
                  <FileTableRow
                    key={`list-${file.name}-${index}`}
                    file={file}
                    roomId={roomId}
                    onDeleted={onFileDeleted}
                    onRenamed={onFileRenamed}
                  />
                ))}
        </TableBody>
      </Table>
    </>
  );
}
