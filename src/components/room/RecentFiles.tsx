import { FileCard, type FileItem } from "@components/FileCard";
import { Clock } from "lucide-react";

interface Props {
  recentFiles: Array<FileItem>;
  onFileDeleted?: (fileName: string) => void;
  onFileRenamed?: (oldName: string, newName: string) => void;
  roomId?: string;
}

export default function RecentFiles({
  recentFiles,
  onFileDeleted,
  onFileRenamed,
  roomId,
}: Props) {
  return (
    <div>
      {recentFiles.length > 0 && (
        <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Archivos recién subidos
            </h2>
            <span className="text-[11px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-full ml-auto">
              {recentFiles.length}{" "}
              {recentFiles.length === 1 ? "archivo" : "archivos"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {recentFiles.map((file, index) => (
              <FileCard
                key={`recent-${file.name}-${index}`}
                file={file}
                badge="Reciente"
                roomId={roomId}
                onDeleted={onFileDeleted}
                onRenamed={onFileRenamed}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
