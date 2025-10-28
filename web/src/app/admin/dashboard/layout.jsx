// src/app/adm/layout.js
"use client";
import { useState } from 'react';
import Sidebar from "../../../components/layout/sidebar/Sidebar";
import Navbar from "../../../components/Layout/Navbar/Navbar";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controlar a sidebar. Começa aberta.

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        // Contêiner principal: Usa flex-col para empilhar Navbar e o resto do conteúdo verticalmente.
        // min-h-screen garante que o layout ocupe a altura total da tela.
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* Navbar: Ocupa a largura total e passa a função para alternar a sidebar */}
            <Navbar onToggleSidebar={toggleSidebar} />

            {/* Este div agora é o contêiner para Sidebar e o conteúdo principal, dispostos horizontalmente. */}
            <div className="flex flex-1">
                {/* Sidebar:
                    - w-[18.5rem]: Largura padrão (aprox. 296px).
                    - w-0 overflow-hidden: Largura zero e esconde o conteúdo quando fechada.
                    - transition-all duration-300 ease-in-out: Adiciona uma transição suave.
                    - flex-shrink-0: Impede que a sidebar encolha.
                    - hidden md:flex: Mantém a sidebar oculta em telas pequenas por padrão, mas visível em md e maiores.
                    - h-full: GARANTE que o wrapper da sidebar ocupe toda a altura vertical disponível.
                */}
                <aside className={`flex-shrink-0 h-full
                                   ${isSidebarOpen ? 'w-[18.5rem]' : 'w-0 overflow-hidden'}
                                   transition-all duration-300 ease-in-out
                                   hidden md:flex flex-col justify-between`}>
                    <Sidebar /> {/* Seu componente Sidebar preenche este wrapper */}
                </aside>


                {/* Área de conteúdo principal:
                    - flex-1: Ocupa todo o espaço restante horizontalmente (ao lado da Sidebar).
                    - overflow-y-auto: Habilita rolagem vertical para o conteúdo do dashboard.
                    - p-0: Garante que não haja padding extra neste nível, permitindo que o 'children' controle isso.
                */}
                <main className={`flex-1 overflow-y-auto p-0`}>
                    {children}
                </main>
            </div>
        </div>
    );
}