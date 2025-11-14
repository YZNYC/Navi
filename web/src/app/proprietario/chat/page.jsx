'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { socket } from '../../../lib/socket';
import { Loader2, Send, CornerDownLeft } from 'lucide-react';
import toast from 'react-hot-toast';

// -----------------------------------------------------------------------------
// COMPONENTES DE UI
// -----------------------------------------------------------------------------
const Avatar = ({ user }) => {
    if (user?.url_foto_perfil) {
        return <img src={user.url_foto_perfil} alt={user.nome} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />;
    }
    const iniciais = user?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
    return (
        <div className="w-10 h-10 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
            {iniciais}
        </div>
    );
};

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA PÁGINA
// -----------------------------------------------------------------------------
export default function ChatPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchChats = useCallback(async () => {
        try {
            setIsLoadingChats(true);
            const response = await api.get('/chat');
            setChats(response.data);
        } catch {
            toast.error("Erro ao carregar suas conversas.");
        } finally {
            setIsLoadingChats(false);
        }
    }, []);
    
    useEffect(() => {
        if (!isAuthLoading && user) fetchChats();
    }, [isAuthLoading, user, fetchChats]);

    const handleSelectChat = useCallback(async (chat) => {
        if (selectedChat?.id === chat.id) return;
        setSelectedChat(chat);
        setIsLoadingMessages(true);
        setMessages([]);
        try {
            const response = await api.get(`/chat/${chat.id}/mensagens`);
            setMessages(response.data);
        } catch {
            toast.error("Erro ao carregar mensagens.");
        } finally {
            setIsLoadingMessages(false);
        }
    }, [selectedChat?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if (!user) return;
        socket.connect();
        
        function onNewMessage(mensagemRecebida) {
            setSelectedChat(currentChat => {
                if (currentChat && currentChat.id === mensagemRecebida.id_chat) {
                    setMessages(prevMessages => {
                        const optimisticIndex = prevMessages.findIndex(msg => msg.id.toString().startsWith('temp-') && msg.conteudo === mensagemRecebida.conteudo);
                        if (optimisticIndex !== -1) {
                            const newMessages = [...prevMessages];
                            newMessages[optimisticIndex] = mensagemRecebida;
                            return newMessages;
                        }
                        return [...prevMessages, mensagemRecebida];
                    });
                }
                return currentChat;
            });
        }
        
        socket.on('receber-mensagem', onNewMessage);
        return () => {
            socket.off('receber-mensagem', onNewMessage);
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (selectedChat?.id) {
            socket.emit('entrar-na-sala', selectedChat.id.toString());
        }
    }, [selectedChat?.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedChat) return;

        const optimisticId = 'temp-' + Date.now();
        const optimisticMessage = { 
            id: optimisticId,
            id_remetente: user.id_usuario,
            conteudo: newMessage,
            data_envio: new Date().toISOString(),
            usuario: { ...user }
        };

        setMessages(prev => [...prev, optimisticMessage]);
        const currentMessage = newMessage;
        setNewMessage('');
        
        try {
            const response = await api.post(`/chat/${selectedChat.id}/mensagens`, { conteudo: currentMessage });
            const savedMessage = response.data;
            setMessages(prev => prev.map(msg => msg.id === optimisticId ? savedMessage : msg));
        } catch {
            toast.error("Falha ao enviar mensagem.");
            setMessages(prev => prev.filter(m => m.id !== optimisticId));
        }
    };
    // Continuação do componente ChatPage...

    if (isAuthLoading) {
        return <div className="p-8 w-full h-screen flex justify-center items-center"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;
    }
    
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 flex h-screen overflow-hidden">
            <aside className="w-full sm:w-1/3 max-w-sm border-r dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b dark:border-slate-700">
                    <h1 className="text-xl font-bold dark:text-white">Conversas</h1>
                </div>
                {isLoadingChats ? (
                     <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-amber-500" /></div>
                ) : (
                <ul className="flex-1 overflow-y-auto">
                    {chats.length > 0 ? chats.map(chat => {
                        const otherParticipant = chat.chatparticipante.find(p => p.id_usuario !== user?.id_usuario)?.usuario;
                        const lastMessage = chat.mensagem[0];
                        if (!otherParticipant) return null; // Não renderiza chat consigo mesmo

                        return (
                            <li key={chat.id}>
                                <button onClick={() => handleSelectChat(chat)} className={`w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-4 ${selectedChat?.id === chat.id ? 'bg-amber-100/50 dark:bg-amber-900/30' : ''}`}>
                                    <Avatar user={otherParticipant} />
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-semibold dark:text-white truncate">{otherParticipant?.nome || 'Chat Desconhecido'}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lastMessage?.conteudo || 'Nenhuma mensagem'}</p>
                                    </div>
                                </button>
                            </li>
                        );
                    }) : (
                        <div className="p-4 text-center text-sm text-gray-500">Nenhuma conversa encontrada.</div>
                    )}
                </ul>
                )}
            </aside>

            <section className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900/50">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b dark:border-slate-700 flex items-center gap-3 bg-white dark:bg-slate-800 shadow-sm">
                            <h2 className="font-bold text-lg dark:text-white">{selectedChat.chatparticipante.find(p => p.id_usuario !== user?.id_usuario)?.usuario.nome}</h2>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto">
                            {isLoadingMessages ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-amber-500"/></div> :
                            messages.map((msg, index) => (
                                <div key={msg.id || index} className={`flex my-2 items-end gap-3 ${msg.id_remetente === user?.id_usuario ? 'justify-end' : 'justify-start'}`}>
                                    {msg.id_remetente !== user?.id_usuario && <Avatar user={msg.usuario || msg.remetente}/>}
                                    <div className={`p-3 rounded-2xl max-w-md md:max-w-lg ${msg.id_remetente === user?.id_usuario ? 'bg-amber-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 dark:text-white shadow-sm rounded-bl-none'}`}>
                                        <p className="text-sm break-words">{msg.conteudo}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 mt-auto">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite uma mensagem..."
                                    className="flex-1 p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 dark:text-white"
                                />
                                <button type="submit" className="bg-amber-500 text-white p-3 rounded-lg hover:bg-amber-600 transition disabled:bg-gray-400" disabled={!newMessage.trim()}>
                                    <Send size={20}/>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                        <CornerDownLeft size={48} className="text-gray-300 dark:text-gray-600"/>
                        <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">Selecione uma conversa</h2>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Escolha um chat na barra lateral para começar a conversar.</p>
                    </div>
                )}
            </section>
        </main>
    );
}