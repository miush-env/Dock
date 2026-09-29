import React, { useEffect, useState } from "react";
import Onee, { type AnimationName } from "../../public/onee-avatar/Onee";

export type AvatarState = "watching-text" | "watching-inputs" | "watching-url";

interface DockAvatarProps {
  state?: AvatarState;
  size?: number | string;
  className?: string;
}

/**
 * Componente interactivo para el avatar Onee de Dock.
 * - 'watching-text': Mira hacia abajo/centro con expresión reflexiva/atenta hacia el saludo ("Hola Bautista...").
 * - 'watching-inputs': Abre bien los ojos y enfoca hacia abajo al interactuar con las casillas de código.
 * - 'watching-url': Mira hacia arriba (headX positivo / thinking) hacia la barra de URL al unirse a la sala.
 */
export default function DockAvatar({
  state = "watching-text",
  size = 140,
  className = "",
}: DockAvatarProps) {
  // Inicialmente mira el texto
  const [animation, setAnimation] = useState<AnimationName>("curious");

  useEffect(() => {
    switch (state) {
      case "watching-text":
        // Expresión curiosa/atenta con la cabeza inclinada hacia el texto
        setAnimation("curious");
        break;
      case "watching-inputs":
        // Abre los ojos despierto/atento mirando los inputs
        setAnimation("excited");
        break;
      case "watching-url":
        // Mira hacia arriba (elevación de cabeza) cuando viaja a la sala
        setAnimation("thinking");
        break;
      default:
        setAnimation("curious");
    }
  }, [state]);

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      <Onee
        animation={animation}
        playing={true}
        loop={true}
        size={size}
      />
    </div>
  );
}
