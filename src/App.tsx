import { useState } from "react";
import Header from "@/components/header";
import Welcome from "@/components/Welcome";
import FormCodeOTP from "@/components/FormCodeOTP";
import DockAvatar, { type AvatarState } from "@/components/DockAvatar";

function App() {
  const [avatarState, setAvatarState] = useState<AvatarState>("watching-text");

  const handleInputActive = () => {
    setAvatarState("watching-inputs");
  };

  const handleInputIdle = () => {
    setAvatarState("watching-text");
  };

  const handleSubmitStart = () => {
    setAvatarState("watching-url");
    // Al cabo de un instante mirando hacia la URL, vuelve a mirar el texto
    setTimeout(() => {
      setAvatarState("watching-text");
    }, 1800);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-50 dark:bg-[#0b0f17] flex flex-col items-center overflow-hidden touch-none selection:bg-purple-500 selection:text-white transition-colors duration-200">
      <Header />

      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-16 pb-6 px-4">
        {/* Contenedor relativo para posicionar la mascota de forma dinámica y destacada */}
        <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center">
          {/* Avatar Onee grande con posición flotante/absoluta en la parte superior */}
          <div className="absolute -top-24 sm:-top-28 z-20 pointer-events-none drop-shadow-md transition-all duration-500 ease-out">
            <DockAvatar
              state={avatarState}
              size={180}
              className="w-40 sm:w-48 h-40 sm:h-48"
            />
          </div>

          {/* Tarjeta Limpia y Funcional con padding superior para acoplar el avatar */}
          <div className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl pt-20 pb-8 px-6 sm:px-8 shadow-sm dark:shadow-md flex flex-col items-center gap-6 relative z-10">
            <Welcome user={"Bautista"} />

            {/* Formulario de Código OTP interactuando con el avatar */}
            <FormCodeOTP
              onInputActive={handleInputActive}
              onInputIdle={handleInputIdle}
              onSubmitStart={handleSubmitStart}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
