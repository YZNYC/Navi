'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link"; // A tag 'Link' do Next.js ainda é útil para acessibilidade e semântica

// Componente para criar os itens do menu com a lógica de rolagem
const SmoothScrollMenuItem = ({ href, children, onLinkClick }) => {
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // 1. Chama a função para fechar o menu mobile, se ela for passada
    if (onLinkClick) {
      onLinkClick();
    }
    
    // 2. Lógica de rolagem suave
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
        {/* Usamos a tag 'a' diretamente para controle total do 'onClick' */}
        <a href={href} onClick={handleClick}>{children}</a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

// --- SEU COMPONENTE 'NavMenu' MODIFICADO ---
// Ele agora pode receber uma função 'onLinkClick' para fechar o menu ao navegar
export const NavMenu = ({ onLinkClick }) => (
  <NavigationMenu orientation="vertical">
    <NavigationMenuList
      className="gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start"
    >
      {/* Agora usamos o componente 'SmoothScrollMenuItem' para cada link */}
      <SmoothScrollMenuItem href="#inicio" onLinkClick={onLinkClick}>Início</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#funcionalidades" onLinkClick={onLinkClick}>Funcionalidades</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#showcase" onLinkClick={onLinkClick}>Objetivo</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#perfis" onLinkClick={onLinkClick}>Vantagens</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#app" onLinkClick={onLinkClick}>Showcase</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#faq" onLinkClick={onLinkClick}>FAQ</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#video" onLinkClick={onLinkClick}>Vídeo</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#noticias" onLinkClick={onLinkClick}>Melhorias</SmoothScrollMenuItem>
      <SmoothScrollMenuItem href="#contato" onLinkClick={onLinkClick}>Contato</SmoothScrollMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);