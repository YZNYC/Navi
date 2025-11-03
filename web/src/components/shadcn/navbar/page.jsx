// src/components/shadcn/navbar/page.jsx (ou Header.jsx)
'use client'
import { useEffect, useState } from "react";
// Removi o 'HoveredLink' já que não será mais usado aqui
import { ModeToggle } from "../darkmode/darkMode";

// Componente helper para rolagem suave
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50); 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Texto branco com sombra para garantir legibilidade quando o fundo muda
  const linkTextColor = "text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.4)]";

  return (
    <header className={`fixed top-0 left-0 w-full z-20 hidden md:block transition-all duration-300 ${scrolled ? "backdrop-blur-sm bg-yellow-500/80 dark:bg-slate-800/80 shadow-lg dark:border-b dark:border-slate-700" : "bg-transparent"}`}>
      <nav className="flex items-center justify-center h-20 px-6 relative">
        <ul className={`flex items-center justify-center gap-x-8 lg:gap-x-12 font-semibold ${linkTextColor}`}>
          
          {/* ---- 5 Links à Esquerda ---- */}
          <li><SmoothScrollLink href="#showcase">História</SmoothScrollLink></li>
          <li><SmoothScrollLink href="#perfis">Objetivos</SmoothScrollLink></li>
          <li><SmoothScrollLink href="#app">Showcase</SmoothScrollLink></li>

          {/* ---- Logo ao Centro ---- */}
          <li className="px-4">
            <a href="#inicio" className="flex items-center">
              <img src="/light.png" alt="Logo Claro" className="max-h-16 w-auto object-contain block dark:hidden" />
              <img src="/fundo-amarelo.png" alt="Logo Escuro" className="max-h-16 w-auto object-contain hidden dark:block" />
            </a>
          </li>

          {/* ---- 5 Links à Direita ---- */}
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