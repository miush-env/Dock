import { useState } from "react";
import Header from "@/components/header";
import FormCodeOTP from "@/components/FormCodeOTP";
import DockAvatar, { type AvatarState } from "@/components/DockAvatar";

function App() {
  const [avatarState, setAvatarState] = useState<AvatarState>("watching-text");

  const handleSubmitStart = () => {
    setAvatarState("watching-url");
  };

  return (
    <div className="fixed inset-0 w-full h-dvh flex flex-col items-center overflow-hidden touch-none bg-patron dark:bg-patron-dark">
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
          <div className="w-full bg-white dark:bg-gray-900 border border-slate-300 rounded-2xl pt-20 pb-8 px-6 sm:px-8 shadow-sm flex flex-col gap-6 relative z-10">
            <h2 className="text-xl  font-semibold text-black dark:text-white">
              Código de la sala
            </h2>

            {/* Formulario de Código OTP interactuando con el avatar */}
            <FormCodeOTP onSubmitStart={handleSubmitStart} />
          </div>
        </div>
        <div className="absolute -bottom-20 -right-50 max-md:-bottom-18 max-md:-right-20 z-5 lg:w-120 max-md:w-80">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="miGradiente"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="40%" stop-color="#5270a0" />
                <stop offset="100%" stop-color="#2b78f5" />
              </linearGradient>
            </defs>

            <path
              fill="url(#miGradiente)"
              d="M40,-76.9C47,-65.3,44.6,-44.8,53,-30.5C61.4,-16.2,80.6,-8.1,84.7,2.4C88.7,12.8,77.7,25.6,67.7,37.2C57.8,48.8,49,59.2,37.9,69C26.8,78.8,13.4,88,-0.5,88.9C-14.4,89.7,-28.7,82.2,-34.5,69.3C-40.3,56.4,-37.5,38.2,-45.9,25.8C-54.4,13.3,-74.2,6.7,-81.6,-4.3C-89.1,-15.3,-84.2,-30.5,-72,-36.6C-59.8,-42.6,-40.4,-39.4,-27.2,-47.4C-14,-55.5,-7,-74.7,4.8,-82.9C16.5,-91.2,33,-88.5,40,-76.9Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="absolute lg:-right-60 -top-15 -right-40 lg:w-120 w-80">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="miGradiente2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#f5462c" />
                <stop offset="50%" stop-color="#f5a12c" />
                <stop offset="100%" stop-color="#f5e82c" />
              </linearGradient>
            </defs>
            <path
              fill="url(#miGradiente2)"
              d="M27.7,-35C35.3,-26.6,40.6,-17.3,47.2,-4.6C53.8,8,61.8,24.2,57,33.1C52.1,42.1,34.3,43.8,18.6,48.3C2.9,52.8,-10.8,60.1,-19.8,56.1C-28.8,52.1,-33.1,36.8,-42.9,23.2C-52.6,9.5,-67.9,-2.6,-70.4,-16.6C-72.9,-30.6,-62.7,-46.5,-48.8,-53.8C-34.9,-61.2,-17.5,-59.9,-3.7,-55.5C10,-51,20.1,-43.4,27.7,-35Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="absolute lg:-left-60 -top-15 -left-40 lg:w-120 w-80">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="miGradiente3"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="40%" stop-color="#d7f680" />
                <stop offset="100%" stop-color="#c1f52c" />
              </linearGradient>
            </defs>

            <path
              fill="url(#miGradiente3)"
              d="M39.2,-51.3C45.4,-41.6,41.3,-24,43.1,-8.4C44.9,7.3,52.7,21.1,51.5,35.8C50.2,50.5,40,66,25.3,72.7C10.7,79.4,-8.3,77.2,-20.8,68C-33.2,58.7,-39.1,42.4,-42.8,28.4C-46.4,14.5,-47.7,2.9,-46.8,-9.3C-45.9,-21.5,-42.8,-34.4,-34.7,-43.8C-26.5,-53.2,-13.2,-59,1.6,-61C16.5,-62.9,33,-61,39.2,-51.3Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </main>
    </div>
  );
}

export default App;
