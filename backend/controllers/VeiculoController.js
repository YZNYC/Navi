import { criarVeiculo, listarVeiculosPorUsuario, obterVeiculoPorId, atualizarVeiculo, excluirVeiculo } from "../models/Veiculo.js";
import { criarVeiculoSchema, atualizarVeiculoSchema } from '../schemas/veiculo.schema.js';
import { paramsSchema } from '../schemas/params.schema.js';


export const criarVeiculoController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Garante que os dados do veículo no body estão corretos.
        const { body } = criarVeiculoSchema.parse(req);
        const usuarioId = req.usuario.id_usuario;

        // 2. EXECUÇÃO: Prossegue com a criação do veículo.
        const novoVeiculo = await criarVeiculo(body, usuarioId);
        res.status(201).json({ message: "Veículo cadastrado com sucesso!", veiculo: novoVeiculo });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        if (error.code === 'P2002' && error.meta?.target.includes('placa')) {
            return res.status(409).json({ message: 'A placa informada já está cadastrada.' });
        }
        console.error("Erro ao criar veículo:", error);
        res.status(500).json({ message: "Erro interno ao cadastrar veículo." });
    }
};

export const listarVeiculosController = async (req, res) => {
    try {
        let usuarioId = req.usuario.id_usuario;

        // Regra: Se for admin e passar `usuarioId` na query, pode ver veículos de outros.
        if (req.usuario.papel === 'ADMINISTRADOR' && req.query.usuarioId) {
            usuarioId = parseInt(req.query.usuarioId);
        }

        const veiculos = await listarVeiculosPorUsuario(usuarioId);
        res.status(200).json(veiculos);
    } catch (error) {
        console.error("Erro ao listar veículos:", error);
        res.status(500).json({ message: "Erro interno ao listar veículos." });
    }
};

export const obterVeiculoPorIdController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO
        const { params } = paramsSchema.parse(req);
        const veiculoId = parseInt(params.id);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO
        const veiculo = await obterVeiculoPorId(veiculoId);
        if (!veiculo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }

        if (veiculo.id_usuario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Este veículo não pertence a você." });
        }
        res.status(200).json(veiculo);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de veículo inválido.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao obter veículo:", error);
        res.status(500).json({ message: "Erro interno ao obter veículo." });
    }
};

export const atualizarVeiculoController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO
        const { params } = paramsSchema.parse(req);
        const { body } = atualizarVeiculoSchema.parse(req);
        const veiculoId = parseInt(params.id);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO
        const veiculoAlvo = await obterVeiculoPorId(veiculoId);
        if (!veiculoAlvo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }

        if (veiculoAlvo.id_usuario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você não pode alterar este veículo." });
        }

        const veiculoAtualizado = await atualizarVeiculo(veiculoId, body);
        res.status(200).json({ message: "Veículo atualizado com sucesso!", veiculo: veiculoAtualizado });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao atualizar veículo:", error);
        res.status(500).json({ message: "Erro interno ao atualizar veículo." });
    }
};

export const excluirVeiculoController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req);
        const veiculoId = parseInt(params.id);
        const requisitante = req.usuario;

        const veiculoAlvo = await obterVeiculoPorId(veiculoId);
        if (!veiculoAlvo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }

        if (veiculoAlvo.id_usuario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você не pode excluir este veículo." });
        }
        // Verifica se o veículo possui reservas ativas antes de permitir a exclusão
        const reservasAtivas = await prisma.reserva.findFirst({
            where: {
                id_veiculo: veiculoId,
                status: 'ATIVA',
            },
        });

        if (reservasAtivas) {
            return res.status(409).json({ message: "Conflito: Não é possível excluir este veículo pois ele possui uma reserva ativa." });
        }
        await excluirVeiculo(veiculoId);
        res.status(204).send();
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de veículo inválido.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao excluir veículo:", error);
        res.status(500).json({ message: "Erro interno ao excluir veículo." });
    }
};