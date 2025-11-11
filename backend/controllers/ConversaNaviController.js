// src/controllers/ConversaNaviController.js

import { salvarOuAtualizarConversa, listarConversasPorUsuario, obterHistoricoPorId } from '../models/conversas.js';

export const listarConversasController = async (req, res) => {
    try {
        const userId = req.usuario.id_usuario; 
        const conversas = await listarConversasPorUsuario(userId);
        res.status(200).json(conversas);
    } catch (error) {
        console.error("ERRO CRÍTICO AO LISTAR CONVERSAS (DB):", error);
        res.status(500).json({ message: "Erro interno ao listar conversas." });
    }
};

export const obterHistoricoController = async (req, res) => {
    try {
        const userId = req.usuario.id_usuario;
        const conversaId = req.params.conversaId;
        
        const conversa = await obterHistoricoPorId(conversaId); // Retorna { historico_json, id_usuario }
        
        if (!conversa) {
             return res.status(404).json({ message: "Conversa não encontrada." });
        }
        
        // Regra de segurança: garantir que o histórico pertence ao usuário
        if (conversa.id_usuario !== userId && req.usuario.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido." });
        }
        
        // Retorna apenas o array de histórico (o JSON que o Gemini usa)
        res.status(200).json(conversa.historico_json); 
        
    } catch (error) {
        console.error("ERRO CRÍTICO AO OBTER HISTÓRICO (DB):", error);
        res.status(500).json({ message: "Erro interno ao obter histórico." });
    }
};

export const salvarConversaController = async (req, res) => {
    try {
        const { conversaId, historico, titulo, topico } = req.body;
        const userId = req.usuario.id_usuario; // Extraído do token
        
        console.log(`[SALVAR CONVERSA] Usuário ID: ${userId}, Conversa ID: ${conversaId}`); // NOVO LOG

        const conversaAtualizada = await salvarOuAtualizarConversa(
            conversaId, 
            userId, 
            titulo, 
            topico, 
            historico
        );

        res.status(200).json({ 
            id: conversaAtualizada.id, 
            titulo: conversaAtualizada.titulo,
            data_criacao: conversaAtualizada.data_criacao,
        });
    } catch (error) {
        // Logar o erro EXATO para diagnóstico
        console.error("ERRO CRÍTICO AO SALVAR CONVERSA (DB):", error); 
        
        // Se for um erro P2003 (Foreign Key Constraint)
        if (error.code === 'P2003') {
            return res.status(400).json({ message: `Erro de integridade de dados: Usuário ID ${req.usuario.id_usuario} não encontrado.` });
        }

        // Se for qualquer outro erro de DB, retorna 500
        res.status(500).json({ message: "Erro interno ao salvar conversa no DB." });
    }
};