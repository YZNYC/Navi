// src/models/Chat.js

import prisma from '../config/prisma.js';

/**
 * Busca todas as conversas ativas de um usuário.
 * Esta função já usa $queryRaw, que não depende dos nomes de relação do Prisma,
 * então ela continua funcionando perfeitamente.
 */
export const getConversas = async (userId) => {
    const conversas = await prisma.$queryRaw`
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
    return conversas;
};

/**
 * Busca o histórico completo de mensagens entre dois usuários, usando os
 * nomes de relação gerados pelo Prisma 'db pull'.
 */
export const getHistoricoMensagens = async (usuarioLogadoId, outroUsuarioId) => {
    // Usamos um `select` explícito para renomear os campos no resultado,
    // tornando a resposta da API mais limpa e desacoplando o frontend
    // dos nomes de relação do banco.
    return await prisma.mensagem.findMany({
        where: {
            OR: [
                { id_remetente: usuarioLogadoId, id_destinatario: outroUsuarioId },
                { id_remetente: outroUsuarioId, id_destinatario: usuarioLogadoId },
            ],
        },
        select: {
            // Mapeia os campos da tabela 'mensagem'
            id_mensagem: true,
            conteudo: true,
            timestamp: true,
            id_remetente: true,
            id_destinatario: true,
            lida: true,
            foi_editada: true,

            // Mapeia o relacionamento, renomeando o resultado para 'remetente'
            usuario_mensagem_id_remetenteTousuario: {
                select: {
                    id_usuario: true,
                    nome: true,
                    url_foto_perfil: true,
                }
            }
            // Para 'reply_to' a lógica seria similar se o Prisma gerasse um nome de relação
        },
        orderBy: { timestamp: 'asc' },
    });
};

/**
 * Funções de marcar como lida, ocultar conversa e buscar usuários não dependem
 * de `include`, então elas permanecem as mesmas.
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

export const ocultarConversa = async (usuarioLogadoId, outroUsuarioId) => {
    return await prisma.conversa_oculta.create({
        data: {
            id_usuario: usuarioLogadoId,
            id_parceiro_chat: outroUsuarioId,
        }
    });
};

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