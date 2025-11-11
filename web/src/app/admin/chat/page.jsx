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
import { Send, MessageSquare, Search, MoreVertical, X, Check, CheckCheck, Loader2, ArrowLeft, ImagePlus, CornerUpLeft, Pencil, Download, Trash2 } from 'lucide-react';

// -----------------------------------------------------------------------------
// COMPONENTES DE UI
// -----------------------------------------------------------------------------

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 pt-12 relative border-t-4 border-amber-500" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:rotate-90"><X size={28}/></button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{title}</h2>
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
            <div className="flex gap-4 mt-6">
                <button onClick={onConfirm} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">Sim, Excluir</button>
                <button onClick={onClose} className="flex-1 bg-gray-200 dark:bg-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition">Cancelar</button>
            </div>
        </div>
    </Modal>
);

const Avatar = ({ user, size = "w-10 h-10" }) => {
    const iniciais = user.nome?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '';
    return (
        <div className={`relative flex-shrink-0 ${size}`}>
            {user.url_foto_perfil ? (
                <img className={`rounded-full object-cover ${size}`} src={user.url_foto_perfil} alt={user.nome} />
            ) : (
                <div className={`rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg ${size}`}>
                    {iniciais}
                </div>
            )}
        </div>
    );
};

const ConversationCard = ({ convo, isSelected, onClick, currentUserId }) => (
    <button onClick={() => onClick(convo)} className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors ${isSelected ? 'bg-amber-100 dark:bg-amber-900/50' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
        <Avatar user={{ nome: convo.nome, url_foto_perfil: convo.profilePictureUrl }} />
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 dark:text-white truncate">{convo.nome}</p>
                {convo.lastMessageTimestamp && <p className="text-xs text-gray-500 flex-shrink-0">{new Date(convo.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
            </div>
            <div className="flex justify-between items-start mt-1">
                <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>{convo.lastMessageSenderId === currentUserId ? `Você: ${convo.lastMessage}` : convo.lastMessage}</p>
                {convo.unreadCount > 0 && <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{convo.unreadCount}</span>}
            </div>
        </div>
    </button>
);

const MessageBubble = ({ msg, isCurrentUser, onReply, onEdit }) => {
    const temMidia = !!msg.url_midia;
    const temTexto = msg.conteudo && msg.conteudo.trim().length > 0;
    
    return (
        <div className={`group flex items-end gap-3 max-w-xl ${isCurrentUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`relative rounded-2xl shadow-sm ${isCurrentUser ? 'bg-amber-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                {temMidia && <img src={msg.url_midia} alt="Mídia enviada" className={`max-w-xs ${temTexto ? 'rounded-t-xl' : 'rounded-b-xl'}`} />}
                {temTexto && <p className="text-base break-words whitespace-pre-wrap p-3">{msg.conteudo}</p>}
                
                <div className="flex items-center justify-end gap-2 px-3 pb-2 pt-1">
                    {msg.foi_editada && <span className={`text-xs italic ${isCurrentUser ? 'text-white/70' : 'text-gray-500'}`}>(editado)</span>}
                    <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isCurrentUser && (msg.lida ? <CheckCheck size={16} className="text-blue-400"/> : <Check size={16} className="text-white/70"/>)}
                </div>

                <div className={`absolute top-0 flex gap-1 p-1 bg-white dark:bg-slate-600 rounded-full shadow-lg border dark:border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2 ${isCurrentUser ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}>
                    <button onClick={() => onReply(msg)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"><CornerUpLeft size={16}/></button>
                    {isCurrentUser && <button onClick={() => onEdit(msg)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"><Pencil size={16}/></button>}
                </div>
            </div>
        </div>
    );
};

const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-slate-800/50">
        <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Bem-vindo ao Chat Navi</h2>
        <p className="max-w-md text-gray-500 dark:text-gray-400">Selecione uma conversa na barra lateral para começar.</p>
    </div>
);

const ChatInput = ({ onSendMessage, replyingTo, editingMessage, onCancelAction }) => {
    const [text, setText] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const fileInputRef = useRef(null);
    
    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.conteudo);
        }
    }, [editingMessage]);

    const handleSend = () => {
        const textToSend = text.trim();
        if (!textToSend && !mediaFile) return;
        
        const mediaUrl = mediaFile ? URL.createObjectURL(mediaFile) : null;
        onSendMessage({ text: textToSend, mediaUrl, replyingTo, editingMessage });
        
        setText('');
        setMediaFile(null);
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) { setMediaFile(file); event.target.value = null; }
    };

    const cancelAll = () => { onCancelAction(); setText(''); setMediaFile(null); };

    return (
        <footer className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
             <AnimatePresence>
                 {(replyingTo || editingMessage || mediaFile) && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                         className="bg-gray-100 dark:bg-slate-700 px-3 pt-2 rounded-t-lg text-sm flex justify-between items-start mb-2 overflow-hidden">
                        
                         {replyingTo && (
                             <div className="border-l-2 border-amber-500 pl-2">
                                 <p className="font-bold text-gray-700 dark:text-gray-200">Respondendo a {replyingTo.remetente.nome}</p>
                                 <p className="text-gray-500 dark:text-gray-400 truncate max-w-xs">{replyingTo.conteudo}</p>
                             </div>
                         )}
                         {editingMessage && <div className="border-l-2 border-blue-500 pl-2"><p className="font-bold text-blue-800 dark:text-blue-300">Editando mensagem...</p></div>}
                         {mediaFile && (
                            <div className="flex items-center gap-2">
                                <ImagePlus size={16} className="text-gray-500"/>
                                <span className="text-gray-600 dark:text-gray-300">{mediaFile.name}</span>
                            </div>
                         )}

                         <button onClick={cancelAll} className="text-gray-400 hover:text-red-600"><X size={18}/></button>
                     </motion.div>
                 )}
            </AnimatePresence>

             <div className="relative flex items-center">
                 <button onClick={() => fileInputRef.current.click()} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-amber-500 transition-colors">
                     <ImagePlus size={20} />
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 <input type="text" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSend()) : null} placeholder="Escreva uma mensagem..." className="w-full pl-12 pr-14 py-3 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                 <button onClick={handleSend} disabled={!text.trim() && !mediaFile} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-colors bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-slate-600">
                     <Send size={20}/>
                 </button>
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

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
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
        if (currentUser && !isAuthLoading) {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) { router.push('/auth'); return; }
            const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', { auth: { token }, transports: ['websocket'] });
            socketRef.current = socket;
            
            socket.on('receiveMessage', (newMessage) => {
                const convoId = selectedConversation?.id || selectedConversation?.id_usuario;
                if(convoId === newMessage.id_remetente || convoId === newMessage.id_destinatario) {
                     setMessages(prev => [...prev, newMessage]);
                }
                fetchConversations(false);
            });

            socket.on('messageEdited', (updatedData) => {
                 setMessages(prev => prev.map(m => m.id_mensagem === updatedData.id ? { ...m, conteudo: updatedData.text, foi_editada: updatedData.foi_editada } : m));
            });
            
            socket.on('error', (error) => {
                toast.error(error.message || 'Ocorreu um erro no servidor.');
            });

            return () => socket.disconnect();
        }
    }, [currentUser, isAuthLoading, router, selectedConversation, fetchConversations]);
    
    useEffect(() => {
        if (currentUser && !socketRef.current) return;
        fetchConversations();
    }, [currentUser, fetchConversations]);

    useEffect(() => {
        if (!searchTerm.trim()) { setSearchResults([]); return; }
        const timer = setTimeout(async () => {
            if (!currentUser) return;
            try {
                const res = await api.get(`/chat/users?search=${searchTerm}`);
                const existingConvoIds = new Set(conversations.map(c => c.id));
                setSearchResults(res.data.filter(u => !existingConvoIds.has(u.id_usuario) && u.id_usuario !== currentUser.id_usuario));
            } catch { toast.error("Erro ao buscar usuários."); }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, conversations, currentUser]);
    
    const handleSelectConversation = useCallback(async (convo) => {
        setSearchTerm(''); setSearchResults([]);
        const convoId = convo.id || convo.id_usuario;
        const newSelected = conversations.find(c => c.id === convoId) || {
            id: convoId,
            nome: convo.nome,
            profilePictureUrl: convo.url_foto_perfil,
            unreadCount: 0
        };
        
        setSelectedConversation(newSelected);
        setIsLoadingData(true);
        try {
            const response = await api.get(`/chat/history/${convoId}`);
            setMessages(response.data);
        } catch { toast.error("Não foi possível carregar o histórico."); } 
        finally { setIsLoadingData(false); }
    }, [conversations]);
    
    const handleSendMessage = ({ text, mediaUrl, replyingTo, editingMessage }) => {
        if ((!text || !text.trim()) && !mediaUrl) return;
        const recipientId = selectedConversation.id || selectedConversation.id_usuario;

        if (editingMessage) {
            socketRef.current.emit('editMessage', { messageId: editingMessage.id_mensagem, newText: text });
        } else {
            socketRef.current.emit('sendMessage', {
                recipientId: recipientId,
                text, mediaUrl,
                replyingTo: replyingTo ? { id_mensagem: replyingTo.id_mensagem } : null,
            });
        }
        handleCancelAction();
    };

    const handleCancelAction = () => { setReplyingTo(null); setEditingMessage(null); };

    const handleDeleteConversation = async () => {
        const loadingToast = toast.loading("Excluindo conversa...");
        try {
            await api.delete(`/chat/conversations/${selectedConversation.id}`);
            toast.success("Conversa excluída.", { id: loadingToast });
            setSelectedConversation(null); setIsDeleteModalOpen(false);
            fetchConversations(false);
        } catch (error) { toast.error("Erro ao excluir conversa.", { id: loadingToast });}
    };
    
    const handleDownloadConversation = () => { /* sua lógica de download */ };
    
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (isAuthLoading) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;
    }
    
    return (
        <div className="h-screen flex bg-white text-gray-800 dark:bg-slate-900 font-sans overflow-hidden">
            <aside className={`absolute sm:relative h-full w-full sm:w-[380px] z-20 bg-white dark:bg-slate-800/50 p-4 flex flex-col border-r border-gray-200 dark:border-slate-700 transition-transform duration-300 ${selectedConversation ? "-translate-x-full sm:translate-x-0" : "translate-x-0"}`}>
                 <div className="flex-shrink-0 mb-4 relative">
                     <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                     <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar ou iniciar conversa" className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                 </div>
                 <div className="flex-1 overflow-y-auto pr-2">
                     {isLoadingData ? <div className="flex justify-center p-12"><Loader2 className="animate-spin"/></div> 
                     : searchResults.length > 0 ? (
                        <>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Resultados da Busca</h3>
                            <ul className="space-y-1">{searchResults.map(user => (
                                <li key={user.id_usuario}><ConversationCard convo={user} isSelected={false} onClick={handleSelectConversation} currentUserId={currentUser?.id_usuario}/></li>
                            ))}</ul>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">Conversas</h3>
                            <ul className="space-y-1">
                                {conversations.map(convo => (
                                    <li key={convo.id}><ConversationCard convo={convo} isSelected={selectedConversation?.id === convo.id} onClick={handleSelectConversation} currentUserId={currentUser?.id_usuario}/></li>
                                ))}
                            </ul>
                        </>
                    )}
                 </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen">
                 {!selectedConversation ? ( <WelcomeScreen/> ) 
                : (
                    <>
                        <header className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4 shadow-sm z-10 flex-shrink-0">
                            <button onClick={() => setSelectedConversation(null)} className="sm:hidden text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white mr-2"><ArrowLeft/></button>
                             <Avatar user={{ nome: selectedConversation.nome, url_foto_perfil: selectedConversation.profilePictureUrl }} size="w-10 h-10"/>
                             <div className="flex-1"><h3 className="font-bold text-lg text-gray-800 dark:text-white">{selectedConversation.nome}</h3></div>
                            <Menu as="div" className="relative">
                                <Menu.Button className="p-2 text-gray-400 hover:text-amber-500 rounded-full"><MoreVertical/></Menu.Button>
                                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => ( <button onClick={handleDownloadConversation} className={`${active && 'bg-gray-100 dark:bg-slate-600'} group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200`}><Download size={16}/> Baixar Conversa</button> )}
                                            </Menu.Item>
                                             <Menu.Item>
                                                {({ active }) => ( <button onClick={() => setIsDeleteModalOpen(true)} className={`${active && 'bg-red-100/50 dark:bg-red-900/50'} text-red-700 dark:text-red-400 group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm`}><Trash2 size={16}/> Excluir Conversa</button> )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </header>
                        <div ref={messageContainerRef} className="flex-1 p-6 bg-gray-50 dark:bg-slate-900/70 overflow-y-auto space-y-4">
                            {isLoadingData ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={32}/></div> 
                            ) : messages.map(msg => (
                                <MessageBubble key={msg.id_mensagem || msg.timestamp} msg={msg} isCurrentUser={msg.id_remetente === currentUser?.id_usuario} onReply={setReplyingTo} onEdit={setEditingMessage} />
                            ))}
                        </div>
                        <ChatInput onSendMessage={handleSendMessage} replyingTo={replyingTo} editingMessage={editingMessage} onCancelAction={handleCancelAction}/>
                    </>
                )}
            </main>
            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConversation} title="Excluir Conversa" message={`Tem certeza que deseja excluir seu histórico de conversa com ${selectedConversation?.nome}? Esta ação é irreversível.`} />
        </div>
    );
}