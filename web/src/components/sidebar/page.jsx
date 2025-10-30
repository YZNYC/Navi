// components/Sidebar.js
'use client'; 
import React from 'react';

const navItems = [
    { name: 'Início', key: 'plans' },
    { name: 'Meu caixa', key: 'caixa' },
    { name: 'Perfil', key: 'perfil' },
    { name: 'Relatórios', key: 'reports' },
    { name: 'Sair', key: 'logout' },
];

export default function Sidebar({ activeKey, onItemClick }) {
    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 shadow-xl">
            
            <div className="mb-8 border-b border-gray-700 pb-4">
                <h2 className="text-xl font-semibold text-indigo-400">
                    Painel do Funcionário
                </h2>
            </div>
            
            <nav>
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.key}>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    onItemClick(item.key); 
                                }}
                                className={`
                                    flex items-center p-3 rounded-lg transition duration-200 cursor-pointer
                                    ${activeKey === item.key 
                                        ? 'bg-indigo-600 font-bold' 
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }
                                `}
                            >
                                <span className="ml-3">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}