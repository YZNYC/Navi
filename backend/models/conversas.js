// src/models/Conversa.js

import prisma from '../config/prisma.js';

/**
 * Salva uma nova conversa ou atualiza uma existente.
 * Garante que id_usuario é um INT e o histórico é stringificado.
 */
export const salvarOuAtualizarConversa = async (conversaId, userId, titulo, topico, historico) => {
    // 1. GARANTE QUE O HISTÓRICO É UM JSON VÁLIDO PARA O DB
    const historicoJson = JSON.stringify(historico);

    // Converte userId para INT (necessário para a operação do Prisma)
    const parsedUserId = parseInt(userId); 
    const parsedConversaId = conversaId ? parseInt(conversaId) : null;

    if (parsedConversaId) {
        // ATUALIZAÇÃO
        return prisma.conversaNavi.update({
            where: { id: parsedConversaId },
            data: {
                historico_json: historicoJson,
                titulo: titulo,
            },
        });
    } else {
        // CRIAÇÃO NOVA CONVERSA (Ponto de falha mais comum - FK)
        return prisma.conversaNavi.create({
            data: {
                id_usuario: parsedUserId, 
                titulo: titulo,
                topico: topico,
                historico_json: historicoJson,
            },
        });
    }
};

/**
 * Lista todas as conversas de um usuário.
 */
export const listarConversasPorUsuario = async (userId) => {
    return prisma.conversaNavi.findMany({
        where: { id_usuario: parseInt(userId) },
        select: {
            id: true,
            titulo: true,
            topico: true,
            data_criacao: true,
        },
        orderBy: { data_criacao: 'desc' },
    });
};

/**
 * Obtém o histórico completo de uma conversa específica.
 */
export const obterHistoricoPorId = async (conversaId) => {
    const conversa = await prisma.conversaNavi.findUnique({
        where: { id: parseInt(conversaId) },
        select: { historico_json: true, id_usuario: true }, // Inclui id_usuario para checagem de permissão
    });
    
    if (!conversa) return null;
    
    // Retorna a conversa com o histórico parseado
    return {
        ...conversa,
        historico_json: JSON.parse(conversa.historico_json)
    };
};