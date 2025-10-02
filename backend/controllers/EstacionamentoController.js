import { listarEstacionamentos, obterEstacionamentoPorId, criarEstacionamento, atualizarEstacionamento, excluirEstacionamento } from "../models/Estacionamento.js";

const listarEstacionamentoController = async (req, res) => {
    try {
        const estacionamentos = await listarEstacionamentos();
        res.status(200).send(estacionamentos);
    } catch (error) {
        console.error('Erro ao listar estacionamentos:', error);
        res.status(500).json({ message: 'Erro ao listar estacionamentos!' });
    }
};

const obterEstacionamentoPorIdController = async (req, res) => {
    try {
        const estacionamento = await obterEstacionamentoPorId(req.params.id);
        if (estacionamento) {
            res.status(200).json(estacionamento);
        } else {
            res.status(404).json({ message: 'Estacionamento não encontrado!' });
        }
    } catch (error) {
        console.error('Erro ao obter estacionamento pelo ID:', error);
        res.status(500).json({ message: 'Erro ao obter estacionamento!' });
    }
};

const criarEstacionamentoController = async (req, res) => {
    try {
        const { id_estacionamento, nome, endereco, tarifas, horarios } = req.body;

        const estacionamentoData = {
            id_estacionamento: id_estacionamento,
            nome: nome,
            endereco: endereco,
            tarifas: tarifas,
            horarios: horarios
        };

        const estacionamentoId = await criarEstacionamento(estacionamentoData);
        res.status(201).json({ message: 'Estacionamento criado com sucesso!', estacionamentoId });
    } catch (error) {
        console.error('Erro ao criar estacionamento:', error);
        res.status(500).json({ message: 'Erro ao criar estacionamento!' });
    }
};

const atualizarEstacionamentoController = async (req, res) => {
    try {
        const estacionamentoId = req.params.id;
        const { id_estacionamento, nome, endereco, tarifas, horarios } = req.body;

        const estacionamentoData = {
            id_estacionamento: id_estacionamento,
            nome: nome,
            endereco: endereco,
            tarifas: tarifas,
            horarios: horarios
        };

        await atualizarEstacionamento(estacionamentoId, estacionamentoData);
        res.status(200).json({ message: 'Estacionamento atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar estacionamento:', error);
        res.status(500).json({ message: 'Erro ao atualizar estacionamento!' });
    }
};

const excluirEstacionamentoController = async (req, res) => {
    try {
        const estacionamentoId = req.params.id;
        await excluirEstacionamento(estacionamentoId);
        res.status(200).json({ message: 'Estacionamento excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir estacionamento:', error);
        if (error.message === 'Registro não encontrado') {
            return res.status(404).json({ message: 'Estacionamento não encontrado!' });
        }
        res.status(500).json({ message: 'Erro ao excluir estacionamento!' });
    }
};

export { listarEstacionamentoController, obterEstacionamentoPorIdController, criarEstacionamentoController, atualizarEstacionamentoController, excluirEstacionamentoController };