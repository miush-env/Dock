import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4 border-b border-gray-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <span className="text-xl font-bold tracking-tight text-blue-600">Dock</span>
      <Button variant="outline" size="sm">
        Claro
      </Button>
    </header>
  );
}
