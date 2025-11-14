// src/models/Chat.js
import prisma from '../config/prisma.js';

export const iniciarChat = async (id_usuario1, id_usuario2) => {
    return prisma.$transaction(async (tx) => {
        const chatExistente = await tx.chat.findFirst({
            where: {
                AND: [ { chatparticipante: { some: { id_usuario: id_usuario1 } } }, { chatparticipante: { some: { id_usuario: id_usuario2 } } } ],
                chatparticipante: { every: { id_usuario: { in: [id_usuario1, id_usuario2] } } }
            }
        });

        if (chatExistente) return { chat: chatExistente, criadoAgora: false };
        
        return { 
            chat: await tx.chat.create({ data: { chatparticipante: { create: [{ id_usuario: id_usuario1 }, { id_usuario: id_usuario2 }] } } }),
            criadoAgora: true
        };
    });
};

export const listarChatsDoUsuario = async (usuarioId) => {
    return prisma.chat.findMany({
        where: { chatparticipante: { some: { id_usuario: parseInt(usuarioId) } } }, // NOME CORRIGIDO
        include: {
            chatparticipante: { // NOME CORRIGIDO
                include: { usuario: { select: { id_usuario: true, nome: true, url_foto_perfil: true } } }
            },
            mensagem: { // NOME CORRIGIDO
                orderBy: { data_envio: 'desc' },
                take: 1
            }
        }
    });
};

export const listarMensagensDoChat = async (chatId) => {
    return prisma.mensagem.findMany({ // NOME CORRIGIDO
        where: { id_chat: parseInt(chatId) },
        include: { usuario: { select: { id_usuario: true, nome: true, url_foto_perfil: true } } },
        orderBy: { data_envio: 'asc' }
    });
};

export const criarMensagem = async (chatId, remetenteId, conteudo) => {
    return prisma.mensagem.create({ // NOME CORRIGIDO
        data: {
            id_chat: parseInt(chatId),
            id_remetente: parseInt(remetenteId),
            conteudo: conteudo,
        },
        include: { usuario: { select: { id_usuario: true, nome: true, url_foto_perfil: true } } }
    });
};