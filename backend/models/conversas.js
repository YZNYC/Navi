// src/models/Chat.js

import prisma from '../config/prisma.js';

/**
 * Busca todas as conversas ativas de um usuário.
 */
export const getConversas = async (userId) => {
    const conversasBrutas = await prisma.$queryRaw`
        SELECT 
            u.id_usuario AS id,
            u.nome,
            u.url_foto_perfil as profilePictureUrl,
            (SELECT m.conteudo FROM mensagem m WHERE (m.id_remetente = u.id_usuario AND m.id_destinatario = ${userId}) OR (m.id_remetente = ${userId} AND m.id_destinatario = u.id_usuario) ORDER BY m.timestamp DESC LIMIT 1) as lastMessage,
            (SELECT m.timestamp FROM mensagem m WHERE (m.id_remetente = u.id_usuario AND m.id_destinatario = ${userId}) OR (m.id_remetente = ${userId} AND m.id_destinatario = u.id_usuario) ORDER BY m.timestamp DESC LIMIT 1) as lastMessageTimestamp,
            (SELECT m.id_remetente FROM mensagem m WHERE (m.id_remetente = u.id_usuario AND m.id_destinatario = ${userId}) OR (m.id_remetente = ${userId} AND m.id_destinatario = u.id_usuario) ORDER BY m.timestamp DESC LIMIT 1) as lastMessageSenderId,
            (SELECT COUNT(*) FROM mensagem m WHERE m.id_remetente = u.id_usuario AND m.id_destinatario = ${userId} AND m.lida = FALSE) as unreadCount
        FROM usuario u
        JOIN (
            SELECT DISTINCT CASE WHEN id_remetente = ${userId} THEN id_destinatario ELSE id_remetente END as partner_id
            FROM mensagem
            WHERE id_remetente = ${userId} OR id_destinatario = ${userId}
        ) AS partners ON u.id_usuario = partners.partner_id
        WHERE u.id_usuario != ${userId} AND NOT EXISTS (
            SELECT 1 FROM conversa_oculta co 
            WHERE co.id_usuario = ${userId} AND co.id_parceiro_chat = u.id_usuario
        )
        ORDER BY lastMessageTimestamp DESC;
    `;
    
    // --- CORREÇÃO DO BUG BigInt ---
    // Mapeamos os resultados para converter o campo 'unreadCount' de BigInt para Number.
    const conversas = conversasBrutas.map(convo => ({
        ...convo,
        unreadCount: Number(convo.unreadCount), // Conversão segura
    }));
    
    return conversas;
};

/**
 * Busca o histórico completo de mensagens entre dois usuários.
 */
export const getHistoricoMensagens = async (usuarioLogadoId, outroUsuarioId) => {
    return await prisma.mensagem.findMany({
        where: {
            OR: [
                { id_remetente: usuarioLogadoId, id_destinatario: outroUsuarioId },
                { id_remetente: outroUsuarioId, id_destinatario: usuarioLogadoId },
            ],
        },
        include: {
            remetente: {
                select: { id_usuario: true, nome: true, url_foto_perfil: true }
            },
            reply_to_message: {
                select: {
                    conteudo: true,
                    remetente: { select: { nome: true } }
                }
            }
        },
        orderBy: { timestamp: 'asc' },
    });
};

/**
 * Marca todas as mensagens de um chat como lidas.
 */
export const marcarMensagensComoLidas = async (remetenteId, destinatarioId) => {
    return await prisma.mensagem.updateMany({
        where: {
            id_remetente: remetenteId,
            id_destinatario: destinatarioId,
            lida: false,
        },
        data: { lida: true },
    });
};

/**
 * Adiciona um registro para ocultar uma conversa da lista do usuário.
 */
export const ocultarConversa = async (usuarioLogadoId, outroUsuarioId) => {
    return await prisma.conversa_oculta.create({
        data: {
            id_usuario: usuarioLogadoId,
            id_parceiro_chat: outroUsuarioId,
        }
    });
};

/**
 * Busca usuários pelo nome para iniciar novas conversas.
 */
export const buscarUsuarios = async (termoDeBusca, usuarioLogadoId) => {
    return await prisma.usuario.findMany({
        where: {
            id_usuario: { not: usuarioLogadoId },
            nome: { contains: termoDeBusca }, // MySQL é case-insensitive por padrão
        },
        select: {
            id_usuario: true,
            nome: true,
            email: true,
            url_foto_perfil: true,
        },
        take: 10,
    });
};