// src/navi/controllers/ConversaController.js

import { ConversaModel } from '../models/ConversaNavi.js';
// ... (outros imports)

// 1. Listar Metadados (Sidebar)
export const listarConversasController = async (req, res) => {
    try {
        const userId = req.usuario.id_usuario;
        const conversas = await ConversaModel.listarPorUsuario(userId);
        res.status(200).json(conversas);
    } catch (error) {
        console.error("ERRO CONVERSA/LISTAR:", error);
        res.status(500).json({ message: "Erro interno ao listar conversas." });
    }
};

// 2. Obter Histórico (Ao selecionar um chat)
export const obterHistoricoController = async (req, res) => {
    try {
        const userId = req.usuario.id_usuario;
        const conversaId = req.params.conversaId;
        
        const conversa = await ConversaModel.obterHistorico(conversaId);
        
        if (!conversa) return res.status(404).json({ message: "Conversa não encontrada." });
        
        // REGRA DE SEGURANÇA: Checar se o ID do token é o dono da conversa
        if (conversa.id_usuario !== userId && req.usuario.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido à esta conversa." });
        }
        
        // Retorna o histórico parseado (o array)
        res.status(200).json(conversa.historico); 
        
    } catch (error) {
        console.error("ERRO CONVERSA/HISTORICO:", error);
        res.status(500).json({ message: "Erro interno ao obter histórico." });
    }
};

// 3. Salvar/Atualizar (Após cada resposta da IA)
export const salvarConversaController = async (req, res) => {
    try {
        const { conversaId, historico, titulo, topico } = req.body;
        const userId = req.usuario.id_usuario; 

        const conversaAtualizada = await ConversaModel.salvarOuAtualizar(
            conversaId, 
            userId, 
            titulo, 
            topico, 
            historico
        );

        // Retorna o objeto completo para o frontend
        res.status(200).json(conversaAtualizada); 
        
    } catch (error) {
        console.error("ERRO CONVERSA/SALVAR:", error);
        res.status(500).json({ message: "Erro interno ao salvar conversa." });
    }
};