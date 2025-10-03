import express from 'express';
import { listarEstacionamentoController, obterEstacionamentoPorIdController, criarEstacionamentoController, atualizarEstacionamentoController, excluirEstacionamentoController} from '../controllers/EstacionamentoController.js';
import { authMiddleware, authorize } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Rotas públicas - Todos podem ver

// Rota para listar todos os estacionamentos
router.get('/', listarEstacionamentoController);

// Rota para obter um estacionamento específico pelo ID 
router.get('/:id', obterEstacionamentoPorIdController);

// Rotas de gestão - Protegidas para PROPRIETARIO ou ADMINISTRADOR
const permissoesDeGestao = ['PROPRIETARIO', 'ADMINISTRADOR'];

// Rota para criar um novo estacionamento
router.post('/', authMiddleware, authorize(permissoesDeGestao), criarEstacionamentoController);

// Rota para atualizar um estacionamento existente por ID
router.put('/:id', authMiddleware, authorize(permissoesDeGestao), atualizarEstacionamentoController);

// Rota para excluir um estacionamento por ID
router.delete('/:id', authMiddleware, authorize(permissoesDeGestao), excluirEstacionamentoController);

export default router;