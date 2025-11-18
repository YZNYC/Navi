// routes/NaviRouter.js

import express from 'express';
import { naviAdminController, naviProprietarioController } from '../controllers/NaviAskController.js';
import { listarConversasController, obterHistoricoController, salvarConversaController } from '../controllers/ConversaNaviController.js';
import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js'; 

const router = express.Router();

// Aplica autenticação a TODAS as rotas da IA (Regra 2.1)
router.use(authMiddleware);

// =======================================================
// ROTAS DE INTERAÇÃO COM A IA (/api/navi/...)
// =======================================================

// Rota Admin (Global) - Agora o authorize está no escopo
router.post('/admin/ask', authorize(['ADMINISTRADOR']), naviAdminController);

// Rota Proprietário (Específico) - Agora o authorize está no escopo
router.post('/proprietario/ask', authorize(['PROPRIETARIO', 'FUNCIONARIO']), naviProprietarioController);


// =======================================================
// ROTAS DE PERSISTÊNCIA (/api/conversas-navi/...)
// Essas rotas já usam o authMiddleware acima, o que é suficiente.
// =======================================================

// Lista metadados das conversas (Sidebar)
router.get('/conversas-navi', listarConversasController);

// Salva ou Atualiza uma conversa
router.post('/conversas-navi/salvar', salvarConversaController);

// Obtém o histórico de uma conversa específica
router.get('/conversas-navi/:conversaId/historico', obterHistoricoController);

export default router;