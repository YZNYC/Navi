// src/routes/relatorioRoutes.js
import express from 'express';
import { obterKpisController } from '../controllers/RelatorioController.js';
import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js';

const router = express.Router();

// Proteção: Apenas Administradores podem acessar relatórios
router.use(authMiddleware, authorize(['ADMINISTRADOR']));

router.get('/kpis', obterKpisController);

export default router;

// Lembre-se de adicionar essa rota ao seu arquivo principal (ex: app.js ou server.js)
// app.use('/api/relatorios', relatorioRoutes);