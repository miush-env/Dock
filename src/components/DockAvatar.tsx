import { useEffect, useRef, useState } from "react";
import Onee, { type AnimationName } from "../../public/onee-avatar/Onee";

export type AvatarState = "watching-text" | "watching-inputs" | "watching-url";

interface DockAvatarProps {
  state?: AvatarState;
  size?: number | string;
  className?: string;
}

/**
 * Componente interactivo para el avatar Onee de Dock renderizado en tiempo real.
 * Usa el motor vectorial procedural 3D con las expresiones nativas del proyecto de Avatar Studio:
 * - 'watching-text': Lee el texto de bienvenida/instrucciones con micro-movimientos naturales y curiosidad ('curious').
 * - 'watching-inputs': Cuando el usuario interactúa o ingresa el código, transiciona instantáneamente a
 *   'inspecting-code' (cabeza agachada -22.5°, ojos bien abiertos de 76px y micro-sacadas oculares viendo las casillas)
 *   y tras enfocar se pausa quedando fijo observando con atención el código escrito.
 * - 'watching-url': Al presionar el botón de unirse a la sala, mira hacia arriba directamente a la URL
 *   ('watching-url-bar' con cabeza levantada +18.5° y mirada vertical fija) y se pausa allí antes de navegar.
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
        // Lee el texto descriptivo con movimiento natural
        setAnimation("curious");
        setPlaying(true);
        break;
      }

      case "watching-inputs": {
        // Transición fluida a inspeccionar los inputs con la cabeza inclinada hacia el código
        setAnimation("inspecting-code");
        setPlaying(true);
        // Pausa tras posicionar la mirada para quedar fijo observando el código
        pauseTimeoutRef.current = setTimeout(() => {
          setPlaying(false);
        }, 400);
        break;
      }

      case "watching-url": {
        // Eleva la cabeza e inclina la mirada exactamente hacia la barra de URL
        setAnimation("watching-url-bar");
        setPlaying(true);
        // Pausa mirando fijo la URL antes de la transición
        pauseTimeoutRef.current = setTimeout(() => {
          setPlaying(false);
        }, 400);
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
