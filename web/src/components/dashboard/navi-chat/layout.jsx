// src/components/NaviChat/NaviLayout.js

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { FolderOpenIcon, XMarkIcon, ChatBubbleLeftIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

/**
 * Componente de Layout completo (Conversas + Chat Principal + Modal de Arquivos)
 */
export const NaviLayout = ({ 
    children, 
    customHeader, 
    generatedFiles, 
    onFileClick, 
    mainTitle, 
    isProprietarioMode,
    conversaId, // NOVO: Passado pelo wrapper
    onNewChat, // NOVO: Função para iniciar uma nova conversa
    onSelectChat // NOVO: Função para selecionar uma conversa
}) => {
    const [isChatsOpen, setIsChatsOpen] = useState(true); // Histórico de Chats (Esquerda)
    const [isFilesOpen, setIsFilesOpen] = useState(false); // Modal de Arquivos (Direita)
    const [userChats, setUserChats] = useState([]); 

    // Efeito para buscar as conversas do usuário
    const fetchChats = useCallback(async () => {
        try {
            // ASSUMIDO: O token de autenticação está em um interceptor global ou headers
            const res = await fetch('/api/conversas-navi'); 
            if (!res.ok) throw new Error("Falha ao carregar conversas.");

            const chats = await res.json();
            setUserChats(chats);
            
            // Se for a primeira carga e houver chats, seleciona o mais recente
            if (chats.length > 0 && conversaId === null) {
                onSelectChat(chats[0].id); 
            }
        } catch (error) {
            console.error("Erro ao buscar histórico de chats:", error);
        }
    }, [conversaId, onSelectChat]);
    
    useEffect(() => {
        fetchChats();
    }, [fetchChats]); 

    // NOVO: Função para fechar ambos os modais ao clicar fora em mobile
    const handleOutsideClick = (e) => {
        // Se o clique não foi no painel, feche-o (apenas em telas pequenas)
        if (window.innerWidth < 1024) { // 1024px é o breakpoint lg do Tailwind
            if (isChatsOpen) setIsChatsOpen(false);
            if (isFilesOpen) setIsFilesOpen(false);
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 overflow-hidden">

            {/* PAINEL DE CONVERSAS (ESQUERDA) */}
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
                
                <button 
                    onClick={() => { onNewChat(); setIsChatsOpen(false); }}
                    className="w-full p-3 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-50 text-center font-medium mb-4"
                >
                    + Novo Chat
                </button>
                
                {/* Lista de Chats (Scrollável) */}
                <div className="space-y-2 overflow-y-auto h-[calc(100%-140px)]"> 
                    {userChats.length > 0 ? (
                        userChats.map(chat => (
                            <button 
                                key={chat.id}
                                onClick={() => { onSelectChat(chat.id); setIsChatsOpen(false); }}
                                className={`w-full p-3 rounded-lg text-left transition-colors duration-150 truncate 
                                    ${conversaId === chat.id 
                                        ? 'bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 font-semibold' 
                                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                            >
                                {chat.titulo}
                            </button>
                        ))
                    ) : (
                         <p className="text-sm text-gray-500 dark:text-slate-400">Nenhuma conversa encontrada.</p>
                    )}
                </div>
            </aside>
            
            {/* CONTEÚDO PRINCIPAL (CHAT E INPUT) */}
            <main className="flex-grow flex flex-col h-full relative">
                
                {/* HEADER COM SELETOR DE ESTACIONAMENTO E BOTÃO DE ARQUIVOS */}
                <div className="flex-shrink-0 p-4 bg-white border-b dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                         {mainTitle}
                    </h1>
                    <div className='flex items-center space-x-3'>
                        {isProprietarioMode && customHeader}
                        
                        <button 
                            onClick={() => setIsFilesOpen(!isFilesOpen)}
                            className={`p-2 rounded-lg transition-colors duration-150 ${isFilesOpen ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                            title="Arquivos Gerados"
                        >
                            {isFilesOpen ? <XMarkIcon className="w-6 h-6" /> : <FolderOpenIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Área de Mensagens (Onde o Scroll Acontece) */}
                <div className="flex-grow overflow-hidden">
                    {children} 
                </div>

            </main>

            {/* PAINEL DE ARQUIVOS (DIREITA - MODAL) */}
            <aside 
                className={`fixed right-0 top-0 w-64 h-full bg-white dark:bg-slate-800 border-l dark:border-slate-700 p-4 overflow-y-auto z-40 
                            transition-transform duration-300 ease-in-out 
                            ${isFilesOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}
            >
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg">Arquivos Gerados ({generatedFiles.length})</h3>
                    <button onClick={() => setIsFilesOpen(false)} className="text-gray-500 hover:text-red-500">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <ul className="space-y-2">
                    {generatedFiles.length > 0 ? generatedFiles.slice().reverse().map((file) => (
                        <li key={file.id}>
                            {file.type === 'chart' ? (
                                <button 
                                    onClick={() => { onFileClick(file.id); setIsFilesOpen(false); }}
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
                    )) : (
                        <p className="text-sm text-gray-500 dark:text-slate-400">Nenhum arquivo gerado nesta conversa.</p>
                    )}
                </ul>
            </aside>
            
            {/* Overlay para fechar os modais ao clicar fora (Mobile e Modal File/Chat) */}
            {(isChatsOpen && window.innerWidth < 1024) && <div className="fixed inset-0 bg-black/50 z-20" onClick={handleOutsideClick} />}
            {(isFilesOpen && window.innerWidth < 1024) && <div className="fixed inset-0 bg-black/50 z-30" onClick={handleOutsideClick} />}

        </div>
    );
};