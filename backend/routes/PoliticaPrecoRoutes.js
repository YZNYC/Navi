import express from 'express';
import { criarPoliticaPrecoController, listarPoliticasController, atualizarPoliticaController, excluirPoliticaController } from '../controllers/PoliticaPrecoController.js';
import { authMiddleware, authorize } from '../middlewares/AuthMiddlewares.js';

// Usamos mergeParams para acessar o :estacionamentoId da rota pai
const router = express.Router({ mergeParams: true }); 

const permissoesDeGestao = ['PROPRIETARIO', 'ADMINISTRADOR'];

// Rota pública para listar as políticas de um estacionamento
router.get('/', listarPoliticasController);

// Rota para criar uma nova política. Precisa estar autenticado e ter o papel certo.
router.post('/', authMiddleware, authorize(permissoesDeGestao), criarPoliticaPrecoController);

// A partir daqui, as rotas precisam do ID da política específica.
router.put('/:politicaId', authMiddleware, authorize(permissoesDeGestao), atualizarPoliticaController);
router.delete('/:politicaId', authMiddleware, authorize(permissoesDeGestao), excluirPoliticaController);

export default router;