// src/routes/estacionamentoRoutes.js

import express from 'express';
import {
    listarEstacionamentoController,  
    obterEstacionamentoPorIdController,  
    criarEstacionamentoController,  
    atualizarEstacionamentoController,
    excluirEstacionamentoController,
    listarMeusEstacionamentosController
} from '../controllers/EstacionamentoController.js';
import { listarVagasPorEstacionamentoController } from '../controllers/VagaController.js';
import { listarReservasDeEstacionamentoController } from '../controllers/ReservaController.js';
import { listarContratosDeEstacionamentoController } from '../controllers/ContratoController.js';
import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js';

// Importação dos roteadores filhos
import politicaPrecoRoutes from './politicaPrecoRoutes.js';
import planoMensalRoutes from './PlanoMensalRoutes.js';
import avaliacaoRoutes from './avaliacaoRoutes.js';
import funcionarioRoutes from './FuncionariosRoutes.js';

const router = express.Router();
const permissoesDeGestao = ['PROPRIETARIO', 'ADMINISTRADOR'];

// ---- Rotas do Estacionamento ----
router.get('/', listarEstacionamentoController);
router.get('/meus', authMiddleware, authorize(permissoesDeGestao), listarMeusEstacionamentosController);
router.get('/:id', obterEstacionamentoPorIdController);
router.post('/', authMiddleware, authorize(permissoesDeGestao), criarEstacionamentoController);
router.put('/:id', authMiddleware, authorize(permissoesDeGestao), atualizarEstacionamentoController);
router.delete('/:id', authMiddleware, authorize(permissoesDeGestao), excluirEstacionamentoController);

// ---- Rotas Aninhadas ----
router.get('/:estacionamentoId/vagas', authMiddleware, authorize(permissoesDeGestao), listarVagasPorEstacionamentoController);
router.get('/:estacionamentoId/reservas', authMiddleware, authorize(permissoesDeGestao), listarReservasDeEstacionamentoController);
router.get('/:estacionamentoId/contratos', authMiddleware, authorize(permissoesDeGestao), listarContratosDeEstacionamentoController);

// ---- Roteadores Aninhados Delegados ----
router.use('/:estacionamentoId/politicas', politicaPrecoRoutes);
router.use('/:estacionamentoId/planos', planoMensalRoutes);
router.use('/:estacionamentoId/avaliacoes', avaliacaoRoutes);
router.use('/:estacionamentoId/funcionarios', funcionarioRoutes);

export default router;