// src/components/Layout/Sidebar/Sidebar.jsx
"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// Certifique-se de que 'lucide-react' está instalado
import { LayoutDashboard, ChevronUp, Users, ParkingCircle, BarChart3, Settings, LifeBuoy } from 'lucide-react';

export default function Sidebar({ isOpen, onToggle }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Estacionamentos", href: "/admin/estacionamentos", icon: ParkingCircle },
        { name: "Usuários", href: "/admin/usuarios", icon: Users },
        { name: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
    ];
    
    return (
        <>
            {/* Backdrop para fechar a sidebar no mobile */}
            <div
                onClick={onToggle}
                className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            ></div>

            <aside
                className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex flex-col z-40 transition-transform duration-300 ease-in-out 
                w-full sm:w-80 lg:static lg:translate-x-0  {/* <<< MUDANÇA ESTÁ AQUI */}
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isOpen ? 'lg:w-64' : 'lg:w-20'}
                `}
            >
                {/* O conteúdo da sidebar agora começa diretamente com a navegação */}
                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={!isOpen ? item.name : ''}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-colors group
                                ${isActive ? 'bg-amber-500/10 text-amber-500 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}
                                ${!isOpen && 'lg:justify-center'}`}
                            >
                                <Icon className="w-6 h-6 shrink-0" />
                                <span className={`transition-all duration-200 ${!isOpen && 'lg:hidden'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                
                {/* --- SEÇÃO INFERIOR ("FOOTER") --- */}
                <div className="shrink-0">
                    {/* Drop-up de "Outros Portais" */}
                    <div className={`relative px-4 pt-2 border-t border-slate-200 dark:border-slate-700 ${!isOpen && 'lg:hidden'}`}>
                         <button 
                            onClick={() => setDropdownOpen(!isDropdownOpen)} 
                            className="w-full flex justify-between items-center p-2 rounded-lg "
                         >
                             <span className="font-semibold text-sm">Outros Portais</span>
                             <ChevronUp className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                         </button>
                         {isDropdownOpen && (
                             <div className="absolute bottom-full left-0 right-0 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                                <div className="space-y-2">
                                    <a href="#" className="block text-sm p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-600">Portal A</a>
                                    <a href="#" className="block text-sm p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-600">Portal B</a>
                                </div>
                             </div>
                         )}
                    </div>
                
                    {/* Informações de Contato */}
                    <div className={`p-4 border-t border-slate-200 dark:border-slate-700 ${!isOpen && 'lg:hidden'}`}>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Navi Systems</h4>
                        <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <p><strong>Telefone:</strong> (11) 9999-8888</p>
                            <p><strong>Email:</strong> contato@navi.com.br</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}