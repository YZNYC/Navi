// chat/page.jsx — versão FINAL atualizada para usar api.get/post e buildUrl apenas em anexos

'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import api, { buildUrl } from '@/lib/api';
import { socket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import { Search, PaperClip, Send, Loader2 } from 'lucide-react';

// =============== AVATAR ==================
const Avatar = ({ user, small=false }) => {
  const size = small ? 'w-8 h-8' : 'w-12 h-12';
  const font = small ? 'text-xs' : 'text-sm';

  if (!user)
    return <div className={`${size} ${font} rounded-full bg-amber-500 flex items-center justify-center text-white`}>?</div>;

  if (user.url_foto_perfil)
    return <img src={user.url_foto_perfil} alt={user.nome} className={`${size} rounded-full object-cover`} />;

  const initials = user.nome?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  return (
    <div className={`${size} ${font} rounded-full bg-amber-500 flex items-center justify-center text-white font-bold`}>
      {initials}
    </div>
  );
};

// =============== BUBBLE ==================
const MessageBubble = ({ msg, me }) => (
  <div className={`flex ${me ? 'justify-end' : 'justify-start'} gap-3 my-2`}>
    {!me && <Avatar user={msg.usuario} small />}

    <div className={`p-3 rounded-2xl max-w-[70%] break-words ${me ? 'bg-amber-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 dark:text-white shadow-sm rounded-bl-none'}`}>

      {/* Texto */}
      {msg.conteudo && <div className="text-sm">{msg.conteudo}</div>}

      {/* Anexos */}
      {msg.anexos?.length > 0 && (
        <div className="mt-2 space-y-2">
          {msg.anexos.map(a => {
            const finalUrl = buildUrl(a.url.replace(/^\//, ''));
            return (
              <div key={a.id}>
                {a.tipo?.startsWith('image/') ? (
                  <img
                    src={finalUrl}
                    className="w-40 h-40 object-cover rounded-md cursor-pointer"
                    onClick={() => window.open(finalUrl, '_blank')}
                  />
                ) : (
                  <a href={finalUrl} target="_blank" className="underline text-sm">📎 {a.nome_arquivo}</a>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-gray-400 mt-1 text-right">
        {new Date(msg.data_envio).toLocaleString()}
      </div>
    </div>

    {me && <Avatar user={msg.usuario} small />}
  </div>
);

// =============== HEADER ==================
const ChatHeader = ({ other, onBack }) => (
  <div className="flex items-center gap-3 p-3 border-b dark:border-slate-700 bg-white dark:bg-slate-900">
    {onBack && <button onClick={onBack} className="sm:hidden mr-2">◀</button>}
    <Avatar user={other} />
    <div>
      <div className="font-bold">{other?.nome}</div>
      <div className="text-sm text-gray-500">{other?.email}</div>
    </div>
  </div>
);

// =============== SIDEBAR ==================
const Sidebar = ({ chats, users, selectedChatId, onSelectChat, onStartChatWithUser, query, setQuery, isLoading, user }) => (
  <aside className="w-full sm:w-80 border-r dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col">
    <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
      <h2 className="text-lg font-semibold">Conversas</h2>
    </div>

    <div className="p-3">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-md px-3 py-2">
        <Search size={16} className="text-gray-500" />
        <input
          placeholder="Pesquisar pessoas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent flex-1 outline-none text-sm dark:text-white"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {/* Se está pesquisando → lista usuários */}
      {query.trim() ? (
        users.length ? (
          users.map(u => (
            <button
              key={u.id_usuario}
              onClick={() => onStartChatWithUser(u)}
              className="w-full text-left p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <Avatar user={u} />
              <div className="flex-1">
                <div className="font-semibold truncate">{u.nome}</div>
                <div className="text-sm text-gray-500 truncate">{u.email}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="p-4 text-sm text-gray-500">Nenhum usuário encontrado.</div>
        )
      ) : (
        /* SENÃO: lista chats existentes */
        isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-amber-500" />
          </div>
        ) : (
          chats.length ? chats.map(chat => {
            const other = chat.chatparticipante.find(p => p.id_usuario !== user.id_usuario)?.usuario;
            const last = chat.mensagem?.[0];
            if (!other) return null;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`w-full text-left p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 ${selectedChatId === chat.id ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}
              >
                <Avatar user={other} />
                <div className="flex-1">
                  <div className="font-semibold truncate">{other.nome}</div>
                  <div className="text-sm text-gray-500 truncate">{last?.conteudo || 'Nenhuma mensagem'}</div>
                </div>
              </button>
            );
          }) : (
            <div className="p-4 text-sm text-gray-500">Nenhuma conversa.</div>
          )
        )
      )}
    </div>
  </aside>
);

// =============== CHAT WINDOW ==================
const ChatWindow = ({ chat, user, typingState }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);
  const typingTimeout = useRef(null);

  // Carrega mensagens prévias
  useEffect(() => {
    setMessages(chat?.loadedMessages || []);
  }, [chat?.id]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Receber mensagens socket
  useEffect(() => {
    if (!chat) return;

    const handleReceber = (msg) => {
      if (msg.id_chat === chat.id)
        setMessages((prev) => [...prev, msg]);
    };

    socket.on('receber-mensagem', handleReceber);
    return () => socket.off('receber-mensagem', handleReceber);
  }, [chat?.id]);

  const handleTyping = () => {
    socket.emit('digitando', { chatId: chat.id, usuarioId: user.id_usuario });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('parou-digitando', { chatId: chat.id, usuarioId: user.id_usuario });
    }, 700);
  };

  const handleFiles = (e) => setFiles([...e.target.files]);

  const submit = async (e) => {
    e?.preventDefault();
    if (!text.trim() && files.length === 0) return;

    setIsSending(true);
    try {
      const form = new FormData();
      form.append('conteudo', text);
      files.forEach(f => form.append('anexos', f));

      // Agora usando api.post — baseURL normalizado
      const resp = await api.post(`/chat/${chat.id}/mensagens`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages(prev => [...prev, resp.data]);
      socket.emit('receber-mensagem', resp.data);

      setText('');
      setFiles([]);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!chat)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
        Selecione uma conversa
      </div>
    );

  const other = chat.chatparticipante.find(p => p.id_usuario !== user.id_usuario)?.usuario;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900">
      <ChatHeader other={other} />

      {/* Mensagens */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            me={msg.id_remetente === user.id_usuario}
          />
        ))}

        {typingState[chat.id] && (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
            Digitando...
          </div>
        )}
      </div>

      {/* Formulário de envio */}
      <form onSubmit={submit} className="p-3 flex items-center gap-3 border-t dark:border-slate-700 bg-white dark:bg-slate-900">
        <label className="cursor-pointer text-amber-600 dark:text-amber-400">
          <PaperClip size={22} />
          <input type="file" multiple className="hidden" onChange={handleFiles} />
        </label>

        <input
          value={text}
          onChange={(e) => { setText(e.target.value); handleTyping(); }}
          placeholder="Digite uma mensagem..."
          className="flex-1 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-full px-4 py-2 outline-none"
        />

        <button
          type="submit"
          disabled={isSending}
          className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
        >
          {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

// =============== PÁGINA PRINCIPAL ==================
const ChatPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [query, setQuery] = useState('');
  const [typingState, setTypingState] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch inicial de chats
  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get('/chat');
      setChats(resp.data || []);
    } catch (err) {
      console.error('Erro ao carregar chats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchChats(); }, [fetchChats]);

  // Eventos socket: digitando
  useEffect(() => {
    socket.on('digitando', ({ chatId, usuarioId }) => {
      setTypingState((prev) => ({ ...prev, [chatId]: true }));
    });
    socket.on('parou-digitando', ({ chatId }) => {
      setTypingState((prev) => ({ ...prev, [chatId]: false }));
    });
    return () => {
      socket.off('digitando');
      socket.off('parou-digitando');
    };
  }, []);

  // Selecionar chat
  const handleSelectChat = async (chat) => {
    try {
      const resp = await api.get(`/chat/${chat.id}/mensagens`);
      const loaded = { ...chat, loadedMessages: resp.data };
      setSelectedChat(loaded);
      socket.emit('entrar-na-sala', chat.id);
    } catch (err) {
      console.error('Erro ao abrir chat:', err);
    }
  };

  // Iniciar nova conversa
  const handleStartChat = async () => {
    const email = prompt('Digite o e-mail do usuário:');
    if (!email) return;

    try {
      const respUser = await api.get(`/usuarios/email/${email}`);
      const dest = respUser.data;

      const respChat = await api.post('/chat/iniciar', { id_destinatario: dest.id_usuario });

      await fetchChats();
      handleSelectChat(respChat.data.chat);
    } catch (err) {
      alert('Erro ao iniciar conversa.');
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100 dark:bg-slate-900">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChat?.id}
        onSelect={handleSelectChat}
        query={query}
        setQuery={setQuery}
        isLoading={loading}
        onStartChat={handleStartChat}
        user={user}
      />

      <ChatWindow chat={selectedChat} user={user} typingState={typingState} />
    </div>
  );
};

export default ChatPage;
