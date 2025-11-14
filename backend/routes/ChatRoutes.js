// src/routes/chatRoutes.js
import express from 'express';
import {
    iniciarChatController,
    listarMeusChatsController,
    listarMensagensController,
    enviarMensagemController
} from '../controllers/ChatController.js';
import { authMiddleware } from '../middlewares/AuthMiddlewares.js';

const router = express.Router();

// Todas as rotas de chat são protegidas e exigem um usuário logado.
router.use(authMiddleware);

router.post('/iniciar', iniciarChatController);       // Inicia uma conversa com outro usuário
router.get('/', listarMeusChatsController);               // Lista todos os chats do usuário (caixa de entrada)
router.get('/:id/mensagens', listarMensagensController);    // Lista todas as mensagens de um chat específico
router.post('/:id/mensagens', enviarMensagemController); // Envia uma nova mensagem para um chat

export default router;
