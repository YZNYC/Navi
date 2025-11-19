import express from 'express';
import { naviAdminController, naviProprietarioController } from '../controllers/NaviAskController.js'; 
import { 
    listarConversasController, 
    obterHistoricoController, 
    salvarConversaController 
} from '../controllers/ConversaNaviController.js'; // CORRIGIDO: A importação nomeada deve funcionar

import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js'; 

const router = express.Router();

// Aplica autenticação a TODAS as rotas da IA (Regra 2.1)
router.use(authMiddleware);

// =======================================================
// ROTAS DE INTERAÇÃO COM A IA (/api/navi/...)
// =======================================================

// Rota Admin (Global)
router.post('/navi/admin/ask', authorize(['ADMINISTRADOR']), naviAdminController);

// Rota Proprietário
router.post('/navi/proprietario/ask', authorize(['PROPRIETARIO', 'FUNCIONARIO']), naviProprietarioController);


// =======================================================
// ROTAS DE PERSISTÊNCIA (/api/conversas-navi/...)
// =======================================================

// Lista metadados das conversas (Sidebar)
router.get('/conversas-navi', listarConversasController);

// Salva ou Atualiza uma conversa
router.post('/conversas-navi/salvar', salvarConversaController);

// Obtém o histórico de uma conversa específica
router.get('/conversas-navi/:conversaId/historico', obterHistoricoController);

export default router;