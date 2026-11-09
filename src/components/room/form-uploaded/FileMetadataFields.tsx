import { Input } from "@components/ui/input";

interface FileMetadataFieldsProps {
  name: string;
  category: string;
  onChange: (field: "name" | "category", value: string) => void;
}

export function FileMetadataFields({
  name,
  category,
  onChange,
}: FileMetadataFieldsProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
        <label className="text-sm font-semibold text-foreground">
          Nombre
        </label>
        <Input
          type="text"
          placeholder="Nombre del archivo"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          className="h-11 sm:h-12 text-sm sm:text-base px-3.5 bg-slate-50/70 dark:bg-slate-900/60 border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus:bg-background focus:border-primary focus:ring-3 focus:ring-primary/25 transition-all shadow-xs"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
        <label className="text-sm font-semibold text-foreground">
          Categoría
        </label>
        <Input
          type="text"
          placeholder="Ej: Documentos, Fotos..."
          value={category}
          onChange={(e) => onChange("category", e.target.value)}
          className="h-11 sm:h-12 text-sm sm:text-base px-3.5 bg-slate-50/70 dark:bg-slate-900/60 border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus:bg-background focus:border-primary focus:ring-3 focus:ring-primary/25 transition-all shadow-xs"
        />
      </div>
    </div>
  );
}
