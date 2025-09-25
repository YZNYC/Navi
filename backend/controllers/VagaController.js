import { listarVagas, obterVagasPorId, criarVaga, atualizarVaga, excluirVaga } from "../models/Vaga.js";

const listarVagasController = async (req, res) => {
    try {
        const vagas = await listarVagas();
        res.status(200).send(vagas)
    } catch (error) {
        console.error('Erro ao listar as vagas:', error)
        res.status(500).json({ message: 'Erro ao listar vagas!' })
    }
}

const obterVagasPorIdController = async (req, res) => {
    try {
        const vaga = await obterVagasPorId(req.params.id)
        if (vaga) {
            res.status(200).json(vaga)
        } else {
            res.status(404).json({ message: 'Vaga não encontrada!' })
        }
    } catch (error) {
        console.error('Erro ao listar a vaga pelo ID:', error)
        res.status(500).json({ message: 'Erro ao listar vagas!' })
    }
}

const criarVagaController = async (req, res) => {
    try {
        const { id_estacionamento, numero } = req.body

        const vagaData = {
            id_estacionamento: id_estacionamento,
            numero: numero
        }
        const vagaId = await criarVaga(vagaData)
        res.status(201).json({ message: 'Vaga criada com sucesso!', vagaId })
    } catch (error) {
        console.error('Erro ao criar vaga: ', error)
        res.status(500).json({ message: 'Erro ao criar vaga!' })
    }
}

const atualizarVagaController = async (req, res) => {
    try {
        const vagaId = req.params.id
        const { id_estacionamento, numero } = req.body

        const vagaData = {
            id_estacionamento: id_estacionamento,
            numero: numero,
        }
        await atualizarVaga(vagaId, vagaData)
        res.status(200).json({ message: 'Vaga atualizada com sucesso!' })
    } catch (error) {
        console.error('Erro ao atualizar vaga: ', error)
        res.status(500).json({ message: 'Erro ao atualizar a vaga!' })
    }
}

const excluirVagaController = async (req, res) => {
    try {
        const vagaId = req.params.id
        await excluirVaga(vagaId)
        res.status(200).json({ message: 'Vaga excluída com sucesso!' })
    } catch (error) {
        console.error('Erro ao excluir vaga: ', error)
        res.status(500).json({ message: 'Erro ao excluir vaga!' })
    }
}

export { listarVagasController, obterVagasPorIdController, criarVagaController, atualizarVagaController, excluirVagaController }