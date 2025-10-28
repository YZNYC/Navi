// src/app/admin/dashboard/layout.jsx
"use client";

import { useState } from "react";
// AJUSTE OS CAMINHOS CONFORME SUA ESTRUTURA
import Navbar from "../../../components/Layout/Navbar/Navbar";
import Sidebar from "../../../components/Layout/Sidebar/Sidebar";

export default function DashboardLayout({ children }) {
    // --- ALTERAÇÃO AQUI ---
    // Inicia a sidebar como FECHADA por padrão.
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="h-screen bg-white dark:bg-slate-900">
            <Navbar onToggleSidebar={handleToggleSidebar} />
            
            <div className="flex h-[calc(100vh-5rem)]">
                <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />
                
                {/* 
                    IMPORTANTE: O layout do <main> precisa ser ajustado
                    para lidar com o estado inicial fechado no desktop.
                */}
                <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 md:p-6 lg:p-8
                    ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} 
                `}>
                    {children}
                </main>
            </div>
        </div>
    );
}