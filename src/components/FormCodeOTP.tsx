import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { io } from "socket.io-client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname || "localhost"}:3000`;

interface FormCodeOTPProps {
  onSubmitStart?: () => void;
}

export default function FormCodeOTP({ onSubmitStart }: FormCodeOTPProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(API_URL);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const code = digits.join("").toUpperCase();
    if (code.length === 4) {
      setIsSubmitting(true);
      onSubmitStart?.();
      // Retardo para apreciar la animación completa y congelar mirando la URL antes de navegar
      setTimeout(() => {
        navigate(`/room/${code}`);
      }, 1500);
    }
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <section className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 items-center w-full"
      >
        <div>
          <InputOTP
            maxLength={4}
            value={digits.join("")}
            disabled={isSubmitting}
            onChange={(value) => {
              const updated = [...digits];
              for (let i = 0; i < 4; i++) {
                updated[i] = value[i] || "";
              }
              setDigits(updated);
            }}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            inputMode="text"
          >
            <InputOTPGroup className="*:p-10 *:text-xl *:uppercase *:text-[#5270a0] dark:*:text-gray-400 *:font-bold">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <span className="text-xs text-slate-400">
            El código tiene 4 caracteres. Puedes pegarlo completo
          </span>
        </div>

        <Button
          type="submit"
          disabled={!isComplete || isSubmitting}
          className="w-full h-13 text-sm font-semibold rounded-lg text-white shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="font-roboto text-lg tracking-wide">
            Unirme a la sala
          </span>
          <ArrowRight className="h-13 w-13 stroke-4" />
        </Button>
      </form>
    </section>
  );
}
