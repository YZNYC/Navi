"use client";

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import {
  PanelLeftClose, Search, Moon, Sun, Bell, ChevronDown, LogOut, UserCircle, MoreVertical, Menu, Inbox, X,
} from "lucide-react";

// -----------------------------------------------------------------------------
// FUNÇÃO NAVBAR,PESQUISA,TEMA,PERFIL,NOTIFICAÇÕES E MOBILE
// -----------------------------------------------------------------------------

export default function Navbar({ onToggleSidebar }) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const newTheme = current === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  };

  const toggleNotifications = () => { setNotificationOpen(!isNotificationOpen); setProfileOpen(false); setSearchOpen(false); };
  const toggleProfile = () => { setProfileOpen(!isProfileOpen); setNotificationOpen(false); setSearchOpen(false); };
  const toggleSearch = () => { setSearchOpen(!isSearchOpen); setNotificationOpen(false); setProfileOpen(false); };
  const toggleMobileMenu = () => { setMobileMenuOpen(!isMobileMenuOpen); };

  if (isLoading) {
    return <div className="h-20 bg-white dark:bg-slate-900 animate-pulse"></div>;
  }

// -----------------------------------------------------------------------------
// CONTEÚDO PRINCIPAL DA PÁGINA
// -----------------------------------------------------------------------------

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white dark:bg-slate-800 h-20 px-4 sm:px-6 flex items-center justify-between w-full border-b-2 border-amber-500 shadow-sm">
        <div className="hidden lg:flex items-center gap-4 w-full">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/admin/dashboard" className="flex items-center gap-2"><Image src="/dark.png" width={40} height={40} alt="Logo Navi" /><span className="font-bold text-2xl text-slate-800 dark:text-white">Navi</span></Link>
            <div className="h-8 w-px bg-slate-500/30"></div>
            <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><PanelLeftClose className=" cursor-pointer w-6 h-6 text-slate-500 dark:text-slate-400" /></button>
          </div>
          <div className="flex-1 flex justify-center px-8">
            <div className="relative w-full max-w-2xl xl:max-w-3xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2"><Search className="w-5 h-5 text-slate-400" /></span>
              <input type="text" placeholder="Pesquisar..." className="bg-slate-100 dark:bg-slate-700/40 border border-transparent focus:border-amber-500 focus:ring-amber-500 rounded-full py-2.5 pl-11 pr-4 w-full focus:outline-none focus:ring-2 text-slate-800 dark:text-white"/>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
            <NotificationButton isOpen={isNotificationOpen} onClick={toggleNotifications} />
            {user ? (<ProfileButton user={user} logout={logout} isOpen={isProfileOpen} setIsOpen={toggleProfile} />) : (<LoginButtons />)}
          </div>
        </div>
        <div className="flex lg:hidden items-center justify-between w-full">
          <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Menu className="w-6 h-6 text-slate-500 dark:text-slate-400" /></button>
          <Link href="/admin/dashboard" className="flex items-center gap-2"><Image src="/dark.png" width={32} height={32} alt="Logo Navi" /><span className="font-bold text-xl text-slate-800 dark:text-white">Navi</span></Link>
          <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><MoreVertical className="w-6 h-6 text-slate-500 dark:text-slate-400" /></button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-800 border-b-2 border-slate-200/10 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
            <button onClick={toggleSearch} className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-colors" aria-label="Pesquisar"><Search className="w-6 h-6 text-slate-500 dark:text-slate-400" /></button>
            <NotificationButton isOpen={isNotificationOpen} onClick={toggleNotifications} isMobile={true} />
          </div>
          {user && (<ProfileButton user={user} logout={logout} isOpen={isProfileOpen} setIsOpen={toggleProfile} isMobile={true} />)}
        </div>
      )}

      {isNotificationOpen && <FullscreenOverlay title="Notificações" onClose={toggleNotifications}><Inbox className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-2" /><p>Nenhuma notificação nova</p></FullscreenOverlay>}
      {isSearchOpen && <FullscreenOverlay title="Pesquisar" onClose={toggleSearch}><div className="relative w-4/5 max-w-md"><span className="absolute left-4 top-1/2 -translate-y-1/2"><Search className="w-5 h-5 text-slate-400" /></span><input type="text" placeholder="Pesquisar..." className="bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-amber-500 focus:ring-amber-500 rounded-full py-2.5 pl-11 pr-4 w-full focus:outline-none focus:ring-2 text-slate-800 dark:text-white" /></div></FullscreenOverlay>}
    </header>
  );
}

// -----------------------------------------------------------------------------
// COMPONENTES DE UI E ESTILOS
// -----------------------------------------------------------------------------

const ThemeToggleButton = ({ theme, toggleTheme }) => (<button onClick={toggleTheme} className="p-2 cursor-pointer rounded-full border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-colors" aria-label="Trocar Tema">{theme === "dark" ? <Sun className="w-6 h-6 text-slate-400" /> : <Moon className="w-6 h-6 text-slate-500" />}</button>);

const NotificationButton = ({ isOpen, onClick, isMobile = false }) => (
  <div className="relative cursor-pointer">
    <button onClick={onClick} className="cursor-pointer relative p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-colors" aria-label="Notificações">
      <Bell className="w-6 h-6 text-slate-500 dark:text-slate-400" />
      <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-orange-500 rounded-full"></span>
    </button>
    {isOpen && !isMobile && <NotificationDropdown />}
  </div>
);

const FullscreenOverlay = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-40 backdrop-blur-md bg-black/40 dark:bg-black/50 flex flex-col lg:hidden cursor-pointer">
    <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 shadow-md cursor-pointer">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
      <button onClick={onClose} className="p-1 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"><X className="w-6 h-6  cursor-pointer text-slate-800 dark:text-white" /></button>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 cursor-pointer">{children}</div>
  </div>
);

const NotificationDropdown = () => (
  <div className="hidden lg:block absolute top-full right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg p-2 z-50">
    <h4 className="font-semibold p-2 text-slate-800 dark:text-white">Notificações</h4>
    <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center"><Inbox className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" /><p>Nenhuma notificação nova</p></div>
  </div>
);

const ProfileButton = ({ user, logout, isOpen, setIsOpen, isMobile = false }) => { if (!user || !user.nome) return null; const userNameForAvatar = user.nome.replace(" ", "+"); return ( <div className={`relative ${isMobile ? "" : "ml-2"} group`}><button onClick={setIsOpen} className="flex items-center gap-2 cursor-pointer"><img src={user.url_foto_perfil || `https://ui-avatars.com/api/?name=${userNameForAvatar}&background=fb923c&color=fff`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-amber-500 transition"/><div className={`flex items-center gap-1 ${isMobile ? "" : "hidden md:flex"}`}><span className="text-sm font-medium text-slate-800 dark:text-white">{user.nome}</span><ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} /></div></button>{isOpen && <ProfileDropdown logout={logout} />}</div> );};
const LoginButtons = () => ( <div className="flex items-center gap-4 cursor-pointer"><a href="/" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400">Entrar</a></div> );
const ProfileDropdown = ({ logout }) => ( <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-50 cursor-pointer"><Link href="/perfil" className="flex items-center cursor-pointer gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"><UserCircle className="w-5 h-5" />Meu Perfil</Link><div className="h-px my-2 cursor-pointer bg-slate-500/30"></div><button onClick={logout} className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"><LogOut className="w-5 h-5 cursor-pointer" />Sair</button></div> );