import {
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { MouseEvent as ReactMouseEvent, TouchEvent } from "react";
import type { FileItem } from "./types";
import { renderExtensionVisual } from "./fileVisuals";

interface FileCarouselProps {
  slides: FileItem[];
  totalFiles: number;
  displayIndex: number;
  currentTransformIndex: number;
  enableTransition: boolean;
  onTransitionEnd: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDeleteCurrent: (e?: ReactMouseEvent) => void;
  touchHandlers: {
    onTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
    onTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
    onTouchEnd: () => void;
  };
}

export function FileCarousel({
  slides,
  totalFiles,
  displayIndex,
  currentTransformIndex,
  enableTransition,
  onTransitionEnd,
  onPrev,
  onNext,
  onDeleteCurrent,
  touchHandlers,
}: FileCarouselProps) {
  return (
    <div
      className="relative w-full h-64 sm:h-72 min-h-0 overflow-hidden rounded-2xl border border-border bg-slate-950 flex items-center justify-center select-none touch-pan-y shadow-md"
      onTouchStart={touchHandlers.onTouchStart}
      onTouchMove={touchHandlers.onTouchMove}
      onTouchEnd={touchHandlers.onTouchEnd}
    >
      {/* Botón de eliminar archivo seleccionado */}
      <button
        type="button"
        onClick={onDeleteCurrent}
        className="absolute top-3 right-3 size-9 flex items-center justify-center rounded-full bg-destructive/90 hover:bg-destructive text-white shadow-lg backdrop-blur-sm active:scale-95 transition-all z-20 cursor-pointer"
        aria-label="Eliminar archivo actual"
        title="Eliminar archivo actual"
      >
        <Trash2 className="size-4.5" />
      </button>

      {/* Tira deslizable de archivos con scroll infinito continuo */}
      <div
        className={`flex h-full w-full min-h-0 ${
          enableTransition ? "transition-transform duration-300 ease-out" : ""
        }`}
        style={{
          transform: `translateX(-${currentTransformIndex * 100}%)`,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {slides.map((item, index) => (
          <div
            key={`${item.file.name}-${index}`}
            className="w-full h-full min-w-full max-w-full min-h-0 shrink-0 flex items-center justify-center p-3 overflow-hidden box-border"
          >
            {item.isImage ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name || `Archivo ${index + 1}`}
                  draggable={false}
                  className="max-w-full max-h-full w-full h-full object-contain pointer-events-none select-none rounded-lg"
                />
              </div>
            ) : (
              /* Miniatura personalizada para archivos no imagen (zip, rar, exe, apk, etc.) */
              <div className="flex flex-col items-center justify-center gap-2.5 p-4 text-center select-none max-w-xs min-w-0">
                <div className="size-20 sm:size-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-lg">
                  {renderExtensionVisual(item.extension)}
                </div>

                <div className="flex flex-col items-center gap-1 min-w-0 w-full">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    .{item.extension || "ARCHIVO"}
                  </span>
                  <p className="text-xs font-semibold text-neutral-200 truncate w-full px-2">
                    {item.file.name}
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botones de navegación visibles y destacados */}
      {totalFiles > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 size-10 sm:size-11 flex items-center justify-center rounded-full bg-white text-slate-900 shadow-xl border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all z-20 cursor-pointer"
            aria-label="Archivo anterior"
          >
            <ChevronLeft className="size-6 sm:size-7 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 size-10 sm:size-11 flex items-center justify-center rounded-full bg-white text-slate-900 shadow-xl border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all z-20 cursor-pointer"
            aria-label="Siguiente archivo"
          >
            <ChevronRight className="size-6 sm:size-7 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Indicador de posición */}
      <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white font-medium text-xs px-2.5 py-1 rounded-full border border-white/10 z-10 shadow">
        {displayIndex + 1} / {totalFiles}
      </span>
    </div>
  );
}
