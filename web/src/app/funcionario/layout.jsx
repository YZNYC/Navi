'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/page';
import Navbar from '../../components/navbar-funcionario/page';
import AtivarPlanos from '../../components/content/AtivarPlanos';
import Perfil from '../../components/content/Perfil';


const contentMap = {
    plans: AtivarPlanos,
    perfil: Perfil
};

export default function Layout({ children }) {
    const [activeSection, setActiveSection] = useState('plans');

    const ActiveComponent = contentMap[activeSection];

    return (
        <div className="flex min-h-screen bg-gray-50">

            <Sidebar
                activeKey={activeSection}
                onItemClick={(key) => {
                    if (key === 'logout') {
                        console.log("Usuário clicou em Sair/Logout");
                    } else {
                        setActiveSection(key);
                    }
                }}
            />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="flex-1 mt-16 ml-64 p-8">
                    {ActiveComponent ? (
                        <ActiveComponent />
                    ) : (
                        <div className="text-center p-10 bg-white rounded-lg shadow">
                            <h2 className="text-2xl font-bold">Conteúdo Não Encontrado ou Sessão Inválida</h2>
                            <p>Se você acabou de deslogar, esta é a página de transição.</p>
                        </div>
                    )}
                </main>

            </div>

        </div>
    );
}