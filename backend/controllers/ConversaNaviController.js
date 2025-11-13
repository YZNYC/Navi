// src/controllers/ChatController.js

import * as ChatModel from '../models/Chat.js';
import { z } from 'zod'; // Importamos o Zod para validações rápidas

// Schema para validar se os IDs nas URLs são numéricos
const paramsIdSchema = z.string().regex(/^\d+$/, "O ID deve ser um número.");

// Busca a lista de conversas do usuário autenticado (que vem do token).
export const getConversasController = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const conversas = await ChatModel.getConversas(usuarioLogadoId);
        res.status(200).json(conversas);
    } catch (error) {
        console.error("Erro ao buscar conversas:", error);
        res.status(500).json({ message: "Erro interno no servidor ao buscar conversas." });
    }
};

// Busca o histórico de mensagens com um usuário específico.
export const getHistoricoController = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        // Valida que o ID na URL é um número
        const outroUsuarioId = paramsIdSchema.parse(req.params.outroUsuarioId);

        const historico = await ChatModel.getHistoricoMensagens(usuarioLogadoId, parseInt(outroUsuarioId));
        res.status(200).json(historico);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "ID de usuário inválido." });
        }
        console.error("Erro ao buscar histórico de mensagens:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// Marca as mensagens de uma conversa específica como lidas.
export const marcarComoLidoController = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const remetenteId = paramsIdSchema.parse(req.params.remetenteId);

        await ChatModel.marcarMensagensComoLidas(parseInt(remetenteId), usuarioLogadoId);
        res.status(204).send(); // Ação bem-sucedida, sem conteúdo para retornar.
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "ID de remetente inválido." });
        }
        console.error("Erro ao marcar mensagens como lidas:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// Oculta/Arquiva uma conversa da lista do usuário.
export const ocultarConversaController = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const parceiroChatId = paramsIdSchema.parse(req.params.parceiroChatId);

        // Previne que o usuário tente se auto-ocultar, embora não deva acontecer.
        if (usuarioLogadoId === parseInt(parceiroChatId)) {
            return res.status(400).json({ message: "Ação inválida." });
        }
        
        await ChatModel.ocultarConversa(usuarioLogadoId, parseInt(parceiroChatId));
        res.status(200).json({ message: "Conversa ocultada com sucesso." });
    } catch (error) {
         if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "ID de usuário inválido." });
        }
        // O código P2002 indica que a relação já existe (tentativa de ocultar duas vezes).
        if (error.code === 'P2002') {
            return res.status(200).json({ message: "Conversa já estava oculta." });
        }
        console.error("Erro ao ocultar conversa:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// Busca usuários para iniciar uma nova conversa.
export const buscarUsuariosController = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ message: "Termo de busca é obrigatório." });
        }

        const usuarios = await ChatModel.buscarUsuarios(search, req.usuario.id_usuario);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: "Erro interno ao buscar usuários." });
    }
};