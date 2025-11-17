import express from 'express';
import {  listarEstacionamentoController,  obterEstacionamentoPorIdController,  criarEstacionamentoController,  atualizarEstacionamentoController,excluirEstacionamentoController, listarMeusEstacionamentosController} from '../controllers/EstacionamentoController.js';
import { listarReservasDeEstacionamentoController } from '../controllers/ReservaController.js';
import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js';
import politicaPrecoRoutes from './politicaPrecoRoutes.js';
import planoMensalRoutes from './PlanoMensalRoutes.js';
import { listarContratosDeEstacionamentoController } from '../controllers/ContratoController.js'; 
import avaliacaoRoutes from './AvaliacaoRoutes.js';
import funcionarioRoutes from './FuncionariosRoutes.js';
import { listarVagasPorEstacionamentoController } from '../controllers/VagaController.js';
import { getDashboardProprietario } from '../controllers/RelatorioController.js'; // <-- Importe

const router = express.Router();
const permissoesDeGestao = ['PROPRIETARIO', 'ADMINISTRADOR'];

// ROTAS PÚBLICAS PARA CONSULTA 
router.get('/', listarEstacionamentoController);
router.get('/meus', authMiddleware, listarMeusEstacionamentosController);
router.get('/:id', obterEstacionamentoPorIdController);
router.get('/:estacionamentoId/vagas', listarVagasPorEstacionamentoController);

// ROTAS PROTEGIDAS PARA GESTÃO DE ESTACIONAMENTOS 
router.post('/', authMiddleware, authorize(permissoesDeGestao), criarEstacionamentoController);

// ROTA PUT (Atualização completa)
router.put('/:id', authMiddleware, authorize(permissoesDeGestao), atualizarEstacionamentoController);

// 🚨 ROTA PATCH ADICIONADA (Para Atualização Parcial, como status 'ativo')
router.patch('/:id', authMiddleware, authorize(permissoesDeGestao), atualizarEstacionamentoController); 

router.delete('/:id', authMiddleware, authorize(permissoesDeGestao), excluirEstacionamentoController);


// ANINHAMENTO DE ROTAS FILHAS 

router.get('/:estacionamentoId/dashboard', authMiddleware, authorize(permissoesDeGestao), getDashboardProprietario);

// Delega rotas de políticas de preço para seu próprio roteador
router.use('/:estacionamentoId/politicas', politicaPrecoRoutes);

// Adiciona rota aninhada para listar as reservas de um estacionamento
router.get('/:estacionamentoId/reservas', authMiddleware, authorize(permissoesDeGestao), listarReservasDeEstacionamentoController);

// Rotas de planos mensais
router.use('/:estacionamentoId/planos', planoMensalRoutes);

// Rotas de contratos
router.get('/:estacionamentoId/contratos', authMiddleware, authorize(permissoesDeGestao), listarContratosDeEstacionamentoController);

// Rotas de Avaliação
router.use('/:estacionamentoId/avaliacoes', avaliacaoRoutes);

// Rotas de Funcionarios
router.use('/:estacionamentoId/funcionarios', funcionarioRoutes);

export default router;