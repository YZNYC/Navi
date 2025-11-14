import { Router } from 'express';

import {

  listarConversas,

  obterHistorico,

  salvarConversa

} from '../controllers/ConversaNaviController.js';



// Importe seu middleware

import { authMiddleware } from '../middlewares/AuthMiddlewares.js';



const router = Router();



// [CORREÇÃO-CHAVE]: Aplica o middleware de autenticação a TODAS as rotas deste arquivo.

// Chame-o sem parênteses para passar a função em si, e não o resultado da sua execução.

router.use(authMiddleware);



// Agora, todas as rotas abaixo só serão acessíveis se o token for válido.



// GET /api/conversas-navi/ -> Listar todas as conversas do usuário

router.get('/', listarConversas);



// GET /api/conversas-navi/:id/historico -> Obter histórico de uma conversa

router.get('/:id/historico', obterHistorico);



// POST /api/conversas-navi/salvar -> Salvar ou criar uma conversa

router.post('/salvar', salvarConversa);

export default router; 