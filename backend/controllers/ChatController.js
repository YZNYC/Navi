// src/controllers/ChatController.js

import * as ChatModel from '../models/conversas.js';

// Busca a lista de conversas do usuário autenticado.
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
        const outroUsuarioId = parseInt(req.params.outroUsuarioId);

        if (isNaN(outroUsuarioId)) {
            return res.status(400).json({ message: "ID de usuário inválido." });
        }

        const historico = await ChatModel.getHistoricoMensagens(usuarioLogadoId, outroUsuarioId);
        res.status(200).json(historico);
    } catch (error) {
        console.error("Erro ao buscar histórico de mensagens:", error);
        res.status(500).json({ message: "Erro interno no servidor ao buscar histórico." });
    }
};

// Marca as mensagens de uma conversa como lidas.
export const marcarComoLidoController = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const remetenteId = parseInt(req.params.remetenteId);

        if (isNaN(remetenteId)) {
            return res.status(400).json({ message: "ID de remetente inválido." });
        }

        await ChatModel.marcarMensagensComoLidas(remetenteId, usuarioLogadoId);
        res.status(204).send(); // 204 No Content, pois não há nada a retornar.
    } catch (error) {
        console.error("Erro ao marcar mensagens como lidas:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// Oculta/Arquiva uma conversa da lista do usuário.
export const ocultarConversaController = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const parceiroChatId = parseInt(req.params.parceiroChatId);

        if (isNaN(parceiroChatId)) {
            return res.status(400).json({ message: "ID de usuário inválido." });
        }

        await ChatModel.ocultarConversa(usuarioLogadoId, parceiroChatId);
        res.status(200).json({ message: "Conversa ocultada com sucesso." });
    } catch (error) {
        console.error("Erro ao ocultar conversa:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// Busca usuários para iniciar uma nova conversa.
export const buscarUsuariosController = async (req, res) => {
    try {
        const { search } = req.query; // Pega o termo da query string (ex: /chat/usuarios?search=Joao)
        const usuarioLogadoId = req.usuario.id_usuario;
        
        if (!search) {
            return res.status(400).json({ message: "Termo de busca é obrigatório." });
        }

        const usuarios = await ChatModel.buscarUsuarios(search, usuarioLogadoId);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: "Erro interno ao buscar usuários." });
    }
};