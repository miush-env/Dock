import { Plus, Info } from "lucide-react";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";

interface FilePrefixSectionProps {
  showPrefix: boolean;
  prefix: string;
  onToggleShow: (show: boolean) => void;
  onPrefixChange: (value: string) => void;
}

export function FilePrefixSection({
  showPrefix,
  prefix,
  onToggleShow,
  onPrefixChange,
}: FilePrefixSectionProps) {
  if (!showPrefix) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <button
          type="button"
          onClick={() => onToggleShow(true)}
          className="self-start text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary border border-border transition-all cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Prefijo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-border bg-card shadow-xs w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="prefix-input"
              className="text-sm font-semibold text-foreground"
            >
              Prefijo
            </label>

            {/* Popover de shadcn con icono de información */}
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="size-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                    aria-label="¿Qué es un prefijo?"
                  />
                }
              >
                <Info className="size-3.5" />
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-64 p-3 bg-popover text-popover-foreground text-xs rounded-xl shadow-xl border border-border"
              >
                <p className="font-semibold text-foreground mb-1">
                  ¿Qué es un prefijo?
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Es un texto que se añadirá automáticamente al inicio del nombre
                  de cada archivo para organizarlos o identificarlos mejor (ej:{" "}
                  <span className="font-mono text-primary font-semibold">
                    IMG_
                  </span>{" "}
                  o{" "}
                  <span className="font-mono text-primary font-semibold">
                    PROY_2026_
                  </span>
                  ).
                </p>
              </PopoverContent>
            </Popover>
          </div>

          {/* Botón para ocultar/cancelar el prefijo */}
          <button
            type="button"
            onClick={() => {
              onToggleShow(false);
              onPrefixChange("");
            }}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Quitar
          </button>
        </div>

        <Input
          id="prefix-input"
          name="prefix"
          type="text"
          placeholder="Ej: DOC_, PROYECTO_..."
          value={prefix}
          onChange={(e) => onPrefixChange(e.target.value)}
          className="h-12 text-base px-3.5 bg-slate-50/70 dark:bg-slate-900/60 border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus:bg-background focus:border-primary focus:ring-3 focus:ring-primary/25 transition-all shadow-xs"
        />
      </div>
    </div>
  );
}
