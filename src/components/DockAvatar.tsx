import { useEffect, useState } from "react";
import { createAvatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import cloudeeJson from "../../public/onee-avatar/cloudee.avatar.json";

const CloudeeAvatar = createAvatar(cloudeeJson);

export type AvatarState = "watching-text" | "watching-inputs" | "watching-url";

interface DockAvatarProps {
  state?: AvatarState;
  size?: number | string;
  className?: string;
  onAnimationEnd?: () => void;
}

/**
 * Componente interactivo para la mascota Cloudee de Dock renderizado en tiempo real.
 * Permanece neutral hasta que el usuario hace click en "Unirme a la sala" (state === 'watching-url'),
 * momento en el cual empieza la animación 'view-otp' y finaliza mirando hacia arriba a la URL ('upward-side-glance').
 */
export default function DockAvatar({
  state = "watching-text",
  size = 180,
  className = "",
  onAnimationEnd,
}: DockAvatarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (state === "watching-url") {
      setIsPlaying(true);
      setIsFinished(false);
    }
  }, [state]);

  const handleAnimationEnd = () => {
    setIsPlaying(false);
    setIsFinished(true);
    onAnimationEnd?.();
  };

  return (
    <div
      className={`flex items-center justify-center pointer-events-none select-none transition-all duration-300 ${className}`}
      aria-hidden="true"
    >
      {isFinished ? (
        <CloudeeAvatar
          expression="upward-side-glance"
          size={size}
        />
      ) : isPlaying ? (
        <CloudeeAvatar
          animation="view-otp"
          size={size}
          onAnimationEnd={handleAnimationEnd}
        />
      ) : (
        <CloudeeAvatar
          expression="downward-gaze"
          size={size}
        />
      )}
    </div>
  );
}


