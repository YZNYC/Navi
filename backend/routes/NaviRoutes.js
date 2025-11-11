// src/routes/ConversaNaviRoutes.js (Adicionar rota de salvar)

import express from 'express';
import { authMiddleware } from '../middlewares/AuthMiddlewares.js';
import { listarConversasController, obterHistoricoController, salvarConversaController } from '../controllers/ConversaNaviController.js';

const router = express.Router();

router.use(authMiddleware);

// Lista todas as conversas do usuário logado
router.get('/', listarConversasController);

// Obtém o histórico de uma conversa específica
router.get('/:conversaId/historico', obterHistoricoController);

// Salva ou atualiza uma conversa
router.post('/salvar', salvarConversaController); // <--- ROTA CRUCIAL

export default router;