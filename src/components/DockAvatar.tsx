import { useEffect, useRef, useState } from "react";
import Onee, { type AnimationName } from "../../public/onee-avatar/Onee";

export type AvatarState = "watching-text" | "watching-inputs" | "watching-url";

interface DockAvatarProps {
  state?: AvatarState;
  size?: number | string;
  className?: string;
}

/**
 * Componente interactivo para el avatar Onee de Dock.
 * - 'watching-text': Lee el texto descriptivo / bienvenida con animación activa y movimientos sutiles.
 * - 'watching-inputs': Cuando el usuario ingresa el código, transiciona a enfocar y se pausa con la mirada atenta y fija en los inputs.
 * - 'watching-url': Al presionar unirme a la sala, mira hacia arriba a la URL y se pausa mirando hacia arriba, para luego poder volver a leer el texto.
 */
export default function DockAvatar({
  state = "watching-text",
  size = 200,
  className = "",
}: DockAvatarProps) {
  const [animation, setAnimation] = useState<AnimationName>("curious");
  const [playing, setPlaying] = useState<boolean>(true);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    switch (state) {
      case "watching-text": {
        // Reproduce normalmente la animación mientras lee el texto
        setAnimation("curious");
        setPlaying(true);
        break;
      }

      case "watching-inputs": {
        // Entra en la animación de sorpresa/atención (mirando abajo hacia los inputs)
        // y tras un instante suave de transición se pausa quedando fijo observando el código
        setAnimation("surprised");
        setPlaying(true);
        pauseTimeoutRef.current = setTimeout(() => {
          setPlaying(false);
        }, 550);
        break;
      }

      case "watching-url": {
        // Mira arriba (proud / thinking con elevación hacia la barra de direcciones)
        // y se congela mirando arriba antes de la navegación
        setAnimation("proud");
        setPlaying(true);
        pauseTimeoutRef.current = setTimeout(() => {
          setPlaying(false);
        }, 550);
        break;
      }

      default:
        setAnimation("curious");
        setPlaying(true);
    }

    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [state]);

  return (
    <div
      className={`flex items-center justify-center pointer-events-none select-none transition-all duration-300 ${className}`}
      aria-hidden="true"
    >
      <Onee
        animation={animation}
        playing={playing}
        loop={true}
        size={size}
      />
    </div>
  );
}
