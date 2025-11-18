// src/navi/models/ConversaModel.js

import prisma from '../config/prisma.js';

export const ConversaModel = {
    /**
     * Salva ou Atualiza uma conversa.
     */
    salvarOuAtualizar: async (conversaId, userId, titulo, topico, historico) => {
        const historicoJson = JSON.stringify(historico);
        const parsedUserId = parseInt(userId); 
        const parsedConversaId = conversaId ? parseInt(conversaId) : null;

        const data = {
            historico_json: historicoJson,
            titulo: titulo,
            topico: topico,
        };

        if (parsedConversaId) {
            // Atualiza
            return prisma.conversaNavi.update({ where: { id: parsedConversaId }, data });
        } else {
            // Cria Nova Conversa (Ponto de falha mais comum: FK id_usuario)
            return prisma.conversaNavi.create({ data: { ...data, id_usuario: parsedUserId } });
        }
    },

    /**
     * Lista metadados das conversas de um usuário.
     */
    listarPorUsuario: async (userId) => {
        return prisma.conversaNavi.findMany({
            where: { id_usuario: parseInt(userId) },
            select: { id: true, titulo: true, topico: true, data_criacao: true },
            orderBy: { data_criacao: 'desc' },
        });
    },

    /**
     * Obtém o histórico completo de uma conversa específica.
     */
    obterHistorico: async (conversaId) => {
        const conversa = await prisma.conversaNavi.findUnique({
            where: { id: parseInt(conversaId) },
            select: { historico_json: true, id_usuario: true }, 
        });
        
        if (!conversa) return null;
        
        // Retorna o array de histórico parseado e o id_usuario (para autorização no controller)
        return {
            ...conversa,
            historico: JSON.parse(conversa.historico_json)
        };
    },
};