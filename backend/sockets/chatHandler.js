// src/sockets/chatHandler.js

import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const onlineUsers = new Map();

/**
 * Função principal que configura toda a lógica do Socket.IO.
 * @param {import('socket.io').Server} io - A instância do servidor de Socket.IO.
 */
export function configureChatSocket(io) {
    
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Token de autenticação não fornecido.'));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const usuario = await prisma.usuario.findUnique({
                where: { id_usuario: decoded.id_usuario },
                select: { id_usuario: true, nome: true, papel: true, url_foto_perfil: true }
            });

            if (!usuario) return next(new Error('Usuário não encontrado.'));
            socket.user = usuario;
            next();
        } catch (err) {
            next(new Error('Erro de autenticação.'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket Conectado: ${socket.user.nome} (ID do usuário: ${socket.user.id_usuario})`);

        onlineUsers.set(socket.user.id_usuario, { socketId: socket.id, ...socket.user });
        io.emit('updateUserList', Array.from(onlineUsers.values()));

        // --- HANDLER DE ENVIO DE MENSAGEM ---
       // --- HANDLER DE ENVIO DE MENSAGEM (CORRIGIDO) ---
        socket.on('sendMessage', async (data) => {
            const { recipientId, text, replyingTo, mediaUrl } = data;
            const remetenteId = socket.user.id_usuario;

            try {
                const dadosCriacao = {
                    id_remetente: remetenteId,
                    id_destinatario: parseInt(recipientId),
                    conteudo: text || "",
                    url_midia: mediaUrl || null,
                };
                
                if (replyingTo && replyingTo.id_mensagem) {
                    // O campo no banco se chama 'reply_to'. Prisma gerou a relação a partir dele.
                    dadosCriacao.reply_to = parseInt(replyingTo.id_mensagem);
                }

                // Cria a mensagem e seleciona explicitamente os campos para o retorno,
                // incluindo o relacionamento com o nome gerado pelo 'db pull'.
                const novaMensagem = await prisma.mensagem.create({
                    data: dadosCriacao,
                    select: {
                        id_mensagem: true,
                        conteudo: true,
                        timestamp: true,
                        id_remetente: true,
                        id_destinatario: true,
                        lida: true,
                        foi_editada: true,
                        url_midia: true,
                        reply_to: true,
                        // Aqui está a correção: usamos o nome de relação "feio"
                        usuario_mensagem_id_remetenteTousuario: {
                            select: {
                                id_usuario: true,
                                nome: true,
                                url_foto_perfil: true
                            }
                        },
                        // Se necessário, fazer o mesmo para reply_to_message
                    }
                });

                // Renomeamos o campo para 'remetente' antes de enviar ao frontend.
                // Isso cria um "contrato de API" limpo e isola o frontend da estrutura do banco.
                const mensagemFormatada = {
                    ...novaMensagem,
                    remetente: novaMensagem.usuario_mensagem_id_remetenteTousuario
                };
                delete mensagemFormatada.usuario_mensagem_id_remetenteTousuario;
                
                // Transmite a mensagem formatada e limpa
                const destinatarioSocket = onlineUsers.get(parseInt(recipientId));
                if (destinatarioSocket) {
                    io.to(destinatarioSocket.socketId).emit('receiveMessage', mensagemFormatada);
                }
                socket.emit('receiveMessage', mensagemFormatada);

            } catch (error) {
                console.error("Erro detalhado no 'sendMessage':", error);
            }
        });

        // --- DEMAIS HANDLERS (edit, read, typing) ---
    
        socket.on('editMessage', async ({ messageId, newText }) => {
            try {
                // 1. Verifica se a mensagem existe e se pertence ao usuário
                const mensagem = await prisma.mensagem.findFirst({
                    where: { id_mensagem: messageId, id_remetente: socket.user.id_usuario }
                });

                if (!mensagem) {
                    // Envia um erro de volta para o remetente se a ação for inválida
                    return socket.emit('error', { message: "Você não pode editar esta mensagem." });
                }
                
                // 2. Atualiza a mensagem no banco
                const mensagemAtualizada = await prisma.mensagem.update({
                    where: { id_mensagem: messageId },
                    data: { conteudo: newText, foi_editada: true }
                });
                
                // 3. Prepara os dados para notificar os clientes
                const updatedData = { 
                    id: mensagemAtualizada.id_mensagem, 
                    text: mensagemAtualizada.conteudo, 
                    foi_editada: true 
                };

                const recipientSocketId = onlineUsers.get(mensagem.id_destinatario)?.socketId;

                // 4. Emite o evento de volta para o destinatário e para o próprio remetente
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('messageEdited', updatedData);
                }
                socket.emit('messageEdited', updatedData);

            } catch (error) { 
                console.error("Erro ao editar mensagem:", error);
                socket.emit('error', { message: "Ocorreu um erro no servidor ao editar a mensagem." });
            }
        });

        
        socket.on('messagesRead', ({ readerId, chatPartnerId }) => {
            const partnerSocketId = onlineUsers.get(parseInt(chatPartnerId))?.socketId;
            if (partnerSocketId) io.to(partnerSocketId).emit('conversationRead', { readerId: parseInt(readerId) });
        });
        
        socket.on('userTyping', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(parseInt(recipientId))?.socketId;
            if(recipientSocketId) io.to(recipientSocketId).emit('userTyping', { userId: socket.user.id_usuario, userName: socket.user.nome });
        });

        socket.on('userStopTyping', ({ recipientId }) => {
            const recipientSocketId = onlineUsers.get(parseInt(recipientId))?.socketId;
            if(recipientSocketId) io.to(recipientSocketId).emit('userStopTyping', { userId: socket.user.id_usuario });
        });

        // Handler de desconexão
        socket.on('disconnect', () => {
            console.log(`Socket Desconectado: ${socket.user.nome}`);
            onlineUsers.delete(socket.user.id_usuario);
            io.emit('updateUserList', Array.from(onlineUsers.values()));
        });
    });
}