'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { Send, MessageSquare, Search, MoreVertical, X, Check, CheckCheck, Loader2, ArrowLeft, ImagePlus, CornerUpLeft, Pencil, Download, Trash2, FileImage } from 'lucide-react';

// -----------------------------------------------------------------------------
// COMPONENTES DE UI REFINADOS
// -----------------------------------------------------------------------------
const Avatar = ({ user, size = "w-10 h-10" }) => {
    const iniciais = user?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '';
    return (
        <div className={`relative flex-shrink-0 ${size}`}>
            {user?.url_foto_perfil ? ( <img className={`rounded-full object-cover ${size}`} src={user.url_foto_perfil} alt={user.nome || ''} /> ) 
            : ( <div className={`rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm ${size}`}>{iniciais}</div> )}
        </div>
    );
};

const ConversationCard = ({ convo, isSelected, onClick, currentUserId }) => (
    <button onClick={() => onClick(convo)} className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors ${isSelected ? 'bg-amber-100 dark:bg-amber-900/50' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
        <Avatar user={{ nome: convo.nome, url_foto_perfil: convo.profilePictureUrl }} />
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 dark:text-white truncate">{convo.nome}</p>
                {convo.lastMessageTimestamp && <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{new Date(convo.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
            </div>
            <div className="flex justify-between items-start mt-1">
                <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'font-bold text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {convo.lastMessage ? (convo.lastMessageSenderId === currentUserId ? `Você: ${convo.lastMessage}` : convo.lastMessage) : '(Nova conversa)'}
                </p>
                {convo.unreadCount > 0 && <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{convo.unreadCount}</span>}
            </div>
        </div>
    </button>
);

const ReplyPreview = ({ message, isInner }) => (
    <div className={`p-2 rounded-lg border-l-4 border-amber-500 ${isInner ? 'bg-black/10 dark:bg-black/20' : 'bg-gray-200 dark:bg-slate-600'}`}>
        <p className="font-semibold text-xs text-amber-600 dark:text-amber-400">{message.remetente.nome}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{message.conteudo || "Mídia"}</p>
    </div>
);

const MessageBubble = ({ msg, isCurrentUser, onReply, onEdit }) => (
    <div className={`group flex items-end gap-2 max-w-lg lg:max-w-xl w-fit ${isCurrentUser ? 'self-end' : 'self-start'}`}>
        {!isCurrentUser && <Avatar user={msg.remetente} size="w-8 h-8"/>}
        <div className="relative">
            <div className={`overflow-hidden rounded-2xl shadow-sm border ${isCurrentUser ? 'bg-amber-500 text-white rounded-br-none border-amber-600' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none border-gray-200 dark:border-slate-600'}`}>
                {!isCurrentUser && <p className="font-bold text-sm mb-1 px-3 pt-3 text-amber-600 dark:text-amber-400">{msg.remetente.nome}</p>}
                {msg.replyingTo && (<div className="px-3 pt-2 opacity-80"><ReplyPreview message={msg.replyingTo} isInner={true} /></div>)}
                {msg.conteudo && <p className="text-base break-words whitespace-pre-wrap p-3 pt-1">{msg.conteudo}</p>}
                {msg.url_midia && <img src={msg.url_midia} className="max-w-xs w-full"/>}
                <div className="flex items-center justify-end gap-2 px-3 pb-2 -mt-1">
                    {msg.foi_editada && <span className={`text-xs italic ${isCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-slate-400'}`}>(editado)</span>}
                    <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isCurrentUser && (msg.lida ? <CheckCheck size={16} className="text-blue-400"/> : <Check size={16} className="text-white/70"/>)}
                </div>
            </div>
            <div className={`absolute top-0 flex gap-1 p-1 bg-white dark:bg-slate-600 rounded-full shadow-lg border dark:border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2 ${isCurrentUser ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}>
                <button onClick={() => onReply(msg)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><CornerUpLeft size={16}/></button>
                {isCurrentUser && <button onClick={() => onEdit(msg)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><Pencil size={16}/></button>}
            </div>
        </div>
    </div>
);

const ChatInput = ({ onSendMessage, replyingTo, editingMessage, onCancelAction }) => {
    const [text, setText] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.conteudo);
            inputRef.current?.focus();
        }
    }, [editingMessage]);

    const handleSend = () => {
        if (!text.trim() && !mediaFile && !editingMessage) return;
        onSendMessage({ text: text.trim(), mediaFile, replyingTo, editingMessage });
        setText(''); setMediaFile(null);
    };

    const handleCancelAll = () => { onCancelAction(); setText(''); setMediaFile(null); };

    return (
        <footer className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
             <AnimatePresence>
                 {(replyingTo || editingMessage || mediaFile) && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                         className="bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-t-lg text-sm flex justify-between items-center mb-2 overflow-hidden">
                         {replyingTo && <ReplyPreview message={replyingTo} />}
                         {editingMessage && <div className="border-l-2 border-blue-500 pl-2"><p className="font-bold text-blue-800 dark:text-blue-300">Editando mensagem...</p><p className="text-gray-500 dark:text-gray-400 truncate max-w-xs">{editingMessage.conteudo}</p></div>}
                         {mediaFile && <div className="flex items-center gap-2"><FileImage className="text-gray-500"/><span className="text-gray-600 dark:text-gray-300 text-xs">{mediaFile.name}</span></div>}
                         <button onClick={handleCancelAll} className="text-gray-400 hover:text-red-600 flex-shrink-0 ml-4"><X size={18}/></button>
                     </motion.div>
                 )}
            </AnimatePresence>
             <div className="relative flex items-center gap-2">
                 <button className="p-2 text-gray-500 hover:text-amber-500 transition-colors"><ImagePlus size={22} /></button>
                 <textarea ref={inputRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSend()) : null} 
                     rows={1} placeholder="Escreva uma mensagem..." className="w-full mx-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-700 resize-none max-h-24 text-gray-800 dark:text-gray-200 border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                 {editingMessage ? (
                     <div className="flex items-center gap-2">
                        <button onClick={handleCancelAll} className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"><X size={20}/></button>
                        <button onClick={handleSend} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"><Check size={20}/></button>
                    </div>
                 ) : (
                    <button onClick={handleSend} disabled={!text.trim() && !mediaFile} className="p-3 transition-colors bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-slate-600">
                        <Send size={20}/>
                    </button>
                 )}
             </div>
        </footer>
    );
};
// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA PÁGINA DE CHAT
// -----------------------------------------------------------------------------
export default function ChatPage() {
    const router = useRouter();
    const { user: currentUser, isLoading: isAuthLoading } = useAuth();
    const socketRef = useRef(null);
    const messageContainerRef = useRef(null);
    const firstUnreadRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const fetchConversations = useCallback(async (showLoading = true) => {
        if (!currentUser) return;
        if (showLoading) setIsLoadingData(true);
        try {
            const response = await api.get('/chat/conversations');
            setConversations(response.data);
        } catch { toast.error("Não foi possível carregar suas conversas."); } 
        finally { if (showLoading) setIsLoadingData(false); }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser || isAuthLoading) return;
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) { router.push('/auth'); return; }
        
        const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
            auth: { token }, transports: ['websocket']
        });
        socketRef.current = socket;
        
        socket.on('receiveMessage', (newMessage) => {
            if (selectedConversation && (newMessage.id_remetente === selectedConversation.id)) {
                setMessages(prev => [...prev, newMessage]);
            }
            fetchConversations(false);
        });

        socket.on('messageConfirmation', (confirmedMessage) => {
            setMessages(prev => prev.map(msg => msg.id_mensagem === `optimistic-${confirmedMessage.optimisticId}` ? { ...confirmedMessage } : msg));
        });

        socket.on('messagesRead', ({ chatPartnerId }) => {
            if (selectedConversation?.id === chatPartnerId) {
                setMessages(prev => prev.map(msg => ({ ...msg, lida: true })));
            }
        });
        
        socket.on('messageEdited', ({ id, text }) => {
            setMessages(prev => prev.map(m => m.id_mensagem === id ? { ...m, conteudo: text, foi_editada: true } : m));
        });
        
        return () => socket.disconnect();
    }, [currentUser, isAuthLoading, router, selectedConversation, fetchConversations]);
    
    useEffect(() => {
        if (currentUser) fetchConversations();
    }, [currentUser, fetchConversations]);

    const handleSelectConversation = useCallback(async (convo) => {
        handleCancelAction();
        setSearchTerm(''); setSearchResults([]);
        const convoId = convo.id;
        if(selectedConversation?.id === convoId) return;
        
        const newSelected = conversations.find(c => c.id === convoId);
        if(!newSelected) return;

        setSelectedConversation(newSelected);
        setIsLoadingData(true);
        setMessages([]);
        try {
            if (newSelected.unreadCount > 0) {
                api.put(`/chat/messages/mark-as-read/${convoId}`);
                socketRef.current?.emit('messagesRead', { readerId: currentUser.id_usuario, chatPartnerId: convoId });
                setConversations(prev => prev.map(c => c.id === convoId ? {...c, unreadCount: 0} : c));
            }
            const response = await api.get(`/chat/history/${convoId}`);
            setMessages(response.data);
        } catch { toast.error("Não foi possível carregar o histórico."); } 
        finally { setIsLoadingData(false); }
    }, [conversations, currentUser, selectedConversation]);
    
    const handleSendMessage = ({ text, replyingTo, editingMessage }) => {
        if (!text && !editingMessage) return;
        const recipientId = selectedConversation.id;

        if (editingMessage) {
            socketRef.current.emit('editMessage', { messageId: editingMessage.id_mensagem, newText: text });
            setMessages(prev => prev.map(msg => msg.id_mensagem === editingMessage.id_mensagem ? { ...msg, conteudo: text, foi_editada: true } : msg));
        } else {
            const optimisticId = Date.now();
            const optimisticMessage = {
                optimisticId,
                id_mensagem: `optimistic-${optimisticId}`,
                conteudo: text,
                timestamp: new Date().toISOString(),
                id_remetente: currentUser.id_usuario,
                remetente: currentUser,
                lida: false, foi_editada: false,
                replyingTo: replyingTo ? { ...replyingTo } : null,
            };
            setMessages(prev => [...prev, optimisticMessage]);

            socketRef.current.emit('sendMessage', {
                recipientId, text,
                optimisticId,
                replyingToId: replyingTo ? replyingTo.id_mensagem : null,
            });
        }
        handleCancelAction();
    };
    
    const handleCancelAction = () => { setReplyingTo(null); setEditingMessage(null); };

    useEffect(() => {
        if (firstUnreadRef.current) {
            firstUnreadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages, isLoadingData]);

    const firstUnreadIndex = selectedConversation?.unreadCount > 0 
        ? messages.length - selectedConversation.unreadCount 
        : -1;

    if (isAuthLoading || !currentUser) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;
    }
    
    return (
        <div className="h-screen flex bg-white dark:bg-slate-900 font-sans overflow-hidden">
            <aside className={`absolute sm:relative h-full w-full sm:w-96 z-20 flex flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 transition-transform duration-300 ${selectedConversation ? "-translate-x-full sm:translate-x-0" : "translate-x-0"}`}>
                 <div className="p-4 flex-shrink-0 border-b dark:border-slate-700">
                    <div className="relative">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar ou iniciar conversa" className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto">
                    {/* ... A lógica de renderização da lista de conversas/busca ... */}
                 </div>
            </aside>
            <main className="flex-1 flex flex-col h-screen bg-gray-50 dark:bg-slate-900/70">
                 {!selectedConversation ? ( <WelcomeScreen/> ) 
                : (
                    <>
                        <header className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4 shadow-sm z-10 flex-shrink-0">
                             <button onClick={() => setSelectedConversation(null)} className="sm:hidden text-gray-500"><ArrowLeft/></button>
                             <Avatar user={{ nome: selectedConversation.nome, url_foto_perfil: selectedConversation.profilePictureUrl }} size="w-10 h-10"/>
                             <div className="flex-1"><h3 className="font-bold text-lg text-gray-800 dark:text-white">{selectedConversation.nome}</h3></div>
                            <Menu as="div" className="relative">{/* ... */}</Menu>
                        </header>
                        <div ref={messageContainerRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-1">
                            {isLoadingData ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={32}/></div> 
                            ) : messages.map((msg, index) => (
                                <Fragment key={msg.id_mensagem}>
                                    {index === firstUnreadIndex && (
                                        <div ref={firstUnreadRef} className="relative text-center my-4">
                                            <hr className="dark:border-slate-600"/>
                                            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-gray-200 dark:bg-slate-600 text-xs font-bold text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">NOVAS MENSAGENS</span>
                                        </div>
                                    )}
                                    <MessageBubble msg={msg} isCurrentUser={msg.id_remetente === currentUser?.id_usuario} onReply={setReplyingTo} onEdit={setEditingMessage} />
                                </Fragment>
                            ))}
                        </div>
                        <ChatInput onSendMessage={handleSendMessage} replyingTo={replyingTo} editingMessage={editingMessage} onCancelAction={handleCancelAction}/>
                    </>
                )}
            </main>
            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => {}} title="Excluir Conversa" message="..." />
        </div>
    );
}