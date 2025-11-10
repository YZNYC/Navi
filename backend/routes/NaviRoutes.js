// src/routes/naviRoutes.js

import express from 'express';
import { naviProprietarioController } from '../controllers/NaviProprietarioController.js'; 
import { naviAdminController } from '../controllers/NaviAdminController.js';
import { authMiddleware, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.use(authMiddleware);

// ROTA DA IA GLOBAL (ADMINISTRADOR)
router.post('/admin/ask', authorize(['ADMINISTRADOR']), naviAdminController);

// ROTA DA IA POR ESTACIONAMENTO (PROPRIETARIO)
router.post('/proprietario/ask', authorize(['PROPRIETARIO']), naviProprietarioController);

export default router;