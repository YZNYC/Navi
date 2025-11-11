// src/routes/chatRoutes.js

import express from 'express';
import {
    getConversasController,
    getHistoricoController,
    marcarComoLidoController,
    ocultarConversaController,
    buscarUsuariosController
} from '../controllers/ChatController.js';
import { authMiddleware } from '../middlewares/AuthMiddlewares.js'; // Ajuste o nome se necessário

const router = express.Router();

// ---- PROTEÇÃO GLOBAL ----
// Todas as rotas do chat exigem que o usuário esteja autenticado.
router.use(authMiddleware);


// ---- ROTAS PRINCIPAIS DO CHAT ----

// GET /chat/conversations
// Retorna a lista de todas as conversas do usuário logado.
router.get('/conversations', getConversasController);

// GET /chat/users?search=termo
// Busca usuários na plataforma pelo nome.
router.get('/users', buscarUsuariosController);

// GET /chat/history/:outroUsuarioId
// Retorna o histórico de mensagens entre o usuário logado e outro usuário.
router.get('/history/:outroUsuarioId', getHistoricoController);

// PUT /chat/messages/mark-as-read/:remetenteId
// Marca todas as mensagens recebidas de um remetente como lidas.
router.put('/messages/mark-as-read/:remetenteId', marcarComoLidoController);

// DELETE /chat/conversations/:parceiroChatId
// Oculta (arquiva) a conversa com um usuário específico.
router.delete('/conversations/:parceiroChatId', ocultarConversaController);


export default router;