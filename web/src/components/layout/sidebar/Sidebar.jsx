// src/components/Layout/Sidebar/Sidebar.jsx
"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext'; 

// Importe TODOS os ícones que serão usados, incluindo os do footer
import { 
    LayoutDashboard, Users, ParkingCircle, BarChart3, Bot, 
    FileText, MessageSquare, Cog, LifeBuoy, Wallet, KeyRound, 
    CheckSquare, Wind, MapPin, Mail, Clock, ChevronUp
} from 'lucide-react';

const adminNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Navi IA", href: "/admin/navi-ia", icon: Bot },
    { name: "Estabelecimentos", href: "/admin/estabelecimentos", icon: ParkingCircle },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
    { name: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
    { name: "Chat", href: "/admin/chat", icon: MessageSquare },
    { name: "Logs", href: "/admin/logs", icon: FileText },
];

const proprietarioNavItems = [
    { name: "Dashboard", href: "/proprietario/dashboard", icon: LayoutDashboard },
    { name: "Navi IA", href: "/proprietario/navi-ia", icon: Bot },
    {
        name: "Estabelecimento", icon: ParkingCircle,
        subItems: [
            { name: "Criação de Vaga", href: "/proprietario/vagas" },
            { name: "Funcionários", href: "/proprietario/funcionarios" },
        ]
    },
    {
        name: "Financeiro", icon: Wallet,
        subItems: [
            { name: "Política de Preço", href: "/proprietario/politicas" },
            { name: "Planos Mensais", href: "/proprietario/planos" },
            { name: "Cupons", href: "/proprietario/cupons" },
        ]
    },
    { name: "Chat", href: "/proprietario/chat", icon: MessageSquare },
    { name: "Logs", href: "/proprietario/logs", icon: FileText },
];

const gestorNavItems = [
    { name: "Dashboard", href: "/gestor/dashboard", icon: LayoutDashboard },
    { name: "Ocupação", href: "/gestor/ocupacao", icon: Wind },
    { name: "Reservas", href: "/gestor/reservas", icon: CheckSquare },
    { name: "Ativação de Plano", href: "/gestor/ativacao-plano", icon: KeyRound },
    { name: "Chat", href: "/gestor/chat", icon: MessageSquare },
];


export default function Sidebar({ isOpen, onToggle }) {
    const { user } = useAuth();
    const pathname = usePathname();

    let navItems;
    if (user?.papel === 'ADMINISTRADOR') { navItems = adminNavItems; } 
    else if (user?.papel === 'PROPRIETARIO') { navItems = proprietarioNavItems; }
    else { navItems = gestorNavItems; }
    
    return (
        <>
            <div
                onClick={onToggle}
                className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            <aside
                className={`fixed top-0 left-0 h-full flex flex-col z-40
                             bg-white dark:bg-slate-800 
                             text-slate-500 dark:text-slate-400
                             
                             // Animação mais fluida com 'cubic-bezier'
                             transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                             
                             // Comportamento Mobile
                             ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                             ${isOpen ? 'w-72 sm:w-64' : 'lg:w-20'}`}
            >
                
                {/* Header da Sidebar */}
                <div className="h-20 shrink-0 border-b border-slate-200 dark:border-slate-700"></div>

                {/* Menu de Navegação */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavItem key={item.name} item={item} isOpen={isOpen} />
                    ))}
                </nav>
                
                {/* --- FOOTER MELHORADO --- */}
                <div className={`shrink-0 border-t border-slate-200 dark:border-slate-700 p-2
                                ${!isOpen && 'lg:hidden'}`}> {/* Esconde o footer inteiro quando minimizado */}
                    
                    {/* Itens de Suporte */}
                    <div className="px-2 py-2 space-y-1">
                        <a href="#" className="flex items-center gap-3 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                            <Cog className="w-5 h-5"/><span>Configurações</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                            <LifeBuoy className="w-5 h-5"/><span>Suporte</span>
                        </a>
                    </div>
                    
                    {/* Informações da Sede */}
                    <div className="px-4 py-4 mt-2 border-t border-slate-200 dark:border-slate-700 space-y-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Navi Systems HQ</h4>
                        
                        <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0"/>
                            <span>Avenida Paulista, 1578, São Paulo - SP</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <Mail className="w-4 h-4 shrink-0"/>
                            <span>contato@navi.com.br</span>
                        </div>
                         <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-4 h-4 shrink-0"/>
                            <span>Seg. à Sex. | 08h - 18h</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

// --- Componente NavItem (com as cores atualizadas) ---

const NavItem = ({ item, isOpen }) => {
    const pathname = usePathname();
    const [isSubMenuOpen, setSubMenuOpen] = useState(false);

    if (item.subItems) {
        const isSubMenuActive = item.subItems.some(sub => pathname.startsWith(sub.href));
        return (
            <div>
                <button
                    onClick={() => setSubMenuOpen(!isSubMenuOpen)}
                    className={`w-full flex items-center justify-between gap-4 p-3 rounded-lg group
                    ${isSubMenuActive ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}
                    ${!isOpen && 'lg:justify-center'}`}
                >
                    <div className="flex items-center gap-4">
                        <item.icon className="w-6 h-6 shrink-0" />
                        <span className={`transition-opacity duration-200 ${!isOpen && 'lg:hidden'}`}>{item.name}</span>
                    </div>
                    <ChevronUp className={`w-4 h-4 shrink-0 transition-transform ${!isSubMenuOpen && 'rotate-180'} ${!isOpen && 'lg:hidden'}`} />
                </button>
                {isSubMenuOpen && isOpen && (
                    <div className="pl-8 space-y-1 mt-1 border-l-2 border-slate-200 dark:border-slate-700 ml-5">
                        {item.subItems.map(subItem => {
                            const isSubActive = pathname.startsWith(subItem.href);
                            return (
                                <Link key={subItem.name} href={subItem.href}
                                    className={`block p-2 rounded-md text-sm
                                    ${isSubActive ? 'text-amber-500 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    - {subItem.name}
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    }
    
    const isActive = pathname.startsWith(item.href);
    return (
        <Link
            href={item.href}
            title={!isOpen ? item.name : ''}
            className={`flex items-center gap-4 p-3 rounded-lg group
            ${isActive ? 'bg-amber-500 text-white font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}
            ${!isOpen && 'lg:justify-center'}`}
        >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className={`whitespace-nowrap transition-opacity ${!isOpen && 'lg:hidden'}`}>{item.name}</span>
        </Link>
    );
};