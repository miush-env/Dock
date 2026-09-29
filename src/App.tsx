import { useState } from "react";
import Header from "@/components/header";
import Welcome from "@/components/Welcome";
import FormCodeOTP from "@/components/FormCodeOTP";
import DockAvatar, { type AvatarState } from "@/components/DockAvatar";

function App() {
  const [avatarState, setAvatarState] = useState<AvatarState>("watching-text");

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-50 dark:bg-[#0b0f17] flex flex-col items-center overflow-hidden touch-none selection:bg-purple-500 selection:text-white transition-colors duration-200">
      <Header />

      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-12 pb-6 px-4">
        {/* Avatar Onee ubicado arriba de la tarjeta */}
        <div className="mb-2 flex items-center justify-center">
          <DockAvatar
            state={avatarState}
            size={130}
            className="filter drop-shadow-sm transition-all duration-300"
          />
        </div>

        {/* Tarjeta Limpia y Funcional */}
        <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-md flex flex-col items-center gap-6">
          <Welcome user={"Bautista"} />

          {/* Formulario de Código OTP interactuando con el avatar */}
          <FormCodeOTP
            onInputFocus={() => setAvatarState("watching-inputs")}
            onInputBlur={() => setAvatarState("watching-text")}
            onSubmitStart={() => setAvatarState("watching-url")}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
