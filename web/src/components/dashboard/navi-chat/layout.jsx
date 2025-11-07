// src/components/NaviChat/NaviLayout.js

"use client";
import React, { useState } from 'react';
import { FolderOpenIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

// Mock de Chats Antigos (Substitua por lógica de BD real)
const MOCK_CHATS = [
    { id: 1, title: "Análise de Faturamento de Março" },
    { id: 2, title: "Contagem de Usuários e Roles" },
    { id: 3, title: "Plano de Vagas PCD" },
];

/**
 * Componente de Layout completo (Conversas + Chat Principal + Arquivos)
 * @param {object} children - O componente NaviChat real
 * @param {object} customHeader - Componente de Seleção de Estacionamento (Proprietário)
 * @param {array} generatedFiles - Lista de arquivos gerados pelo NaviChat
 * @param {function} onFileClick - Função para rolar até o arquivo no chat
 */
export const NaviLayout = ({ children, customHeader, generatedFiles, onFileClick }) => {
    const [isChatsOpen, setIsChatsOpen] = useState(true); // Histórico de Chats (Esquerda)
    const [isFilesOpen, setIsFilesOpen] = useState(false); // Arquivos Gerados (Direita)
    
    // Simulação da navegação entre chats
    const [selectedChatId, setSelectedChatId] = useState(1); 
    
    return (
        // Define a altura total da viewport (h-screen)
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-200">

            {/* PAINEL DE CONVERSAS (ESQUERDA) - Sempre visível em Desktop */}
            <aside 
                className={`flex-shrink-0 w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-4 
                            transition-transform duration-300 ease-in-out lg:static fixed h-full z-30 
                            ${isChatsOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl flex items-center">
                        <ChatBubbleLeftIcon className="w-6 h-6 mr-2 text-yellow-500" />
                        Conversas
                    </h3>
                    <button onClick={() => setIsChatsOpen(false)} className="lg:hidden text-gray-500 hover:text-red-500">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Lista de Chats (Scrollável) */}
                <div className="space-y-2 overflow-y-auto h-5/6">
                    {MOCK_CHATS.map(chat => (
                        <button 
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`w-full p-3 rounded-lg text-left transition-colors duration-150 truncate 
                                ${selectedChatId === chat.id 
                                    ? 'bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 font-semibold' 
                                    : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                        >
                            {chat.title}
                        </button>
                    ))}
                    {/* Botão para Nova Conversa (Simulado) */}
                    <button className="w-full p-3 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-50 text-center font-medium mt-4">
                        + Novo Chat
                    </button>
                </div>
            </aside>
            
            {/* BOTÃO DE ABRIR CHATS (Mobile) */}
            <button 
                onClick={() => setIsChatsOpen(true)}
                className={`fixed top-4 left-4 z-20 p-2 rounded-full shadow-lg bg-yellow-500 hover:bg-yellow-600 text-white lg:hidden`}
            >
                <ChatBubbleLeftIcon className="w-6 h-6" />
            </button>


            {/* CONTEÚDO PRINCIPAL (CHAT E INPUT) */}
            <main className="flex-grow flex flex-col h-full relative">
                
                {/* HEADER COM SELETOR DE ESTACIONAMENTO */}
                <div className="flex-shrink-0 p-4 bg-white border-b dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        {customHeader ? 'Gestão de Estacionamento' : 'Painel Global'}
                    </h1>
                    {customHeader}

                    {/* Botão de Abrir Arquivos (Direita) */}
                    <button 
                        onClick={() => setIsFilesOpen(!isFilesOpen)}
                        className={`p-2 rounded-lg transition-colors duration-150 
                            ${isFilesOpen ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                    >
                        {isFilesOpen ? <XMarkIcon className="w-6 h-6" /> : <FolderOpenIcon className="w-6 h-6" />}
                    </button>
                </div>

                {/* Área de Mensagens (Onde o Scroll Acontece) - children é o NaviChat */}
                <div className="flex-grow overflow-hidden">
                    {children} 
                </div>

            </main>

            {/* PAINEL DE ARQUIVOS (DIREITA) - Arquivos Gerados */}
            <aside 
                className={`flex-shrink-0 w-64 bg-white dark:bg-slate-800 border-l dark:border-slate-700 p-4 overflow-y-auto 
                            transition-transform duration-300 ease-in-out fixed right-0 h-full z-30 lg:static 
                            ${isFilesOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}
            >
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg">Arquivos Gerados ({generatedFiles.length})</h3>
                    <button onClick={() => setIsFilesOpen(false)} className="lg:hidden text-gray-500 hover:text-red-500">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <ul className="space-y-2">
                    {generatedFiles.slice().reverse().map((file) => (
                        <li key={file.id}>
                            {file.type === 'chart' ? (
                                <button 
                                    onClick={() => onFileClick(file.id)}
                                    className="flex items-center space-x-2 text-sm text-gray-700 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 w-full text-left transition"
                                >
                                    <ChartBarIcon className="w-5 h-5 flex-shrink-0 text-yellow-500" />
                                    <span className="truncate">{file.title}</span>
                                </button>
                            ) : (
                                <a 
                                    href={file.downloadLink} 
                                    download={file.title}
                                    className="flex items-center space-x-2 text-sm text-gray-700 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 w-full text-left transition"
                                >
                                    <DocumentTextIcon className="w-5 h-5 flex-shrink-0 text-yellow-500" />
                                    <span className="truncate">{file.title}</span>
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </aside>
            
            {/* Fechar menu de chats em mobile ao clicar fora */}
            {isChatsOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsChatsOpen(false)} />}
        </div>
    );
};