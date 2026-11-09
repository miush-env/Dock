import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { Show, UserAvatar, useClerk, SignInButton } from "@clerk/react";
import { useRoomId } from "@utils/WhatIsRoomId";
import { MenuIcon, type MenuIconHandle } from "@/components/ui/menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const menuIconRef = useRef<MenuIconHandle>(null);
  const roomId = useRoomId();
  const { signOut, session } = useClerk();

  useEffect(() => {
    const savedTheme = localStorage.getItem("dock-theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

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

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      menuIconRef.current?.startAnimation(); // Pasa a la X
    } else {
      menuIconRef.current?.stopAnimation(); // Vuelve a las 3 barras
    }
  };

  const signOutAccount = async() => {
    await signOut(session?.id);
  };

  return (
    <header className="flex justify-between items-center w-full px-6 sm:px-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0b0f17]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-200">
      <a href="/" className="flex items-center gap-2.5">
        <div className="w-12 h-12 flex items-center justify-center text-white dark:text-slate-900">
          <img src="/petAppSVG-pos2.svg" alt="pet app logo" />
        </div>

        <span className="text-base font-poppins font-bold tracking-tight text-slate-900 dark:text-slate-100 uppercase leading-none">
          Dock
        </span>
      </a>

      <span>{roomId}</span>

      <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger>
          <MenuIcon ref={menuIconRef} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-30">
          <DropdownMenuItem>
            <Button
              type="button"
              onClick={toggleTheme}
              variant="outline"
              size="lg"
              className="w-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Claro
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  Oscuro
                </>
              )}
            </Button>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <Show when="signed-in">
              <UserAvatar />
            </Show>
          </DropdownMenuItem> */}
          <DropdownMenuItem>
            <Show when="signed-in">
              <Button onClick={signOutAccount} className="w-full dark:bg-red-300 bg-red-300/70 text-red-800 font-semibold" size="lg" variant="outline">
                Cerrar sesion
              </Button>
            </Show>
            <Show when="signed-out">
              <SignInButton />
            </Show>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
