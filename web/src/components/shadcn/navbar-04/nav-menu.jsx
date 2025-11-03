'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "../darkmode/darkMode"; // <-- 1. Importe o ModeToggle

// Componente para criar os itens do menu com a lógica de rolagem
const SmoothScrollMenuItem = ({ href, children, onLinkClick }) => {
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onLinkClick) {
      onLinkClick();
    }
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <a href={href} onClick={handleClick}>{children}</a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

// --- SEU COMPONENTE 'NavMenu' MODIFICADO ---
export const NavMenu = ({ onLinkClick }) => (
  <NavigationMenu orientation="vertical">
    <NavigationMenuList
      // Adicionei 'h-full flex-col' para garantir que o layout ocupe a altura
      className="gap-4 space-x-0 w-full flex h-full flex-col items-start justify-start p-4"
    >
      <SmoothScrollMenuItem href="#inicio" onLinkClick={onLinkClick}>Início</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#funcionalidades" onLinkClick={onLinkClick}>Funcionalidades</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#showcase" onLinkClick={onLinkClick}>Objetivo</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#perfis" onLinkClick={onLinkClick}>Vantagens</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#app" onLinkClick={onLinkClick}>Showcase</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#faq" onLinkClick={onLinkClick}>FAQ</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#video" onLinkClick={onLinkClick}>Vídeo</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#noticias" onLinkClick={onLinkClick}>Melhorias</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#contato" onLinkClick={onLinkClick}>Contato</SmoothScrollMenuItem>
      
      {/* Separador visual (opcional) */}
      <div className="w-full border-t border-slate-200 dark:border-slate-800 my-4" />

      {/* --- 2. ADICIONE O BOTÃO DE TEMA AQUI --- */}
      <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Mudar tema</span>
          <ModeToggle />
      </div>

    </NavigationMenuList>
  </NavigationMenu>
);