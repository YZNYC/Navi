// components/dashboard/navi-chat/NaviChat.js
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext'; 

// ... (Imports e componentes auxiliares idênticos: ChartJS, Icons, ChatMessageItem, Modal, etc.)
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
ChartJS.register(...registerables);
const MenuIcon = ({ className = 'w-5 h-5' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /> </svg> );
const PaperAirplaneIcon = ({ className = 'w-5 h-5' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /> </svg> );
const PencilIcon = ({ className = 'w-4 h-4' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /> </svg> );
const FileIcon = ({ className = 'w-4 h-4' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3h6l5.25 5.25V21a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V3.75A.75.75 0 0 1 6 3h1.5z" /> </svg> );
const ChatBubbleIcon = ({ className = 'w-5 h-5' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.64 9.64 0 0 1-3.5-.7L3 20l1.1-3.5A7.97 7.97 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> );
const DownloadIcon = ({ className = 'w-4 h-4' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg> );
const ChatMessageItem = ({ msg, chartIndex }) => { /* ...código idêntico... */ };
function Modal({ open, onClose, title, children }) { /* ...código idêntico... */ };
function FilesModal({ open, onClose, files, onSelectFile }) { /* ...código idêntico... */ };


// === COMPONENTE PRINCIPAL ===
export default function NaviChat({ 
    id_estacionamento_selecionado, 
    // [CORREÇÃO] A prop 'userRole' foi removida das props
    apiEndpoint, 
    tagSuggestions, 
    contextSelector,
    customHeader 
}) {
  // [CORREÇÃO] Agora 'user' e 'token' são as únicas fontes da verdade
  const { user, token } = useAuth(); 
  
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [conversas, setConversas] = useState([]);
  const [activeConversaId, setActiveConversaId] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filesModalOpen, setFilesModalOpen] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messageRefs = useRef([]);

  const API_BASE_URL = 'http://127.0.0.1:3000';

  // [CORREÇÃO] Lógica de carregamento e papéis
  // 'effectiveRole' agora depende 100% do hook.
  const effectiveRole = user?.papel; 
  // 'isSessionReady' só é verdadeiro se AMBOS (token e usuário) estiverem carregados.
  const isSessionReady = token && effectiveRole;

  // ... (Funções fetchConversas, useEffects, handleNewChat idênticas...)
  const fetchConversas = useCallback(async () => {
    if (!token) return; 
    try {
      const res = await fetch(`${API_BASE_URL}/api/conversas-navi/`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Falha ao buscar conversas');
      const data = await res.json();
      setConversas(Array.isArray(data) ? data : []);
    } catch {
      setError('Falha ao carregar suas conversas.');
    }
  }, [token]);

  useEffect(() => {
    fetchConversas();
  }, [fetchConversas]);

  useEffect(() => {
    if (!activeConversaId || !token) {
        setHistorico([]);
        return;
    }
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/conversas-navi/${activeConversaId}/historico`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
          if (!res.ok) throw new Error('Falha ao carregar histórico');
          return res.json();
      })
      .then(data => setHistorico(Array.isArray(data) ? data : []))
      .catch(() => setError('Falha ao carregar histórico.'))
      .finally(() => setIsLoading(false));
  }, [activeConversaId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historico, isLoading]);

  const handleNewChat = () => {
    setActiveConversaId(null);
    setHistorico([]);
    setUserInput('');
    setIsChatSidebarOpen(false); 
  };

  // === ENVIAR PERGUNTA (LÓGICA CORRIGIDA) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // [CORREÇÃO] A verificação agora é no 'isSessionReady'
    if (!userInput.trim() || isLoading || !isSessionReady) {
        if (!isSessionReady) {
            setError("Sessão ainda não iniciada. Verifique se está logado.");
        }
        return;
    }
    
    // 'effectiveRole' já foi definido acima, vindo 100% do hook useAuth
    let endpoint = '';
    let body = {};

    // [CORREÇÃO] Esta lógica agora é segura, pois 'effectiveRole' é confiável
    if (effectiveRole === 'ADMINISTRADOR') {
        endpoint = `${API_BASE_URL}/api/navi/admin/ask`;
        body = {
            user_question: userInput,
            history: historico
        };
    } else if (effectiveRole === 'PROPRIETARIO' || effectiveRole === 'GESTOR') {
        if (!id_estacionamento_selecionado) {
            setError('Por favor, selecione um estacionamento para analisar.');
            return;
        }
        endpoint = `${API_BASE_URL}/api/navi/proprietario/ask`;
        body = {
            id_estacionamento: Number(id_estacionamento_selecionado),
            user_question: userInput,
            history: historico 
        };
    } else {
        // Se o papel do token não for nenhum desses, ele será barrado aqui.
        console.error(`Papel não autorizado detectado: ${effectiveRole}`);
        setError('Erro: Seu papel de usuário não tem permissão para usar esta IA.');
        return;
    }

    const newUserMessage = { role: 'user', parts: [{ text: userInput }] };
    const newHistorico = [...historico, newUserMessage];
    setHistorico(newHistorico);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      // 'token' está garantido pelo 'isSessionReady'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body),
      });

      // Se o backend retornar 401 ou 403, ele será pego aqui
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        // O erro 'Acesso negado' vem do seu NaviController, o 401/403 vem dos middlewares
        throw new Error(errorData?.error || errorData?.message || `Erro do servidor: ${response.status}`);
      }

      const iaResponse = await response.json();

      const newAiMessage = {
        role: 'model',
        parts: [{ text: iaResponse.type === 'chart' ? iaResponse.insightText : iaResponse.content }],
        chartData: iaResponse.type === 'chart' ? iaResponse.chartData : null,
        content: iaResponse 
      };
      const finalHistorico = [...newHistorico, newAiMessage];
      setHistorico(finalHistorico);

      // 3. SALVA A CONVERSA NO BACKEND
      const saveResponse = await fetch(`${API_BASE_URL}/api/conversas-navi/salvar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            conversaId: activeConversaId, 
            historico: finalHistorico,
            id_estacionamento: effectiveRole !== 'ADMINISTRADOR' ? id_estacionamento_selecionado : null 
        }),
      });
      
      const saveResult = await saveResponse.json();

      // 4. ATUALIZA A UI COM OS DADOS DA NOVA CONVERSA
      if (!activeConversaId && saveResult?.id_conversa) {
        setActiveConversaId(saveResult.id_conversa);
        setConversas(prev => [
            { id_conversa: saveResult.id_conversa, titulo: saveResult.titulo, data_atualizacao: new Date() }, 
            ...prev
        ]);
      } else {
        setConversas(prev => [
            prev.find(c => c.id_conversa === activeConversaId),
            ...prev.filter(c => c.id_conversa !== activeConversaId)
        ].filter(Boolean)); 
      }

    } catch (err) {
      console.error("Erro ao consultar a IA:", err);
      setError(err?.message || 'Erro ao consultar a IA'); // Exibe o erro 401/403 aqui
      setHistorico(newHistorico.slice(0, -1)); 
    } finally {
      setIsLoading(false);
    }
  };

  // === ATUALIZAR TÍTULO ===
  const handleEditTitle = async (conversaId) => {
    const conversa = conversas.find(c => c.id_conversa === conversaId);
    if (!conversa) return;
    const novoTitulo = prompt("Editar título da conversa:", conversa.titulo);
    if (novoTitulo && novoTitulo.trim() !== conversa.titulo) {
        try {
            // [CORREÇÃO] Verificação de segurança
            if (!isSessionReady) {
                setError("Sessão não está pronta.");
                return;
            }
            await fetch(`${API_BASE_URL}/api/conversas-navi/${conversaId}/titulo`, {
                method: 'PATCH',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ titulo: novoTitulo.trim() })
            });
            setConversas(prev => 
                prev.map(c => 
                    c.id_conversa === conversaId ? { ...c, titulo: novoTitulo.trim() } : c
                )
            );
        } catch (err) {
            setError(err?.message || "Falha ao atualizar o título.");
        }
    }
  };

  // ... (handleOpenFiles, scrollToMessageIndex idênticos...)
  const handleOpenFiles = () => {
    setFilesModalOpen(true);
  };
  const scrollToMessageIndex = (index) => {
    const ref = messageRefs.current[index];
    if (ref && ref.scrollIntoView) ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  // [REMOVIDO] effectiveRole movido para o topo do componente

  return (
    // ... (JSX do 'div' principal e sidebar idêntico...)
    <div className="relative flex w-full h-screen bg-slate-50 text-slate-700 overflow-hidden">
      <button 
        onClick={() => setIsChatSidebarOpen(true)} 
        className="absolute top-4 left-4 z-20 lg:hidden p-2 text-slate-600"
      >
        <MenuIcon />
      </button>
      {isChatSidebarOpen && (
        <div 
            className="fixed inset-0 z-20 bg-black/30 lg:hidden"
            onClick={() => setIsChatSidebarOpen(false)}
        ></div>
      )}
      <div className="hidden lg:flex flex-col items-center gap-4 p-4 border-r border-orange-400/20 bg-white min-w-[68px]">
        <div className="mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 flex items-center justify-center text-white font-bold">N</div>
        </div>
        <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"><ChatBubbleIcon /></button>
        <button onClick={handleOpenFiles} className="p-2 rounded-lg hover:bg-slate-100"><FileIcon /></button>
      </div>
      <aside className={`absolute lg:relative inset-y-0 left-0 z-30 bg-white transition-transform ${isChatSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-80 flex flex-col border-r border-slate-200`}>
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center text-orange-600 font-semibold">IA</div>
            <h3 className="text-sm font-semibold">Conversas</h3>
          </div>
          <button onClick={handleNewChat} className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-xs hover:bg-orange-600">+ Novo</button>
        </div>
        <div className="p-3 overflow-auto flex-1 space-y-2">
          {conversas.map(c => (
            <div key={c.id_conversa}
                 className={`group flex items-center justify-between gap-2 p-2 rounded-md ${activeConversaId === c.id_conversa ? 'bg-slate-100' : 'hover:bg-slate-50 cursor-pointer'}`}>
              <div className="flex items-center gap-3 truncate" onClick={() => setActiveConversaId(c.id_conversa)}>
                <div className="w-9 h-9 rounded-md bg-white border flex items-center justify-center text-slate-700">💬</div>
                <div className="truncate">
                  <div className="text-sm font-medium truncate">{c.titulo || 'Sem título'}</div>
                  <div className="text-xs text-slate-400 truncate">{c.data_atualizacao ? new Date(c.data_atualizacao).toLocaleString() : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEditTitle(c.id_conversa)} className="p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-opacity">
                    <PencilIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        {/* O seletor de estacionamento agora usa 'effectiveRole' que vem do hook */}
        {(effectiveRole === 'PROPRIETARIO' || effectiveRole === 'GESTOR') && (
            <div className="p-4 border-b border-slate-200 bg-white">
                <label htmlFor="parking-select" className="text-sm font-medium text-slate-700 mr-2">
                    Analisando Estacionamento:
                </label>
                <select
                    id="parking-select"
                    value={id_estacionamento_selecionado}
                    disabled={true} 
                    className="rounded-md border-slate-300 focus:ring-orange-400 focus:border-orange-400 text-sm"
                >
                    <option value={id_estacionamento_selecionado}>Estacionamento ID: {id_estacionamento_selecionado}</option>
                </select>
            </div>
        )}
        
        {/* ... (JSX de 'historico.length === 0' e 'historico.map' idêntico) ... */}
        <div className="flex-1 overflow-y-auto p-6">
          {historico.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <h2 className="text-2xl font-semibold">Navi IA</h2>
              <p className="text-sm mt-2">
                        {/* [CORREÇÃO] Mensagem de UX para o carregamento */}
                        {!isSessionReady ? "Conectando ao Navi..." : "Faça uma pergunta para começar"}
                    </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {historico.map((msg, idx) => (
                <ChatMessageItem 
                  key={idx} 
                  msg={msg} 
                  chartIndex={idx}
                />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="rounded-xl p-3 bg-white border border-slate-200">
                    <div className="flex gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-150" />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <footer className="p-4 bg-white border-t">
          {error && <div className="text-xs text-red-600 text-center mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              // [CORREÇÃO] UX - Desabilita o input e muda o placeholder
              disabled={isLoading || !isSessionReady}
              placeholder={!isSessionReady ? "Autenticando..." : "Pergunte algo para a Navi..."}
              className="flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none text-sm"
            />
            <button 
              type="submit" 
              // [CORREÇÃO] UX - Desabilita o botão
              disabled={isLoading || !userInput.trim() || !isSessionReady} 
              className="p-3 rounded-xl bg-orange-500 text-white disabled:opacity-50"
            >
              <PaperAirplaneIcon />
            </button>
          </form>
        </footer>
      </main>
      <FilesModal 
        open={filesModalOpen} 
        onClose={() => setFilesModalOpen(false)}_
        files={historico} 
        onSelectFile={scrollToMessageIndex} 
      />
    </div>
  );
}