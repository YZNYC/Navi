import express from 'express'
import { listarVagasController, obterVagasPorIdController, criarVagaController, atualizarVagaController, excluirVagaController } from '../controllers/VagaController.js'
// import authMiddleware from '../middlewares/authMiddleware.js' //--> descomentar qnd criar autenticação


const router = express.Router()

router.get('/', listarVagasController)  //--> listar todas as vagas (adicionar authMiddleware dps)

router.post('/', criarVagaController)   //--> cadastrar nova vaga (adicionar authMiddleware dps e verificar se é dono do estacionamento)

router.get('/:id', obterVagasPorIdController)   //--> listar vaga por id (adicionar authMiddleware dps)

router.put('/:id', atualizarVagaController) //--> atualizar nova vaga (adicionar authMiddleware dps e verificar se é dono do estacionamento)

router.delete('/:id', excluirVagaController)    //--> atualizar nova vaga (adicionar authMiddleware dps e verificar se é dono do estacionamento)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.status(204).send()
})

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS')
    res.status(204).send()
})

export default router