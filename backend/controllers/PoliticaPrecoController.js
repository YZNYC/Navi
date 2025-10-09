import { criarPoliticaPreco, listarPoliticasPorEstacionamento, obterPoliticaPorId, atualizarPoliticaPreco,  excluirPoliticaPreco} from "../models/PoliticaPreco.js";
import { obterEstacionamentoPorId } from "../models/Estacionamento.js";
import { politicaPrecoSchema } from '../schemas/politicaPreco.schema.js';
import { politicaPrecoParamsSchema } from '../schemas/params.schema.js';


const verificarPermissao = async (estacionamentoId, requisitante) => {
    if (requisitante.papel === 'ADMINISTRADOR') return true;
    
    const estacionamento = await obterEstacionamentoPorId(estacionamentoId);
    if (!estacionamento || estacionamento.id_proprietario !== requisitante.id_usuario) {
        return false;
    }
    return true;
};


export const criarPoliticaPrecoController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Garante que o ID do estacionamento na URL e os dados de preço no body são válidos.
        const { params } = politicaPrecoParamsSchema.parse(req);
        const { body } = politicaPrecoSchema.parse(req);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO: Lógica de negócio e permissão
        const temPermissao = await verificarPermissao(params.estacionamentoId, requisitante);
        if (!temPermissao) {
            return res.status(403).json({ message: "Acesso proibido. Você não gerencia este estacionamento." });
        }

        const novaPolitica = await criarPoliticaPreco(body, params.estacionamentoId);
        res.status(201).json({ message: "Política de preço criada com sucesso!", politica: novaPolitica });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao criar política de preço:", error);
        res.status(500).json({ message: "Erro interno ao criar política de preço." });
    }
};

export const listarPoliticasController = async (req, res) => {
    try {
        const { params } = politicaPrecoParamsSchema.parse(req);
        const politicas = await listarPoliticasPorEstacionamento(params.estacionamentoId);
        res.status(200).json(politicas);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de estacionamento inválido.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao listar políticas de preço:", error);
        res.status(500).json({ message: "Erro interno ao listar políticas de preço." });
    }
};

export const atualizarPoliticaController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO
        const { params } = politicaPrecoParamsSchema.parse(req);
        const { body } = politicaPrecoSchema.parse(req);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO
        const politicaAlvo = await obterPoliticaPorId(params.politicaId);
        if (!politicaAlvo) {
            return res.status(404).json({ message: "Política de preço não encontrada." });
        }

        const temPermissao = await verificarPermissao(politicaAlvo.id_estacionamento, requisitante);
        if (!temPermissao) {
            return res.status(403).json({ message: "Acesso proibido. Você não pode alterar esta política de preço." });
        }

        const politicaAtualizada = await atualizarPoliticaPreco(params.politicaId, body);
        res.status(200).json({ message: "Política de preço atualizada com sucesso!", politica: politicaAtualizada });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao atualizar política de preço:", error);
        res.status(500).json({ message: "Erro interno ao atualizar política de preço." });
    }
};

export const excluirPoliticaController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO
        const { params } = politicaPrecoParamsSchema.parse(req);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO
        const politicaAlvo = await obterPoliticaPorId(params.politicaId);
        if (!politicaAlvo) {
            return res.status(404).json({ message: "Política de preço não encontrada." });
        }

        const temPermissao = await verificarPermissao(politicaAlvo.id_estacionamento, requisitante);
        if (!temPermissao) {
            return res.status(403).json({ message: "Acesso proibido. Você não pode excluir esta política de preço." });
        }

        await excluirPoliticaPreco(params.politicaId);
        res.status(204).send();
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao excluir política de preço:", error);
        res.status(500).json({ message: "Erro interno ao excluir política de preço." });
    }
};