import express from 'express';
import {  listarEstacionamentoController,  obterEstacionamentoPorIdController,  criarEstacionamentoController,  atualizarEstacionamentoController,excluirEstacionamentoController} from '../controllers/EstacionamentoController.js';
import { listarReservasDeEstacionamentoController } from '../controllers/ReservaController.js';
import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js';
import politicaPrecoRoutes from './politicaPrecoRoutes.js';

const router = express.Router();
const permissoesDeGestao = ['PROPRIETARIO', 'ADMINISTRADOR'];

// ROTAS PÚBLICAS PARA CONSULTA 
router.get('/', listarEstacionamentoController);
router.get('/:id', obterEstacionamentoPorIdController);


// ROTAS PROTEGIDAS PARA GESTÃO DE ESTACIONAMENTOS 
router.post('/', authMiddleware, authorize(permissoesDeGestao), criarEstacionamentoController);
router.put('/:id', authMiddleware, authorize(permissoesDeGestao), atualizarEstacionamentoController);
router.delete('/:id', authMiddleware, authorize(permissoesDeGestao), excluirEstacionamentoController);


// ANINHAMENTO DE ROTAS FILHAS 

// Delega rotas de políticas de preço para seu próprio roteador
router.use('/:estacionamentoId/politicas', politicaPrecoRoutes);

// Adiciona rota aninhada para listar as reservas de um estacionamento
router.get('/:estacionamentoId/reservas', authMiddleware, authorize(permissoesDeGestao), listarReservasDeEstacionamentoController);


export default router;