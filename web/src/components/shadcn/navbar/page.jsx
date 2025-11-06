'use client'

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { ModeToggle } from "../darkmode/darkMode";

// -----------------------------------------------------------------------------
// FUNÇÃO DESLIZAMENTO SUAVE
// -----------------------------------------------------------------------------

const SmoothScrollLink = ({ href, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return <a href={href} onClick={handleClick} className="hover:text-amber-300 transition-colors">{children}</a>;
};

// -----------------------------------------------------------------------------
// NAVBAR
// -----------------------------------------------------------------------------

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50); 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkTextColor = "text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.4)]";

  return (
    <header className={`fixed top-0 left-0 w-full z-20 hidden md:block transition-all duration-300 ${scrolled ? "backdrop-blur-sm bg-yellow-500/80 dark:bg-slate-800/80 shadow-lg dark:border-b dark:border-slate-700" : "bg-transparent"}`}>
      <nav className="flex items-center justify-center h-20 px-6 relative">
        <ul className={`flex items-center justify-center gap-x-8 lg:gap-x-12 font-semibold ${linkTextColor}`}>
          
          <li><SmoothScrollLink href="#showcase">História</SmoothScrollLink></li>
          <li><SmoothScrollLink href="#perfis">Objetivos</SmoothScrollLink></li>
          <li><SmoothScrollLink href="#app">Showcase</SmoothScrollLink></li>
          <li className="px-4">
            <a href="#inicio" className="flex items-center">
              <img src="/light.png" alt="Logo Claro" className="max-h-16 w-auto object-contain block dark:hidden" />
              <img src="/fundo-amarelo.png" alt="Logo Escuro" className="max-h-16 w-auto object-contain hidden dark:block" />
            </a>
          </li>
          <li><SmoothScrollLink href="#video">Vídeo</SmoothScrollLink></li>
          <li><SmoothScrollLink href="#noticias">Melhorias</SmoothScrollLink></li>
          <li><SmoothScrollLink href="#contato">Contato</SmoothScrollLink></li>
        </ul>

        <div className="absolute right-6 flex items-center h-full">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}