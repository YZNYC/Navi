// src/components/dashboard/navi-chat/NaviChat.js

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
// Ícones
import { 
    PaperAirplaneIcon, 
    ChatBubbleLeftRightIcon, 
    FolderOpenIcon, 
    XMarkIcon,
    DocumentTextIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

// API e Contexto
import api from '@/lib/api'; 
import { useAuth } from '@/contexts/AuthContext'; 
import ReactMarkdown from 'react-markdown'; // OBRIGATÓRIO

// =================================================================
// 1. SUB-COMPONENTES VISUAIS (UI KIT)
// =================================================================

const ThinkingDots = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

// Componente para injetar classes no <p> do ReactMarkdown
const MarkdownRenderer = ({ content, isChart = false }) => {
    const components = {
        p: ({ node, ...props }) => (
            // Aplica a classe de quebra de linha ao parágrafo (solução para o erro 60)
            <p className="whitespace-pre-wrap" {...props} />
        ),
    };

    return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
};


const ChatMessageItem = ({ msg, isUser, messageRef }) => {
    // Conteúdo da IA está em parts[0].text
    const content = msg.parts?.[0]?.text || msg.content || ""; 
    
    return (
        <div ref={messageRef} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div 
                className={`
                    max-w-[85%] px-5 py-3 text-sm leading-relaxed shadow-sm
                    ${isUser 
                        ? "bg-white text-slate-800 rounded-2xl rounded-br-none border border-slate-100" 
                        : "bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100"
                    }
                `}
            >
                {/* Renderização condicional para gráficos ou texto */}
                {msg.chartData ? (
                     <div className="p-2">
                        <p className="font-semibold text-xs text-slate-400 mb-2 uppercase tracking-wider">Gráfico Gerado</p>
                        {/* Renderiza o texto de insight do gráfico como Markdown */}
                        <MarkdownRenderer content={content} isChart={true} />
                        <div className="bg-slate-50 rounded p-4 border text-center text-xs text-slate-400">
                            [Visualização do Gráfico: {msg.chartData.type}]
                        </div>
                     </div>
                ) : (
                    // Renderiza o texto normal como Markdown para formatação
                    <MarkdownRenderer content={content} />
                )}
            </div>
        </div>
    );
};

// =================================================================
// 2. COMPONENTE PRINCIPAL
// =================================================================
export default function NaviChat({ 
    id_estacionamento_selecionado, 
    tagSuggestions = [], 
}) {
    const { user, isLoading: authLoading } = useAuth(); 
    
    // Estados de UI
    const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false); 
    const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);

    // Estados de Dados
    const [conversas, setConversas] = useState([]);
    const [activeConversaId, setActiveConversaId] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedFiles, setGeneratedFiles] = useState([]); 

    // Refs
    const messagesEndRef = useRef(null);
    const messageRefs = useRef({}); 
    
    const isSessionReady = !authLoading && !!user;
    const effectiveRole = user?.papel;

    // 1. Buscar Lista de Conversas (GET)
    const fetchConversas = useCallback(async () => {
        if (!user) return; 
        try {
            const response = await api.get('/api/conversas-navi');
            const data = response.data;
            setConversas(Array.isArray(data) ? data.sort((a, b) => new Date(b.data_atualizacao) - new Date(a.data_atualizacao)) : []);
        } catch (err) {
            console.warn("NaviChat: Erro ao listar conversas (verifique se a rota existe).", err);
        }
    }, [user]);

    useEffect(() => { if (isSessionReady) fetchConversas(); }, [fetchConversas, isSessionReady]);

    // 2. Carregar Histórico (GET)
    useEffect(() => {
        if (!activeConversaId || !user) { setHistorico([]); return; }

        setIsLoading(true);
        api.get(`/api/conversas-navi/${activeConversaId}/historico`)
            .then(response => {
                const data = response.data;
                setHistorico(Array.isArray(data) ? data : []);
            })
            .catch(err => { console.error("Erro ao carregar histórico:", err); })
            .finally(() => setIsLoading(false));
    }, [activeConversaId, user]);

    // Scroll automático
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [historico, isLoading]);

    // 3. Salvar Conversa (POST)
    const saveConversation = async (finalHistory, conversaId) => {
        try {
            const payload = {
                conversaId: conversaId,
                historico: finalHistory,
                id_estacionamento: effectiveRole !== 'ADMINISTRADOR' && id_estacionamento_selecionado 
                    ? Number(id_estacionamento_selecionado) 
                    : null
            };

            const response = await api.post('/api/conversas-navi/salvar', payload);
            const savedChat = response.data;

            if (!conversaId && savedChat?.id_conversa) {
                setActiveConversaId(savedChat.id_conversa);
                fetchConversas();
            }
        } catch (err) {
            console.error("ERRO CRÍTICO AO SALVAR CONVERSA:", err.response?.status, err.response?.data || err.message);
        }
    };

    // 4. Enviar Pergunta (Submit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !isSessionReady) return;
        
        let endpoint = '';
        let body = {};

        if (effectiveRole === 'ADMINISTRADOR') {
            endpoint = `/api/navi/admin/ask`;
            body = { user_question: userInput, history: historico };
        } else {
            if (!id_estacionamento_selecionado) { setError('Selecione um estacionamento.'); return; }
            endpoint = `/api/navi/proprietario/ask`;
            body = { id_estacionamento: Number(id_estacionamento_selecionado), user_question: userInput, history: historico };
        }

        const newUserMessage = { role: 'user', parts: [{ text: userInput }] };
        const tempHistorico = [...historico, newUserMessage];
        
        setHistorico(tempHistorico);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post(endpoint, body);
            const iaResponse = response.data;
            
            let newAiMessage = {
                role: 'model',
                parts: [{ text: iaResponse.type === 'chart' ? iaResponse.insightText : iaResponse.content }],
                chartData: iaResponse.type === 'chart' ? iaResponse.chartData : null,
            };

            if (iaResponse.type === 'chart' || iaResponse.type === 'document') {
                setGeneratedFiles(prev => [...prev, { 
                    id: Date.now(), 
                    type: iaResponse.type, 
                    title: iaResponse.insightText?.substring(0, 20) + '...' || "Novo Arquivo"
                }]);
            }

            const finalHistorico = [...tempHistorico, newAiMessage];
            setHistorico(finalHistorico);

            await saveConversation(finalHistorico, activeConversaId);

        } catch (err) {
            console.error("Erro na requisição da IA:", err);
            const msg = err.response?.data?.error || err.message || 'Não foi possível conectar ao Navi.';
            setError(msg);
            setHistorico(prev => prev.slice(0, -1)); 
        } finally {
            setIsLoading(false);
        }
    };

    // === HANDLERS DE UI ===

    const toggleChatDrawer = () => {
        setIsChatDrawerOpen(!isChatDrawerOpen);
        if (isFilesDrawerOpen) setIsFilesDrawerOpen(false);
    };

    const toggleFilesDrawer = () => {
        setIsFilesDrawerOpen(!isFilesDrawerOpen);
        if (isChatDrawerOpen) setIsChatDrawerOpen(false);
    };

    const closeAllDrawers = () => {
        setIsChatDrawerOpen(false);
        setIsFilesDrawerOpen(false);
    };

    const handleNewChat = () => {
        setActiveConversaId(null);
        setHistorico([]);
        setGeneratedFiles([]);
        setUserInput('');
        closeAllDrawers();
    };

    const handleSelectChat = (id) => {
        if (id !== activeConversaId) {
            setActiveConversaId(id);
        }
        closeAllDrawers();
    };

    const scrollToMessage = (index) => {
        const ref = messageRefs.current[index];
        if (ref && ref.scrollIntoView) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        closeAllDrawers();
    };

    // =================================================================
    // RENDERIZAÇÃO
    // =================================================================
    return (
        <div className="relative w-full h-screen bg-[#F3F4F6] overflow-hidden font-sans text-slate-600">
            
            {/* --- 1. HEADER (NAVBAR) --- */}
            <header className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-40 bg-transparent pointer-events-none">
                <button 
                    onClick={toggleChatDrawer}
                    className="pointer-events-auto p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-slate-700"
                >
                    {isChatDrawerOpen ? <XMarkIcon className="w-6 h-6" /> : <ChatBubbleLeftRightIcon className="w-6 h-6" />}
                </button>

                <div className="font-bold text-slate-400 text-xs tracking-widest uppercase pointer-events-auto">
                   NAVI IA
                </div>

                <button 
                    onClick={toggleFilesDrawer}
                    className="pointer-events-auto p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-slate-700"
                >
                    {isFilesDrawerOpen ? <XMarkIcon className="w-6 h-6" /> : <FolderOpenIcon className="w-6 h-6" />}
                </button>
            </header>

            {/* --- 2. BACKDROP (BLUR) --- */}
            {(isChatDrawerOpen || isFilesDrawerOpen) && (
                <div 
                    className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={closeAllDrawers}
                />
            )}

            {/* --- 3. LEFT DRAWER (CONVERSAS) --- */}
            <aside 
                className={`
                    absolute top-4 bottom-4 left-4 w-80 bg-white rounded-3xl shadow-2xl z-50
                    flex flex-col overflow-hidden transition-transform duration-300 ease-in-out
                    ${isChatDrawerOpen ? 'translate-x-0' : '-translate-x-[120%]'}
                `}
                onClick={e => e.stopPropagation()} 
            >
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800">Conversas</h2>
                    <button onClick={handleNewChat} className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm shadow-yellow-200">
                        + Novo Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {conversas.length === 0 && <p className="text-center text-xs text-slate-400 mt-10">Nenhuma conversa anterior.</p>}
                    {conversas.map((chat) => (
                        <button 
                            key={chat.id_conversa}
                            onClick={() => handleSelectChat(chat.id_conversa)}
                            className={`
                                w-full text-left p-4 rounded-2xl transition-all duration-200 border
                                ${activeConversaId === chat.id_conversa 
                                    ? 'bg-slate-50 border-slate-200 shadow-inner' 
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}
                            `}
                        >
                            <div className="font-medium text-sm text-slate-700 truncate">{chat.titulo || 'Sem título'}</div>
                            <div className="text-xs text-slate-400 mt-1">
                                {chat.data_atualizacao ? new Date(chat.data_atualizacao).toLocaleDateString() : 'Recentemente'}
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* --- 4. RIGHT DRAWER (ARQUIVOS) --- */}
            <aside 
                className={`
                    absolute top-4 bottom-4 right-4 w-80 bg-white rounded-3xl shadow-2xl z-50
                    flex flex-col overflow-hidden transition-transform duration-300 ease-in-out
                    ${isFilesDrawerOpen ? 'translate-x-0' : 'translate-x-[120%]'}
                `}
                onClick={e => e.stopPropagation()} 
            >
                <div className="p-6 border-b border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800">Arquivos</h2>
                    <p className="text-xs text-slate-400">Gerados na sessão atual</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {generatedFiles.length === 0 && <p className="text-center text-xs text-slate-400 mt-10">Nenhum arquivo gerado.</p>}
                    {generatedFiles.map((file, index) => (
                        <button 
                            key={file.id} 
                            onClick={() => scrollToMessage(index)} 
                            className="flex w-full items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors text-left"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${file.type === 'chart' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500'}`}>
                                {file.type === 'chart' ? <ChartBarIcon className="w-5 h-5" /> : <DocumentTextIcon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">{file.title}</p>
                                <p className="text-xs text-slate-400 uppercase">{file.type}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* --- 5. MAIN CHAT AREA (CENTER) --- */}
            <main className="flex flex-col h-full w-full max-w-4xl mx-auto pt-20 pb-6 px-4">
                
                {/* Área de Scroll das Mensagens */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
                    {historico.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-60">
                            <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-4 animate-pulse"></div>
                            <h3 className="text-lg font-medium text-slate-400">Como posso ajudar hoje?</h3>
                        </div>
                    ) : (
                        <div className="py-4">
                            {historico.map((msg, idx) => (
                                <ChatMessageItem 
                                    key={idx} 
                                    msg={msg} 
                                    isUser={msg.role === 'user'}
                                    messageRef={el => messageRefs.current[idx] = el}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                     <div className="bg-white rounded-2xl rounded-tl-none shadow-sm px-4 py-2">
                                        <ThinkingDots />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Footer Flutuante (Input e Sugestões) */}
                <div className="flex-shrink-0 mt-4">
                    {error && <div className="text-xs text-red-500 text-center mb-2">{error}</div>}

                    {/* Sugestões (Tags) */}
                    {historico.length === 0 && tagSuggestions.length > 0 && (
                        <div className="flex justify-center gap-2 mb-4 overflow-x-auto pb-2">
                            {tagSuggestions.map((tag, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setUserInput(tag)}
                                    className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Bar */}
                    <form 
                        onSubmit={handleSubmit} 
                        className="relative flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-slate-100 p-2 pl-6"
                    >
                        <input
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={!isSessionReady ? "Conectando..." : "O que você gostaria de saber hoje?"}
                            disabled={isLoading || !isSessionReady}
                            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading || !userInput.trim() || !isSessionReady} 
                            className="p-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 disabled:opacity-50 disabled:hover:bg-yellow-400 transition-all duration-200 shadow-md shadow-yellow-200"
                        >
                            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 translate-x-[2px] -translate-y-[1px]" />
                        </button>
                    </form>
                    
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-slate-400">O Navi pode cometer erros. Verifique informações importantes.</p>
                    </div>
                </div>

            </main>

        </div>
    );
}