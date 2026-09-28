import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";

export interface FileItem {
  name: string;
  url: string;
  size: number;
  owner: string;
  isImage?: boolean;
}

interface FileCardProps {
  file: FileItem;
  badge?: string;
}

export function FileCard({ file, badge }: FileCardProps) {
  return (
    <div className="group relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {badge && (
        <span className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
          {badge}
        </span>
      )}

      {/* Vista previa / icono */}
      <div className="relative w-full h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
        <span className="text-gray-400 text-sm">{file.owner}</span>
        {file.isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Si la imagen falla en cargar, ocultamos la imagen y mostramos icono de fallback
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement("div");
                fallback.className = "flex flex-col items-center gap-1 text-gray-400";
                fallback.innerHTML = `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-xs">Sin vista previa</span>`;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <FileText className="w-12 h-12 text-blue-500" />
            <span className="text-xs uppercase font-medium bg-gray-200 px-2 py-0.5 rounded text-gray-700">
              {file.name.includes(".") ? file.name.split(".").pop() : "archivo"}
            </span>
          </div>
        )}
      </div>

      {/* Info y enlace */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2 bg-white">
        <p className="text-xs font-semibold text-gray-800 truncate" title={file.name}>
          {file.name}
        </p>

        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir archivo
        </a>
      </div>
    </div>
  );
}
