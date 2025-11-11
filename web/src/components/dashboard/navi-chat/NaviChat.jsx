// src/components/NaviChat/NaviChat.js

"use client";
import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { ChartBarIcon, DocumentTextIcon, XMarkIcon, FolderOpenIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'; 
import { apiFetch } from '@/utils/api'; // <--- IMPORTAÇÃO DA FUNÇÃO CORRIGIDA (Ajuste o caminho se necessário)

// =================================================================
// 1. Componente para a animação de "pensamento"
// =================================================================
const ThinkingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-gray-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-gray-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-gray-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

// =================================================================
// 2. Componente Principal NaviChat (Inner - Lógica de Mensagens)
// =================================================================
const InnerNaviChat = forwardRef(({ 
    apiEndpoint, tagSuggestions, contextSelector, onFilesGenerated, conversaId, onSaveConversation,
    historico, setHistoricoExterno
}, ref) => {
    
    const [pergunta, setPergunta] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const chartRefs = useRef({}); 
    const context = contextSelector(); 

    useImperativeHandle(ref, () => ({ chartRefs: chartRefs.current }));
    
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [historico, scrollToBottom]);
    
    // Efeito para carregar histórico quando a conversaId muda
    useEffect(() => {
        if (conversaId === null) { setHistoricoExterno([]); return; }
        const loadHistorico = async () => {
             setLoading(true);
             try {
                // USANDO apiFetch
                const res = await apiFetch(`/api/conversas-navi/${conversaId}/historico`);
                if (!res.ok) throw new Error("Falha ao carregar histórico. (Verifique sua autenticação)");

                const loadedHistory = await res.json();
                setHistoricoExterno(loadedHistory);
             } catch (error) {
                console.error("Erro ao carregar histórico:", error);
                setHistoricoExterno([]); 
             } finally {
                 setLoading(false);
                 setTimeout(scrollToBottom, 0); 
             }
        };
        loadHistorico();
    }, [conversaId, setHistoricoExterno]);
    
    const setChartRef = useCallback((el, id) => {
        if (el) chartRefs.current[id] = el;
        else delete chartRefs.current[id];
    }, []);

    // Função para salvar o histórico
    const saveHistorico = useCallback(async (currentHistory) => {
        const context = contextSelector(); 

        const payload = {
            conversaId: conversaId,
            historico: currentHistory,
            titulo: currentHistory.length > 0 ? currentHistory[0].content.substring(0, 50) + '...' : "Nova Conversa",
            topico: context.id_estacionamento ? `ESTACIONAMENTO_${context.selectedEstacionamentoId}` : 'ADMIN_GLOBAL',
        };

        try {
            // USANDO apiFetch
            const res = await apiFetch('/api/conversas-navi/salvar', { 
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Falha ao salvar conversa. (Verifique sua autenticação)");
            
            const savedChat = await res.json();
            
            if (conversaId === null) {
                onSaveConversation(savedChat.id, savedChat.titulo);
            }

        } catch (error) {
            console.error("Falha ao salvar conversa:", error);
        }
    }, [conversaId, contextSelector, onSaveConversation]);


    const handleAsk = useCallback(async (questionOverride = null) => {
        const finalQuestion = questionOverride || pergunta.trim();
        const isProprietarioMode = !!context.id_estacionamento;
        const isEstacionamentoSelected = isProprietarioMode && context.selectedEstacionamentoId;
        
        if ((isProprietarioMode && !isEstacionamentoSelected) || !finalQuestion || loading) return;

        setLoading(true);
        setError(null);
        setPergunta(''); 

        const userMessage = { role: 'user', content: finalQuestion, id: `msg-${Date.now()}` };
        
        const newHistoryWithUserMsg = [...historico, userMessage];
        setHistoricoExterno(newHistoryWithUserMsg);
        setTimeout(scrollToBottom, 0); 

        const requestBody = {
          user_question: finalQuestion,
          history: historico.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] })),
          ...context, 
        };

        try {
            // USANDO apiFetch para a chamada da IA
            const res = await apiFetch(apiEndpoint, { 
                method: 'POST', 
                body: JSON.stringify(requestBody) 
            });
            
            let modelMessage;
            
            if (res.ok && res.headers.get('content-type')?.includes('application/')) {
                const blob = await res.blob();
                const fileName = res.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] || `documento_navi.bin`;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); window.URL.revokeObjectURL(url);
                onFilesGenerated({ type: 'document', title: fileName.replace(/\.[^/.]+$/, ""), id: `doc-${Date.now()}`, downloadLink: url }); 
                modelMessage = { role: 'model', content: `Documento "${fileName}" gerado e baixado com sucesso!`, type: 'text', id: `msg-doc-${Date.now()}` };
            } else if (res.ok) {
                const data = await res.json();
                modelMessage = { role: 'model', content: data.content || data.insightText || "Não consegui gerar uma resposta.", type: data.type, chartData: data.chartData, id: `msg-${Date.now()}` };
                if (modelMessage.type === 'chart') onFilesGenerated({ type: 'chart', title: (modelMessage.content || modelMessage.insightText).substring(0, 50) + '...', id: modelMessage.id }); 
            } else {
                const errData = await res.json().catch(() => ({ message: res.statusText || "Erro de rede/servidor." }));
                throw new Error(errData.message || res.statusText || "Erro desconhecido.");
            }
            
            const finalHistory = [...historico, userMessage, modelMessage];
            setHistoricoExterno(finalHistory);
            saveHistorico(finalHistory); 
            
        } catch (err) {
            setError(`Falha ao obter resposta: ${err.message}. Tente novamente.`);
            const finalHistory = [...historico, userMessage, { role: 'model', content: `ERRO: ${err.message}`, type: 'error', id: `err-${Date.now()}` }];
            setHistoricoExterno(finalHistory);
            saveHistorico(finalHistory); 
        } finally {
            setLoading(false);
            setTimeout(scrollToBottom, 0); 
        }
    }, [pergunta, loading, apiEndpoint, historico, context, scrollToBottom, onFilesGenerated, saveHistorico, setHistoricoExterno]);
    
    const handleTagClick = (tag) => { setPergunta(tag); handleAsk(tag); };

    const renderMessage = (msg, index) => {
        let containerClasses = 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-slate-100'; 
        if (msg.role === 'user') containerClasses = 'ml-auto bg-yellow-500 text-white dark:bg-slate-600 dark:text-white';
        else if (msg.type === 'error') containerClasses = 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';

        const refProps = msg.type === 'chart' ? { ref: (el) => setChartRef(el, msg.id) } : {};
        
        return (
            <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div {...refProps} className={`max-w-4xl p-4 rounded-xl shadow-md transition duration-300 ${containerClasses}`}>
                    <div className="text-base">
                        {msg.type === 'chart' ? (
                            <>
                                <p className="whitespace-pre-line">{msg.content}</p>
                                <div className='mt-3 p-2 bg-gray-100 dark:bg-slate-800 rounded-md text-sm text-gray-500 dark:text-slate-400'>
                                   <ChartBarIcon className="w-5 h-5 inline mr-2 text-yellow-500" />
                                   [Estrutura de dados para Chart.js gerada. Clique em "Ficheiros" para a lista.]
                                </div>
                            </>
                        ) : (
                            <p className="whitespace-pre-line">{msg.content}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    const isProprietarioMode = !!context.id_estacionamento;
    const isEstacionamentoSelected = isProprietarioMode && context.selectedEstacionamentoId;

    return (
        <div className={`flex flex-col h-full ${loading ? 'pointer-events-none opacity-90' : ''}`}>
            
            {/* ÁREA DE MENSAGENS E HISTÓRICO */}
            <div className={`flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900`}>
                
                {historico.length === 0 && !loading && (
                    <div className="flex justify-center items-center h-full text-gray-500 dark:text-slate-400">
                        <p>Inicie uma nova conversa ou selecione uma antiga.</p>
                    </div>
                )}
                
                {historico.map(renderMessage)}
                
                {loading && (
                    <div className="flex justify-start">
                        <div className="max-w-4xl p-4 rounded-xl bg-gray-200 dark:bg-slate-700">
                            <ThinkingDots />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-300">
                        Erro: {error}
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* ÁREA DE INPUT E SUGESTÕES */}
            <div className="p-4 border-t bg-white dark:bg-slate-800 dark:border-slate-700 flex-shrink-0">
                
                {/* Carrossel de Sugestões (Tags) */}
                <div className="flex space-x-2 pb-3 overflow-x-auto whitespace-nowrap">
                    {tagSuggestions.map(tag => (
                        <button 
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className="flex-shrink-0 px-3 py-1 text-sm rounded-full border border-gray-300 bg-gray-100 text-gray-600 
                                       hover:bg-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition duration-150"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                
                {/* Input e Botão */}
                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={pergunta}
                        onChange={(e) => setPergunta(e.target.value)}
                        placeholder="Pergunte ao Navi..."
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500
                                   dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        onKeyPress={(e) => { if (e.key === 'Enter' && !loading) handleAsk(); }}
                        disabled={loading || !pergunta.trim() || (isProprietarioMode && !isEstacionamentoSelected)}
                    />
                    <button
                        onClick={() => handleAsk()}
                        disabled={loading || !pergunta.trim() || (isProprietarioMode && !isEstacionamentoSelected)}
                        className="flex items-center justify-center w-12 h-12 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                                   disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
                    >
                        <ArrowUpCircleIcon className="w-7 h-7" />
                    </button>
                </div>
                {isProprietarioMode && !isEstacionamentoSelected && (
                    <p className="text-sm text-red-500 mt-2">Selecione um estacionamento acima para começar.</p>
                )}
            </div>
        </div>
    );
});


// =================================================================
// 3. Componentes de Layout e Wrapper (Exportados)
// =================================================================

const NaviChatWrapper = (props) => {
    const [generatedFiles, setGeneratedFiles] = useState([]);
    const [conversaId, setConversaId] = useState(null); 
    const [historico, setHistorico] = useState([]); 
    const chatRef = useRef(null);

    const handleNewChat = useCallback(() => {
        setConversaId(null); 
        setGeneratedFiles([]);
        setHistorico([]);
    }, []);
    
    const handleSelectChat = useCallback((id) => {
        setConversaId(id);
        setGeneratedFiles([]); 
        setHistorico([]);
    }, []);

    const handleSaveConversation = useCallback((newId, newTitle) => {
        setConversaId(newId); 
    }, []);

    const handleFileClick = useCallback((id) => {
        if (chatRef.current && chatRef.current.chartRefs) {
            const element = chatRef.current.chartRefs[id];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('bg-yellow-100/50', 'ring-2', 'ring-yellow-500');
                setTimeout(() => element.classList.remove('bg-yellow-100/50', 'ring-2', 'ring-yellow-500'), 1500);
            }
        }
    }, []);
    
    const handleFilesGenerated = useCallback((fileInfo) => {
        setGeneratedFiles(prev => [...prev, fileInfo]);
    }, []);

    // Geração de título para o Layout
    const context = props.contextSelector();
    const isProprietarioMode = !!context.id_estacionamento;
    const currentEstacionamento = context.estacionamentos?.find(e => e.id === parseInt(context.selectedEstacionamentoId));
    const title = isProprietarioMode && currentEstacionamento ? `Análise de ${currentEstacionamento.nome}` : 'Navi IA - Assistente Global';


    return (
        <NaviLayout 
            mainTitle={title}
            customHeader={props.customHeader}
            generatedFiles={generatedFiles}
            onFileClick={handleFileClick}
            isProprietarioMode={isProprietarioMode}
            conversaId={conversaId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
        >
            <InnerNaviChat 
                {...props} 
                ref={chatRef} 
                conversaId={conversaId} 
                historico={historico} 
                setHistoricoExterno={setHistorico} 
                onFilesGenerated={handleFilesGenerated}
                onSaveConversation={handleSaveConversation}
            />
        </NaviLayout>
    );
};

// Exportamos o wrapper (como default)
export default NaviChatWrapper;

// =================================================================
// 4. Componente de Layout (Modal e Responsividade)
// =================================================================
export const NaviLayout = ({ children, customHeader, generatedFiles, onFileClick, mainTitle, isProprietarioMode, conversaId, onNewChat, onSelectChat }) => {
    
    const [isChatsOpen, setIsChatsOpen] = useState(true);
    const [isFilesOpen, setIsFilesOpen] = useState(false);
    const [userChats, setUserChats] = useState([]);
    const [isMounted, setIsMounted] = useState(false); // Para resolver o erro de SSR

    // Efeito de montagem para resolver o erro SSR (window is not defined)
    useEffect(() => {
        setIsMounted(true);
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsChatsOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Efeito para buscar as conversas do usuário
    const fetchChats = useCallback(async () => {
        try {
            // USANDO apiFetch
            const res = await apiFetch('/api/conversas-navi'); 
            if (!res.ok) throw new Error("Falha ao carregar conversas.");

            const chats = await res.json();
            setUserChats(chats);
            
            if (chats.length > 0 && conversaId === null) {
                onSelectChat(chats[0].id); 
            }
        } catch (error) {
            console.error("Erro ao buscar histórico de chats:", error);
        }
    }, [conversaId, onSelectChat]);
    
    // Recarregar chats sempre que a lista deve ser atualizada (nova conversa, etc.)
    useEffect(() => {
        if (isMounted) fetchChats();
    }, [fetchChats, conversaId, isMounted]);

    // Função para fechar ambos os modais ao clicar fora em mobile
    const handleOutsideClick = (e) => {
        if (isMounted && window.innerWidth < 1024) { 
            if (isChatsOpen) setIsChatsOpen(false);
            if (isFilesOpen) setIsFilesOpen(false);
        }
    };

    if (!isMounted) {
         return (
             <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 overflow-hidden">
                <main className="flex-grow flex flex-col h-full relative">
                    <div className="flex-grow overflow-hidden">{children}</div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 overflow-hidden">

            {/* PAINEL DE CONVERSAS (ESQUERDA - MODAL/DRAWER) */}
            <aside 
                className={`flex-shrink-0 w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-4 
                            transition-transform duration-300 ease-in-out lg:static fixed h-full z-30 
                            ${isChatsOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
                onClick={(e) => e.stopPropagation()}
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
                <div className="flex-shrink-0 p-4 bg-white dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center">
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

                {/* Área de Mensagens (Onde o Scroll Acontece) - children é o InnerNaviChat */}
                <div className="flex-grow overflow-hidden">
                    {children} 
                </div>

            </main>

            {/* PAINEL DE ARQUIVOS (DIREITA - MODAL/DRAWER) */}
            <aside 
                className={`fixed right-0 top-0 w-64 h-full bg-white dark:bg-slate-800 border-l dark:border-slate-700 p-4 overflow-y-auto z-40 
                            transition-transform duration-300 ease-in-out 
                            ${isFilesOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg">Arquivos Gerados ({generatedFiles.length})</h3>
                    <button onClick={() => setIsFilesOpen(false)} className="text-gray-500 hover:text-red-500 lg:hidden">
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
            {(isChatsOpen || isFilesOpen) && window.innerWidth < 1024 && <div className="fixed inset-0 bg-black/50 z-20" onClick={handleOutsideClick} />}

            {/* BOTÃO DE ABRIR CHATS (Mobile) - Fica no topo da main, mas é float */}
            <button 
                onClick={() => setIsChatsOpen(true)}
                className={`fixed top-4 left-4 z-20 p-2 rounded-full shadow-lg bg-yellow-500 hover:bg-yellow-600 text-white lg:hidden`}
            >
                <ChatBubbleLeftIcon className="w-6 h-6" />
            </button>
        </div>
    );
};