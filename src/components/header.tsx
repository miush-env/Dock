import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Package, Sun, Moon } from "lucide-react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dock-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dock-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dock-theme", "light");
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-6 sm:px-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0b0f17]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-200">
      <a href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900">
          <Package className="w-4 h-4 stroke-[2]" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 uppercase leading-none">
            Dock
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            miush.env
          </span>
        </div>
      </a>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span>Oscuro</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
