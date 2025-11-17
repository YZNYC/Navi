import { Router } from 'express';

import { askAdmin, askProprietario } from '../controllers/NaviController.js';

// [CORREÇÃO-CHAVE]: Importando ambos os middlewares

import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js';



const router = Router();



// Rota para o PROPRIETÁRIO

router.post(

  '/proprietario/ask',

  // [CORREÇÃO-CHAVE]: Usando os middlewares em sequência

  authMiddleware, // 1. Primeiro, verifica se o token é válido. É chamado sem () porque é um middleware direto.

  authorize(['PROPRIETARIO', 'GESTOR']), // 2. Depois, verifica se o usuário tem o papel correto.

  askProprietario // 3. Se ambos passarem, executa o controller.

);



// Rota para o ADMIN

router.post(

  '/admin/ask',

  authMiddleware, // 1. Verifica se está autenticado

  authorize(['ADMINISTRADOR']), // 2. Verifica se é um administrador

  askAdmin // 3. Executa o controller

);



export default router;