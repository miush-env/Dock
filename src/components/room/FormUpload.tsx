import { Upload, Loader2 } from "lucide-react";

interface FormUploadProps {
  isUploading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormUpload({ isUploading, handleSubmit }: FormUploadProps) {
  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col gap-5"
    >
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          Subir archivos a la sala
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Selecciona fotos, documentos o archivos para compartirlos con quienes
          tengan el código.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombres personalizados */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filesNames"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Nombres personalizados (opcional)
          </label>
          <input
            type="text"
            name="fileName"
            id="filesNames"
            placeholder='Separa con "," (ej: apunte1, plano)'
            className="w-full bg-slate-50/60 dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-lg p-2.5 text-xs outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/15 transition-all"
          />
        </div>
      </div>

      {/* Selector de archivos */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="imageInput"
          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          Archivos o imágenes
        </label>
        <input
          id="imageInput"
          type="file"
          name="image"
          multiple={true}
          required
          className="w-full bg-slate-50/60 dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg p-2 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 dark:file:bg-purple-950/60 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 cursor-pointer outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-all"
        />
      </div>

      {/* Botón de subida */}
      <button
        type="submit"
        disabled={isUploading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Subiendo archivos a Cloudflare R2...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>Subir archivos</span>
          </>
        )}
      </button>
    </form>
  );
}
