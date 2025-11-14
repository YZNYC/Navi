// src/routes/chatRoutes.js

import express from 'express';
import {
    getConversasController,
    getHistoricoController,
    marcarComoLidoController,
    ocultarConversaController,
    buscarUsuariosController
} from '../controllers/ChatController.js';
import { authMiddleware } from '../middlewares/AuthMiddlewares.js';

const router = express.Router();

// -----------------------------------------------------------------------------
// SEGURANÇA GLOBAL DO CHAT
// -----------------------------------------------------------------------------
// O middleware 'authMiddleware' é aplicado a TODAS as rotas definidas neste arquivo.
// Nenhuma função do chat pode ser acessada sem um token JWT válido.
router.use(authMiddleware);


// -----------------------------------------------------------------------------
// DEFINIÇÃO DAS ROTAS HTTP
// -----------------------------------------------------------------------------

// MÉTODO: GET
// ROTA: /chat/conversations
// FUNÇÃO: Retorna a lista de todas as conversas do usuário autenticado.
router.get('/conversations', getConversasController);

// MÉTODO: GET
// ROTA: /chat/users?search=termo_de_busca
// FUNÇÃO: Procura por outros usuários na plataforma para iniciar uma nova conversa.
router.get('/users', buscarUsuariosController);

// MÉTODO: GET
// ROTA: /chat/history/:outroUsuarioId
// FUNÇÃO: Retorna o histórico completo de mensagens com um usuário específico.
router.get('/history/:outroUsuarioId', getHistoricoController);

// MÉTODO: PUT
// ROTA: /chat/messages/mark-as-read/:remetenteId
// FUNÇÃO: Marca todas as mensagens recebidas de um remetente como lidas.
router.put('/messages/mark-as-read/:remetenteId', marcarComoLidoController);

// MÉTODO: DELETE
// ROTA: /chat/conversations/:parceiroChatId
// FUNÇÃO: "Esconde" ou "arquiva" a conversa com um usuário da lista principal.
router.delete('/conversations/:parceiroChatId', ocultarConversaController);


export default router;