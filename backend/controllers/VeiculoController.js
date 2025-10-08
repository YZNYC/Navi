// src/controllers/VeiculoController.js

import { criarVeiculo, listarVeiculosPorUsuario, obterVeiculoPorId, atualizarVeiculo, excluirVeiculo } from "../models/Veiculo.js";

// Cria um novo veículo para o usuário autenticado
export const criarVeiculoController = async (req, res) => {
    try {
        const usuarioId = req.usuario.id_usuario;
        const novoVeiculo = await criarVeiculo(req.body, usuarioId);
        res.status(201).json({ message: "Veículo cadastrado com sucesso!", veiculo: novoVeiculo });
    } catch (error) {
        console.error("Erro ao criar veículo:", error);

        // Trata erro de placa duplicada
        if (error.code === 'P2002' && error.meta?.target.includes('placa')) {
            return res.status(409).json({ message: 'A placa informada já está cadastrada.' });
        }

        res.status(500).json({ message: "Erro interno ao cadastrar veículo." });
    }
};

// Lista veículos do usuário autenticado (ou de outro usuário, se admin)
export const listarVeiculosController = async (req, res) => {
    try {
        let usuarioId = req.usuario.id_usuario;

        // Se for admin, pode listar veículos de outro usuário
        if (req.usuario.papel === 'ADMINISTRADOR' && req.query.usuarioId) {
            usuarioId = req.query.usuarioId;
        }

        const veiculos = await listarVeiculosPorUsuario(usuarioId);
        res.status(200).json(veiculos);
    } catch (error) {
        console.error("Erro ao listar veículos:", error);
        res.status(500).json({ message: "Erro interno ao listar veículos." });
    }
};

// Busca um veículo pelo ID (somente dono ou admin)
export const obterVeiculoPorIdController = async (req, res) => {
    try {
        const veiculoId = req.params.id;
        const requisitante = req.usuario;

        const veiculo = await obterVeiculoPorId(veiculoId);
        if (!veiculo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }

        // Verifica se é dono ou admin
        if (veiculo.id_usuario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Este veículo não pertence a você." });
        }

        res.status(200).json(veiculo);
    } catch (error) {
        console.error("Erro ao obter veículo:", error);
        res.status(500).json({ message: "Erro interno ao obter veículo." });
    }
};

// Atualiza os dados de um veículo (somente dono ou admin)
export const atualizarVeiculoController = async (req, res) => {
    try {
        const veiculoId = req.params.id;
        const requisitante = req.usuario;

        const veiculoAlvo = await obterVeiculoPorId(veiculoId);
        if (!veiculoAlvo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }

        // Verifica se é dono ou admin
        if (veiculoAlvo.id_usuario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você não pode alterar este veículo." });
        }
        
        const veiculoAtualizado = await atualizarVeiculo(veiculoId, req.body);
        res.status(200).json({ message: "Veículo atualizado com sucesso!", veiculo: veiculoAtualizado });
    } catch (error) {
        console.error("Erro ao atualizar veículo:", error);
        res.status(500).json({ message: "Erro interno ao atualizar veículo." });
    }
};

// Exclui um veículo (somente dono ou admin)
export const excluirVeiculoController = async (req, res) => {
    try {
        const veiculoId = req.params.id;
        const requisitante = req.usuario;

        const veiculoAlvo = await obterVeiculoPorId(veiculoId);
        if (!veiculoAlvo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }

        // Verifica se é dono ou admin
        if (veiculoAlvo.id_usuario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você não pode excluir este veículo." });
        }

        await excluirVeiculo(veiculoId);
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao excluir veículo:", error);
        res.status(500).json({ message: "Erro interno ao excluir veículo." });
    }
};
