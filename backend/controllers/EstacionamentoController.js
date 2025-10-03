import { criarEstacionamento, atualizarEstacionamento, excluirEstacionamento, listarEstacionamentos, obterEstacionamentoPorId } from "../models/Estacionamento.js";

// Rota pública para listar todos os estacionamentos
export const listarEstacionamentoController = async (req, res) => {
    try {
        const estacionamentos = await listarEstacionamentos();
        res.status(200).json(estacionamentos);
    } catch (error) {
        console.error('Erro ao listar estacionamentos:', error);
        res.status(500).json({ message: 'Erro interno ao listar estacionamentos.' });
    }
};

// Rota pública para obter um estacionamento específico
export const obterEstacionamentoPorIdController = async (req, res) => {
    try {
        const estacionamento = await obterEstacionamentoPorId(req.params.id);
        if (estacionamento) {
            res.status(200).json(estacionamento);
        } else {
            res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao obter estacionamento pelo ID:', error);
        res.status(500).json({ message: 'Erro interno ao obter estacionamento.' });
    }
};

// Cria um estacionamento, associando-o ao proprietário logado.
export const criarEstacionamentoController = async (req, res) => {
    try {
        const proprietarioId = req.usuario.id_usuario; // ID do usuário do token
        const dadosDoCorpo = req.body;

        // Garante que o estacionamento seja associado ao usuário autenticado
        const dadosComProprietario = { ...dadosDoCorpo, id_proprietario: proprietarioId };

        const novoEstacionamento = await criarEstacionamento(dadosComProprietario);
        res.status(201).json({ message: 'Estacionamento criado com sucesso!', estacionamento: novoEstacionamento });
    } catch (error) {
        console.error('Erro ao criar estacionamento:', error);
        res.status(500).json({ message: 'Erro interno ao criar estacionamento.' });
    }
};

// Atualiza um estacionamento após verificar a posse.
export const atualizarEstacionamentoController = async (req, res) => {
    try {
        const estacionamentoId = parseInt(req.params.id);
        const requisitante = req.usuario; 

        const estacionamentoAlvo = await obterEstacionamentoPorId(estacionamentoId);
        if (!estacionamentoAlvo) {
            return res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }

        // Apenas o dono ou um admin pode atualizar.
        if (estacionamentoAlvo.id_proprietario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: 'Acesso proibido. Você não é o proprietário deste estacionamento.' });
        }

        const estacionamentoAtualizado = await atualizarEstacionamento(estacionamentoId, req.body);
        res.status(200).json({ message: 'Estacionamento atualizado com sucesso!', estacionamento: estacionamentoAtualizado });
    } catch (error) {
        console.error('Erro ao atualizar estacionamento:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar estacionamento.' });
    }
};

// Exclui um estacionamento após verificar a posse.
export const excluirEstacionamentoController = async (req, res) => {
    try {
        const estacionamentoId = parseInt(req.params.id);
        const requisitante = req.usuario;

        const estacionamentoAlvo = await obterEstacionamentoPorId(estacionamentoId);
        if (!estacionamentoAlvo) {
            return res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }

        // Apenas o dono ou um admin pode excluir.
        if (estacionamentoAlvo.id_proprietario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: 'Acesso proibido. Você não é o proprietário deste estacionamento.' });
        }

        await excluirEstacionamento(estacionamentoId);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir estacionamento:', error);
        res.status(500).json({ message: 'Erro interno ao excluir estacionamento.' });
    }
};