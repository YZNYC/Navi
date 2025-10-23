'use client'
import { useEffect, useState } from "react";
import { HoveredLink } from "../ui/navbar-menu";
import { ModeToggle } from "../darkmode/darkMode";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50); 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  const linkTextColor = scrolled ? "text-gray-900 dark:text-gray-50" : "text-gray-500 dark:text-gray-300";

  return (
    <header className={`fixed top-0 left-0 w-full z-20 hidden md:block transition-all duration-300 ${scrolled ? "backdrop-blur-sm bg-yellow-500/70 dark:bg-slate-700/70 shadow-xl dark:border-slate-800" : "bg-transparent"}`}>
      <nav className="flex items-center justify-center h-20 px-6 relative">
        <ul className={`flex items-center justify-center gap-12 font-semibold transition-colors duration-300 ${linkTextColor}`}>
          <li><HoveredLink href="#home">Início</HoveredLink></li>
          <li><HoveredLink href="#funcionamento">Funcionamento</HoveredLink></li>

          <li>
            <a href="/" className="flex items-center">
              <img src="/light.png" alt="Logo Claro" className="max-h-16 w-auto object-contain block dark:hidden" />
              <img src="/fundo-amarelo.png" alt="Logo Escuro" className="max-h-16 w-auto object-contain hidden dark:block" />
            </a>
          </li>

          <li><HoveredLink href="#sobre">Sobre</HoveredLink></li>
          <li><HoveredLink href="#contato">Contato</HoveredLink></li>
        </ul>

        <div className="absolute right-6 flex items-center h-full">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}