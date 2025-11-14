// src/controllers/ChatController.js

import { iniciarChat, listarChatsDoUsuario, listarMensagensDoChat, criarMensagem } from '../models/Conversas.js';
import { iniciarChatSchema, enviarMensagemSchema } from '../schemas/chat.schema.js';
import { paramsSchema } from '../schemas/params.schema.js';
import prisma from '../config/prisma.js';

// Função auxiliar de permissão para iniciar um chat
async function verificarPermissaoParaChat(id_remetente, id_destinatario) {
    const usuarios = await prisma.usuario.findMany({
        where: { id_usuario: { in: [id_remetente, id_destinatario] } },
        select: { id_usuario: true, papel: true }
    });

    const remetente = usuarios.find(u => u.id_usuario === id_remetente);
    const destinatario = usuarios.find(u => u.id_usuario === id_destinatario);

    if (!remetente || !destinatario) return false; // Um dos usuários não existe

    // Um admin pode falar com qualquer um
    if (remetente.papel === 'ADMINISTRADOR' || destinatario.papel === 'ADMINISTRADOR') return true;

    // Obtém os vínculos de estacionamento de ambos
    const vinculos = await prisma.estacionamento_funcionario.findMany({
        where: { id_usuario: { in: [id_remetente, id_destinatario] } },
        select: { id_usuario: true, id_estacionamento: true }
    });

    // Encontra todos os estacionamentos em que CADA usuário trabalha
    const estacionamentosRemetente = new Set(vinculos.filter(v => v.id_usuario === id_remetente).map(v => v.id_estacionamento));
    const estacionamentosDestinatario = new Set(vinculos.filter(v => v.id_usuario === id_destinatario).map(v => v.id_estacionamento));
    
    // Regra: Se um for proprietário, o outro deve ser seu funcionário
    const ehProprietarioDoOutro = await prisma.estacionamento_funcionario.findFirst({
        where: {
            id_usuario: id_destinatario,
            estacionamento: { id_proprietario: id_remetente }
        }
    }) || await prisma.estacionamento_funcionario.findFirst({
        where: {
            id_usuario: id_remetente,
            estacionamento: { id_proprietario: id_destinatario }
        }
    });

    if (ehProprietarioDoOutro) return true;

    // Regra: Se ambos forem funcionários, devem trabalhar em pelo menos um estacionamento em comum
    for (const idEstacionamento of estacionamentosRemetente) {
        if (estacionamentosDestinatario.has(idEstacionamento)) {
            return true;
        }
    }
    
    return false;
}


export const iniciarChatController = async (req, res) => {
    try {
        const { body } = iniciarChatSchema.parse(req);
        const requisitanteId = req.usuario.id_usuario;
        const destinatarioId = body.id_destinatario;

        if (requisitanteId === destinatarioId) {
            return res.status(400).json({ message: "Você не pode iniciar um chat consigo mesmo." });
        }
        
        const temPermissao = await verificarPermissaoParaChat(requisitanteId, destinatarioId);
        if (!temPermissao) {
            return res.status(403).json({ message: "Você não tem permissão para iniciar um chat com este usuário." });
        }
        
        const { chat, criadoAgora } = await iniciarChat(requisitanteId, destinatarioId);
        
        res.status(criadoAgora ? 201 : 200).json({ message: "Chat disponível.", chat });
    } catch(error) {
        if (error.name === 'ZodError') return res.status(400).json({ errors: error.flatten().fieldErrors });
        console.error("Erro ao iniciar chat:", error);
        res.status(500).json({ message: "Erro interno." });
    }
};

export const listarMeusChatsController = async (req, res) => {
    try {
        const chats = await listarChatsDoUsuario(req.usuario.id_usuario);
        res.status(200).json(chats);
    } catch(error) {
        console.error("Erro ao listar chats:", error);
        res.status(500).json({ message: "Erro interno." });
    }
};


export const listarMensagensController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req);
        const chatId = parseInt(params.id);

        const participante = await prisma.chatparticipante.findFirst({ // NOME CORRIGIDO
            where: { id_chat: chatId, id_usuario: req.usuario.id_usuario }
        });
        if (!participante) return res.status(403).json({ message: "Acesso proibido." });

        const mensagens = await listarMensagensDoChat(chatId);
        res.status(200).json(mensagens);
    } catch(error) { if (error.name === 'ZodError') return res.status(400).json({ errors: error.flatten().fieldErrors });
        console.error("Erro ao listar mensagens:", error);
        res.status(500).json({ message: "Erro interno." });  }
};

export const enviarMensagemController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req);
        const { body } = enviarMensagemSchema.parse(req);
        const chatId = parseInt(params.id);
        
        const participante = await prisma.chatparticipante.findFirst({ // NOME CORRIGIDO
            where: { id_chat: chatId, id_usuario: req.usuario.id_usuario }
        });
        if (!participante) return res.status(403).json({ message: "Acesso proibido." });
        
        const novaMensagem = await criarMensagem(chatId, req.usuario.id_usuario, body.conteudo);
        
        const io = req.app.get('io');
        io.to(chatId.toString()).emit('receber-mensagem', novaMensagem);
        res.status(201).json(novaMensagem);
    } catch(error) { if (error.name === 'ZodError') return res.status(400).json({ errors: error.flatten().fieldErrors });
        console.error("Erro ao enviar mensagem:", error);
        res.status(500).json({ message: "Erro interno." });}
};