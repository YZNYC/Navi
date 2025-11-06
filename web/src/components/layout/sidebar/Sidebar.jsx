"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext'; 

import { 
    LayoutDashboard, Users, ParkingCircle, BarChart3, Bot, 
    FileText, MessageSquare, Book, LifeBuoy, Wallet, KeyRound, 
    CheckSquare, Wind, MapPin, Mail, Clock, ChevronUp, Phone, BookOpen
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    let navItems = gestorNavItems; // Padrão
    if (user?.papel === 'ADMINISTRADOR') { navItems = adminNavItems; } 
    else if (user?.papel === 'PROPRIETARIO') { navItems = proprietarioNavItems; }
    
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
                             border-r-2 border-amber-500
                             transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                             ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}
            >
                
                <div className="h-20 shrink-0 border-b border-slate-200 dark:border-slate-700"></div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavItem key={item.name} item={item} isOpen={isOpen} />
                    ))}
                </nav>
                
                <div className={`shrink-0 border-t border-slate-200 dark:border-slate-700 p-2
                                transition-opacity duration-300 ${!isOpen && 'lg:px-0'}`}>
                    
                    <div className="py-2 space-y-1">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button title={!isOpen ? 'Documentação' : ''} className={`w-full flex items-center gap-3 p-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white ${!isOpen && 'lg:justify-center'}`}>
                                    <Book className="w-6 h-6 shrink-0"/>
                                    <span className={`whitespace-nowrap ${!isOpen && 'lg:hidden'}`}>Documentação</span>
                                </button>
                            </DialogTrigger>
                            <ModalDocumentacao />
                        </Dialog>
                        
                        <Dialog>
                            <DialogTrigger asChild>
                                <button title={!isOpen ? 'Suporte' : ''} className={`w-full flex items-center gap-3 p-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white ${!isOpen && 'lg:justify-center'}`}>
                                    <LifeBuoy className="w-6 h-6 shrink-0"/>
                                    <span className={`whitespace-nowrap ${!isOpen && 'lg:hidden'}`}>Suporte</span>
                                </button>
                            </DialogTrigger>
                            <ModalSuporte />
                        </Dialog>
                    </div>
                    
                    <div className={`p-4 mt-2 border-t border-slate-200 dark:border-slate-700 space-y-4
                                     transition-opacity duration-300 ${!isOpen && 'lg:hidden'}`}>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Navi Systems HQ</h4>
                        
                        <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0"/><span>Avenida Paulista, 1578, São Paulo - SP, 01310-200</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <Mail className="w-4 h-4 shrink-0"/><span>contato@navi.com.br</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <Phone className="w-4 h-4 shrink-0"/><span>+55 (11) 99999-9999</span>
                        </div>
                         <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-4 h-4 shrink-0"/><span>Seg. à Sex. | 08h - 18h</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

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
                    <ChevronUp className={`w-4 h-4 shrink-0 transition-transform duration-300 ease-in-out ${!isSubMenuOpen && 'rotate-180'} ${!isOpen && 'lg:hidden'}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSubMenuOpen && isOpen ? 'max-h-96' : 'max-h-0'}`}>
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
                </div>
            </div>
        );
    }
    
    const isActive = pathname === item.href;
    return (
        <Link
            href={item.href}
            title={!isOpen ? item.name : ''}
            className={`flex items-center gap-4 p-3 rounded-lg group
            ${isActive ? 'bg-amber-500 text-white font-semibold shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}
            ${!isOpen && 'lg:justify-center'}`}
        >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className={`whitespace-nowrap transition-opacity ${!isOpen && 'lg:hidden'}`}>{item.name}</span>
        </Link>
    );
};

const ModalDocumentacao = () => (
    <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="w-6 h-6 text-amber-500"/>
                Guia Rápido da API
            </DialogTitle>
            <DialogDescription>
                Um resumo dos principais endpoints e como interagir com a API do Navi.
            </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div>
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Autenticação</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Toda requisição para rotas protegidas deve conter o cabeçalho `Authorization: Bearer [SEU_TOKEN]`.</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Exemplo: Criar Estacionamento</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Endpoint: `POST /estacionamentos`</p>
                <pre className="mt-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-md text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                    <code>
{`{
  "nome": "Estacionamento Central",
  "cnpj": "12.345.678/0001-99",
  "cep": "01001-000",
  "numero": "150"
}`}
                    </code>
                </pre>
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button className="bg-[#efb000] text-gray-900 hover:bg-[#f6bb00]">Fechar</Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
);

const ModalSuporte = () => (
    <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <DialogTitle className="text-2xl">Precisa de Ajuda?</DialogTitle>
            <DialogDescription>
                Estamos aqui para ajudar! Escolha a melhor opção de contato para você.
            </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <Link href="/faq" className="block p-4 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <h4 className="font-semibold text-slate-800 dark:text-white">Consulte nosso FAQ</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Respostas rápidas para as perguntas mais comuns.</p>
            </Link>
             <a href="mailto:contato@navi.com.br" className="block p-4 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <h4 className="font-semibold text-slate-800 dark:text-white">Envie um Email</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Nossa equipe responderá em até 24 horas úteis.</p>
            </a>
             <a href="#" className="block p-4 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <h4 className="font-semibold text-slate-800 dark:text-white">WhatsApp (Em breve)</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Suporte em tempo real para questões urgentes.</p>
            </a>
        </div>
    </DialogContent>
);