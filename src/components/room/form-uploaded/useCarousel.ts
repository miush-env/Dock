import { useState, useEffect, useCallback, TouchEvent } from "react";

export function useCarousel(totalItems: number) {
  // virtualIndex 1 apunta al primer elemento real cuando hay clones para el scroll infinito
  const [virtualIndex, setVirtualIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Soporte táctil (swipe)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Reactivar la transición tras el salto invisible del loop infinito
  useEffect(() => {
    if (!enableTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [enableTransition]);

  // Temporizador de seguridad para evitar bloqueos en la navegación
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        handleTransitionEnd();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, virtualIndex]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || totalItems <= 1) return;
    setIsTransitioning(true);
    setVirtualIndex((prev) => prev - 1);
  }, [isTransitioning, totalItems]);

  const handleNext = useCallback(() => {
    if (isTransitioning || totalItems <= 1) return;
    setIsTransitioning(true);
    setVirtualIndex((prev) => prev + 1);
  }, [isTransitioning, totalItems]);

  // Navegación con teclado (Flecha Izquierda / Derecha) cuando no esté enfocado en un campo de texto
  useEffect(() => {
    if (totalItems <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const target = e.target as HTMLElement | null;
      const isTextInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTextInput) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalItems, handlePrev, handleNext]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (totalItems <= 1) return;

    if (virtualIndex >= totalItems + 1) {
      setEnableTransition(false);
      setVirtualIndex(1);
    } else if (virtualIndex <= 0) {
      setEnableTransition(false);
      setVirtualIndex(totalItems);
    }
  };

  // Manejo de gestos táctiles (swipe)
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Cálculo del índice real visible (0 a totalItems - 1)
  const displayIndex =
    totalItems > 0 ? (virtualIndex - 1 + totalItems) % totalItems : 0;

  const currentTransformIndex = totalItems > 1 ? virtualIndex : 0;

  const handleAfterDelete = (deletedIndex: number, newLength: number) => {
    setIsTransitioning(false);
    setEnableTransition(false);

    if (newLength <= 1) {
      setVirtualIndex(1);
    } else {
      const nextDisplay =
        deletedIndex >= newLength ? newLength - 1 : deletedIndex;
      setVirtualIndex(nextDisplay + 1);
    }
  };

  const resetToFirst = () => {
    setVirtualIndex(1);
    setIsTransitioning(false);
    setEnableTransition(true);
  };

  return {
    virtualIndex,
    displayIndex,
    currentTransformIndex,
    enableTransition,
    isTransitioning,
    handlePrev,
    handleNext,
    handleTransitionEnd,
    handleAfterDelete,
    resetToFirst,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
