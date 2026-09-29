import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname || "localhost"}:3000`;

interface FormCodeOTPProps {
  onInputActive?: () => void;
  onInputIdle?: () => void;
  onSubmitStart?: () => void;
}

export default function FormCodeOTP({
  onInputActive,
  onInputIdle,
  onSubmitStart,
}: FormCodeOTPProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(API_URL);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    onInputActive?.();
    const sanitized = value.slice(-1).toUpperCase();
    const updated = [...digits];
    updated[index] = sanitized;
    setDigits(updated);

    if (sanitized && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    onInputActive?.();
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    onInputActive?.();
    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 4)
      .toUpperCase();
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
      onSubmitStart?.();
      // Retardo para congelar mirando la URL y luego navegar
      setTimeout(() => {
        navigate(`/room/${code}`);
      }, 1200);
    }
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <section className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center w-full"
      >
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
              onFocus={onInputActive}
              onBlur={() => {
                // Si ninguna casilla está enfocada, vuelve a estar idle
                setTimeout(() => {
                  const anyFocused = inputRefs.current.some(
                    (el) => el === document.activeElement,
                  );
                  if (!anyFocused) {
                    onInputIdle?.();
                  }
                }, 100);
              }}
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
  );
}
