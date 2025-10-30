// src/components/Layout/Navbar/Navbar.jsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// AJUSTE O CAMINHO
import { useAuth } from '../../../contexts/AuthContext';
// ... Ícones ...
import { PanelLeftClose, Search, Moon, Sun, Bell, ChevronDown, LogOut, UserCircle, MoreVertical, Menu, Inbox } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState('dark');
    const { user, logout, isLoading } = useAuth(); // <-- Pega o 'isLoading'

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        setTheme(current => {
            const newTheme = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return newTheme;
        });
    };
    
    const toggleNotifications = () => {
        setNotificationOpen(!isNotificationOpen);
        setProfileOpen(false);
    };
    
    const toggleProfile = () => {
        setProfileOpen(!isProfileOpen);
        setNotificationOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    // Enquanto 'isLoading' for true, mostra um placeholder para evitar erros.
    if (isLoading) {
        return <div className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 animate-pulse"></div>;
    }

    return (
        <header className="sticky top-0 z-50">
            <nav className="bg-white dark:bg-slate-800 h-20 px-4 sm:px-6 flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-700 shadow-sm">
                
                <div className="hidden lg:flex items-center gap-4 w-full">
                    <div className="flex items-center gap-4 shrink-0"><Link href="/admin/dashboard" className="flex items-center gap-2"><Image src="/dark.png" width={40} height={40} alt="Logo Navi" /><span className="font-bold text-2xl text-slate-800 dark:text-white">Navi</span></Link><div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div><button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><PanelLeftClose className="w-6 h-6 text-slate-500 dark:text-slate-400" /></button></div>
                    <div className="flex-1 flex justify-center px-8"><div className="relative w-full max-w-2xl xl:max-w-3xl"><span className="absolute left-4 top-1/2 -translate-y-1/2"><Search className="w-5 h-5 text-slate-400" /></span><input type="text" placeholder="Pesquisar..." className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full py-2.5 pl-11 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white" /></div></div>
                    <div className="flex items-center gap-4 shrink-0"><ThemeToggleButton theme={theme} toggleTheme={toggleTheme} /><NotificationButton isOpen={isNotificationOpen} onClick={toggleNotifications} />{user ? <ProfileButton user={user} logout={logout} isOpen={isProfileOpen} setIsOpen={toggleProfile} /> : <LoginButtons />}</div>
                </div>
                <div className="flex lg:hidden items-center justify-between w-full"><button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><Menu className="w-6 h-6 text-slate-500 dark:text-slate-400" /></button><Link href="/admin/dashboard" className="flex items-center gap-2"><Image src="/dark.png" width={32} height={32} alt="Logo Navi" /><span className="font-bold text-xl text-slate-800 dark:text-white">Navi</span></Link><button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><MoreVertical className="w-6 h-6 text-slate-500 dark:text-slate-400" /></button></div>
            </nav>
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-4"><ThemeToggleButton theme={theme} toggleTheme={toggleTheme} /><NotificationButton isOpen={isNotificationOpen} onClick={toggleNotifications} isMobile={true}/></div>
                    {user && <ProfileButton user={user} logout={logout} isOpen={isProfileOpen} setIsOpen={toggleProfile} isMobile={true} />}
                </div>
            )}
        </header>
    );
}

// Componentes Auxiliares
const ThemeToggleButton = ({ theme, toggleTheme }) => ( <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Trocar Tema">{theme === 'dark' ? <Sun className="w-6 h-6 text-slate-400" /> : <Moon className="w-6 h-6 text-slate-500" />}</button> );
const NotificationButton = ({ isOpen, onClick }) => ( <div className="relative"><button onClick={onClick} className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Notificações"><Bell className="w-6 h-6 text-slate-500 dark:text-slate-400" /><span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-orange-500 rounded-full"></span></button>{isOpen && <NotificationDropdown />}</div> );

const ProfileButton = ({ user, logout, isOpen, setIsOpen, isMobile = false }) => {
    // A guarda de segurança previne o erro de runtime.
    if (!user || !user.nome) {
        return null; 
    }
    const userNameForAvatar = user.nome.replace(' ', '+');
    return (
        <div className={`relative ${isMobile ? '' : 'ml-2'}`}><button onClick={setIsOpen} className="flex items-center gap-2"><img src={user.url_foto_perfil || `https://ui-avatars.com/api/?name=${userNameForAvatar}&background=c2410c&color=fff`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600"/><div className={`flex items-center gap-1 ${isMobile ? '' : 'hidden md:flex'}`}><span className="text-sm font-medium text-slate-800 dark:text-white">{user.nome}</span><ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></div></button>{isOpen && <ProfileDropdown logout={logout} />}</div>
    );
};
const LoginButtons = () => ( <div className="flex items-center gap-4"><a href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400">Entrar</a></div> );
const NotificationDropdown = () => ( <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 z-50"><h4 className="font-semibold p-2 text-slate-800 dark:text-white">Notificações</h4><div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">Nenhuma notificação nova</div></div> );
const ProfileDropdown = ({ logout }) => ( <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-50"><Link href="/perfil" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"><UserCircle className="w-5 h-5" />Meu Perfil</Link><div className="h-px my-2 bg-slate-200 dark:bg-slate-700"></div><button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"><LogOut className="w-5 h-5" />Sair</button></div> );