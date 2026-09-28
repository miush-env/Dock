import { ExternalLink, FileText } from "lucide-react";

export interface FileItem {
  name: string;
  url: string;
  size?: number;
  owner?: string;
  isImage?: boolean;
}

interface FileCardProps {
  file: FileItem;
  badge?: string;
}

export function FileCard({ file, badge }: FileCardProps) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md dark:hover:border-slate-700 transition-all duration-200">
      {badge && (
        <span className="absolute top-2 left-2 z-10 bg-purple-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
          {badge}
        </span>
      )}

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

      {/* Info y enlace */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2 bg-white dark:bg-[#111827]">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate" title={file.name}>
            {file.name}
          </p>
          {file.owner && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Por: {file.owner}
            </p>
          )}
        </div>

        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 py-1.5 px-2.5 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir archivo
        </a>
      </div>
    </div>
  );
}
