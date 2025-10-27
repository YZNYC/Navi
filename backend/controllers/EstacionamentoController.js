import {  criarEstacionamento,  atualizarEstacionamento,  excluirEstacionamento,  listarEstacionamentos,  obterEstacionamentoPorId} from "../models/Estacionamento.js";
import { criarEstacionamentoSchema, atualizarEstacionamentoSchema } from '../schemas/estacionamento.schema.js';
import { paramsSchema } from '../schemas/params.schema.js';

export const listarEstacionamentoController = async (req, res) => {
    try {
        const estacionamentos = await listarEstacionamentos();
        res.status(200).json(estacionamentos);
    } catch (error) {
        console.error('Erro ao listar estacionamentos:', error);
        res.status(500).json({ message: 'Erro interno ao listar estacionamentos.' });
    }
};

export const obterEstacionamentoPorIdController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req); // Valida se o ID na URL é um número
        const estacionamento = await obterEstacionamentoPorId(params.id);
        
        if (estacionamento) {
            res.status(200).json(estacionamento);
        } else {
            res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de estacionamento inválido.", errors: error.flatten().fieldErrors });
        }
        console.error('Erro ao obter estacionamento pelo ID:', error);
        res.status(500).json({ message: 'Erro interno ao obter estacionamento.' });
    }
};

export const criarEstacionamentoController = async (req, res) => {
    try {
        const { body } = criarEstacionamentoSchema.parse(req);
        const proprietarioId = req.usuario.id_usuario;

        const response = await fetch(`https://viacep.com.br/ws/${body.cep.replace('-', '')}/json/`);
        if (!response.ok) {
            return res.status(400).json({ message: "CEP inválido ou não encontrado." });
        }
        const endereco = await response.json();
        if (endereco.erro) {
            return res.status(400).json({ message: "CEP inválido ou não encontrado." });
        }

        const dadosCompletos = {
            ...body, 
            rua: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.localidade,
            id_proprietario: proprietarioId,
        };

        const novoEstacionamento = await criarEstacionamento(dadosCompletos);
        res.status(201).json({ message: 'Estacionamento criado com sucesso!', estacionamento: novoEstacionamento });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Conflito: Já existe um estacionamento com este CNPJ, endereço ou localização." });
        }
    }
};

export const atualizarEstacionamentoController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Valida tanto o ID na URL quanto os campos no body
        const { params } = paramsSchema.parse(req);
        const { body } = atualizarEstacionamentoSchema.parse(req);
        const estacionamentoId = parseInt(params.id);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO: Lógica de negócio e permissão
        const estacionamentoAlvo = await obterEstacionamentoPorId(estacionamentoId);
        if (!estacionamentoAlvo) {
            return res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }

        if (estacionamentoAlvo.id_proprietario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: 'Acesso proibido. Você não é o proprietário deste estacionamento.' });
        }

        const estacionamentoAtualizado = await atualizarEstacionamento(estacionamentoId, body);
        res.status(200).json({ message: 'Estacionamento atualizado com sucesso!', estacionamento: estacionamentoAtualizado });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error('Erro ao atualizar estacionamento:', error);
        res.status(500).json({ message: 'Erro ao atualizar estacionamento.' });
    }
};

export const excluirEstacionamentoController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Valida o ID na URL
        const { params } = paramsSchema.parse(req);
        const estacionamentoId = parseInt(params.id);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO: Lógica de negócio e permissão
        const estacionamentoAlvo = await obterEstacionamentoPorId(estacionamentoId);
        if (!estacionamentoAlvo) {
            return res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }

        if (estacionamentoAlvo.id_proprietario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: 'Acesso proibido. Você não é o proprietário deste estacionamento.' });
        }

        await excluirEstacionamento(estacionamentoId);
        res.status(204).send();
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de estacionamento inválido.", errors: error.flatten().fieldErrors });
        }
        console.error('Erro ao excluir estacionamento:', error);
        res.status(500).json({ message: 'Erro ao excluir estacionamento.' });
    }
};