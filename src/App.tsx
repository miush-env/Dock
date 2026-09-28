import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { ArrowRight } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname || "localhost"}:3000`;

function App() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const socket = io(API_URL);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.slice(-1).toUpperCase();
    const updated = [...digits];
    updated[index] = sanitized;
    setDigits(updated);

    if (sanitized && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 4).toUpperCase();
    if (!pasted) return;

    const updated = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setDigits(updated);

    const nextFocus = Math.min(pasted.length, 3);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length === 4) {
      navigate(`/room/${code}`);
    }
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-50 dark:bg-[#0b0f17] flex flex-col items-center overflow-hidden touch-none selection:bg-purple-500 selection:text-white transition-colors duration-200">
      
      {/* =========================================================================
          WAVE ELEGANTE DE FONDO (Sutil en claro, con relieve suave en oscuro)
          ========================================================================= */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-0 h-44 sm:h-56">
        {/* Onda 1 */}
        <svg
          className="absolute bottom-0 w-[200%] h-full animate-wave-slow opacity-25 dark:opacity-40 text-slate-300 dark:text-slate-800"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,186.7C672,192,768,160,864,138.7C960,117,1056,107,1152,117.3C1248,128,1344,160,1392,176L1440,192L1440,280L1392,280C1344,280,1248,280,1152,280C1056,280,960,280,864,280C768,280,672,280,576,280C480,280,384,280,288,280C192,280,96,280,48,280L0,280Z"
          />
        </svg>

        {/* Onda 2 con toque suave azul/violeta oscuro solo en modo oscuro */}
        <svg
          className="absolute bottom-0 w-[200%] h-[85%] animate-wave-fast opacity-20 dark:opacity-30 text-slate-400 dark:text-purple-950"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,101.3C672,96,768,128,864,138.7C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,260L1392,260C1344,260,1248,260,1152,260C1056,260,960,260,864,260C768,260,672,260,576,260C480,260,384,260,288,260C192,260,96,260,48,260L0,260Z"
          />
        </svg>
      </div>

      <Header />

      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-16 px-4">
        {/* Tarjeta Limpia y Funcional */}
        <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-md flex flex-col items-center gap-6">
          
          {/* Ilustración sobria */}
          <section className="flex flex-col items-center text-center gap-3">
            <img
              src="/caja-carton.png"
              className="w-28 sm:w-32 drop-shadow-xs"
              alt="Dock"
            />

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Esto es <span className="text-purple-600 dark:text-purple-400">Dock</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1 leading-normal">
                Compartir archivos no debe costarte tiempo y plata. Ingresa el código de 4 dígitos para unirte.
              </p>
            </div>
          </section>

          {/* Formulario de Código OTP */}
          <section className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full">
              {/* 4 Inputs cuadrados con bordes definidos y visibles en modo claro */}
              <div className="grid grid-cols-4 gap-3 w-full max-w-[280px] mx-auto">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="text"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`aspect-square w-full text-center text-2xl sm:text-3xl font-mono font-bold rounded-lg border-[1.5px] outline-none transition-all ${
                      digit
                        ? "bg-purple-50/70 dark:bg-slate-800/80 border-purple-600 dark:border-purple-400 text-purple-950 dark:text-white shadow-xs"
                        : "bg-slate-50/60 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-3 focus:ring-purple-500/15"
                    }`}
                  />
                ))}
              </div>

              {/* Botón de acción con color sólido limpio (Morado sobrio) */}
              <Button
                type="submit"
                disabled={!isComplete}
                className="w-full h-11 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Unirme a la sala</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
