import { criarVaga, atualizarVaga, excluirVaga, listarVagas, obterVagasPorId } from "../models/Vaga.js";
import prisma from '../config/prisma.js'; // Usado para a verificação de posse do estacionamento

// Verifica se o requisitante é o proprietário do estacionamento ou um administrador.
const temPermissaoSobreEstacionamento = async (id_estacionamento, requisitante) => {
    const estacionamento = await prisma.estacionamento.findUnique({
        where: { id_estacionamento: parseInt(id_estacionamento) },
        select: { id_proprietario: true }
    });

    if (!estacionamento) return false; // Estacionamento não existe.
    if (requisitante.papel === 'ADMINISTRADOR') return true; // Admin pode tudo.
    
    return estacionamento.id_proprietario === requisitante.id_usuario;
};


// Rota pública para listar todas as vagas
export const listarVagasController = async (req, res) => {
    try {
        const vagas = await listarVagas();
        res.status(200).json(vagas);
    } catch (error) {
        console.error('Erro ao listar as vagas:', error);
        res.status(500).json({ message: 'Erro interno ao listar vagas.' });
    }
};

// Rota pública para obter uma vaga específica
export const obterVagasPorIdController = async (req, res) => {
    try {
        const vaga = await obterVagasPorId(req.params.id);
        if (vaga) {
            res.status(200).json(vaga);
        } else {
            res.status(404).json({ message: 'Vaga não encontrada.' });
        }
    } catch (error) {
        console.error('Erro ao obter a vaga pelo ID:', error);
        res.status(500).json({ message: 'Erro interno ao obter vaga.' });
    }
};

// Cria uma vaga após verificar a permissão sobre o estacionamento.
export const criarVagaController = async (req, res) => {
    try {
        const { id_estacionamento } = req.body;

        const temPermissao = await temPermissaoSobreEstacionamento(id_estacionamento, req.usuario);
        if (!temPermissao) {
            return res.status(403).json({ message: "Acesso proibido. Você não gerencia o estacionamento informado." });
        }

        const novaVaga = await criarVaga(req.body);
        res.status(201).json({ message: 'Vaga criada com sucesso!', vaga: novaVaga });
    } catch (error) {
        console.error('Erro ao criar vaga:', error);
        res.status(500).json({ message: 'Erro interno ao criar vaga.' });
    }
};

// Atualiza uma vaga após verificar a permissão sobre o estacionamento da vaga.
export const atualizarVagaController = async (req, res) => {
    try {
        const vagaId = parseInt(req.params.id);
        
        const vagaAlvo = await obterVagasPorId(vagaId);
        if (!vagaAlvo) {
            return res.status(404).json({ message: "Vaga não encontrada." });
        }

        const temPermissao = await temPermissaoSobreEstacionamento(vagaAlvo.id_estacionamento, req.usuario);
        if (!temPermissao) {
            return res.status(403).json({ message: "Acesso proibido. Você não gerencia o estacionamento desta vaga." });
        }

        const vagaAtualizada = await atualizarVaga(vagaId, req.body);
        res.status(200).json({ message: 'Vaga atualizada com sucesso!', vaga: vagaAtualizada });
    } catch (error) {
        console.error('Erro ao atualizar vaga:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar vaga.' });
    }
};

// Exclui uma vaga após verificar a permissão sobre o estacionamento da vaga.
export const excluirVagaController = async (req, res) => {
    try {
        const vagaId = parseInt(req.params.id);

        const vagaAlvo = await obterVagasPorId(vagaId);
        if (!vagaAlvo) {
            return res.status(404).json({ message: "Vaga não encontrada." });
        }

        const temPermissao = await temPermissaoSobreEstacionamento(vagaAlvo.id_estacionamento, req.usuario);
        if (!temPermissao) {
            return res.status(403).json({ message: "Acesso proibido. Você não gerencia o estacionamento desta vaga." });
        }

        await excluirVaga(vagaId);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir vaga:', error);
        res.status(500).json({ message: 'Erro interno ao excluir vaga.' });
    }
};