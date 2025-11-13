// src/sockets/chatHandler.js

import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// Mapa em memória para rastrear usuários online: Key: id_usuario, Value: socket.id
const onlineUsers = new Map();

/**
 * Função principal que configura toda a lógica do Socket.IO para o chat.
 * @param {import('socket.io').Server} io - A instância do servidor de Socket.IO.
 */
export function configureChatSocket(io) {
    
    // Middleware de Autenticação do Socket.IO: executado para cada nova conexão.
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication error: Token not provided'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Busca o usuário no banco para garantir que ele existe e está ativo
            const usuario = await prisma.usuario.findUnique({
                where: { id_usuario: decoded.id_usuario, ativo: true },
                select: { id_usuario: true, nome: true, url_foto_perfil: true }
            });

            if (!usuario) return next(new Error('User not found or inactive.'));

            socket.usuario = usuario; // Anexa os dados do usuário ao objeto do socket
            next();
        } catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    // Evento principal: disparado quando um cliente se conecta com sucesso.
    io.on('connection', (socket) => {
        console.log(`✅ Usuário conectado: ${socket.usuario.nome} (User ID: ${socket.usuario.id_usuario})`);

        // Adiciona o usuário à lista de online e notifica todos os clientes
        onlineUsers.set(socket.usuario.id_usuario, socket.id);
        io.emit('updateUserList', Array.from(onlineUsers.keys()));

        // --- HANDLERS DE EVENTOS VINDOS DO CLIENTE ---

        socket.on('sendMessage', async (data) => {
            try {
                const { recipientId, text, replyingTo, mediaUrl } = data;
                const sender = socket.usuario;

                // Cria a mensagem no banco usando Prisma
                const newMessage = await prisma.mensagem.create({
                    data: {
                        id_remetente: sender.id_usuario,
                        id_destinatario: recipientId,
                        conteudo: text,
                        url_midia: mediaUrl || null,
                        reply_to_id: replyingTo ? replyingTo.id_mensagem : null,
                    },
                    // Inclui os dados do remetente e da mensagem respondida para enviar aos clientes
                    include: {
                        remetente: { select: { id_usuario: true, nome: true, url_foto_perfil: true }},
                        reply_to_message: { select: { conteudo: true, remetente: { select: { nome: true }}}}
                    }
                });

                // Envia a mensagem em tempo real se o destinatário estiver online
                const recipientSocketId = onlineUsers.get(Number(recipientId));
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receiveMessage', newMessage);
                    io.to(recipientSocketId).emit('refreshConversations');
                } else {
                    // Aqui entraria a lógica de notificação push no futuro
                    console.log(`Usuário ${recipientId} está offline.`);
                }

                // Envia a mensagem de volta para o remetente para confirmação e atualização da UI
                socket.emit('receiveMessage', newMessage);
                socket.emit('refreshConversations');

            } catch (error) { console.error('Erro no evento sendMessage:', error); }
        });

        socket.on('editMessage', async ({ messageId, newText }) => {
            try {
                const mensagem = await prisma.mensagem.findFirst({ where: { id_mensagem: messageId, id_remetente: socket.usuario.id_usuario } });
                if (!mensagem) return;

                const mensagemAtualizada = await prisma.mensagem.update({
                    where: { id_mensagem: messageId },
                    data: { conteudo: newText, foi_editada: true },
                });
                
                const updatedData = { id: mensagemAtualizada.id_mensagem, text: mensagemAtualizada.conteudo, foi_editada: true };
                
                const recipientSocketId = onlineUsers.get(mensagem.id_destinatario);
                if (recipientSocketId) io.to(recipientSocketId).emit('messageEdited', updatedData);
                socket.emit('messageEdited', updatedData);

            } catch (error) { console.error("Erro ao editar mensagem:", error); }
        });

        socket.on('messagesRead', ({ readerId, chatPartnerId }) => {
            const partnerSocketId = onlineUsers.get(Number(chatPartnerId));
            if (partnerSocketId) io.to(partnerSocketId).emit('conversationRead', { readerId });
        });

        socket.on('userTyping', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(Number(recipientId));
            if (recipientSocketId) io.to(recipientSocketId).emit('userTyping', { userId: socket.usuario.id_usuario, userName: socket.usuario.nome });
        });

        socket.on('userStopTyping', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(Number(recipientId));
            if (recipientSocketId) io.to(recipientSocketId).emit('userStopTyping', { userId: socket.usuario.id_usuario });
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Usuário desconectado: ${socket.usuario.nome} (User ID: ${socket.usuario.id_usuario})`);
            onlineUsers.delete(socket.usuario.id_usuario);
            io.emit('updateUserList', Array.from(onlineUsers.keys()));
        });
    });
};