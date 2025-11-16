// src/controllers/LogController.js
import * as LogModel from '../models/Log.js';
import { obterEstacionamentoPorId } from '../models/Estacionamento.js';

// A mesma função de permissão que usamos nos outros controllers aninhados
const verificarPermissao = async (estacionamentoId, requisitante) => {
    if (requisitante.papel === 'ADMINISTRADOR') return true;
    if (requisitante.papel === 'PROPRIETARIO') {
        const estacionamento = await obterEstacionamentoPorId(estacionamentoId);
        if (estacionamento && estacionamento.id_proprietario === requisitante.id_usuario) {
            return true;
        }
    }
    // Lógica para 'GESTOR' poderia ser adicionada aqui se necessário
    return false;
};

export const getLogsController = async (req, res) => {
    try {
        const { estacionamentoId } = req.params;
        const requisitante = req.usuario;

        const temPermissao = await verificarPermissao(estacionamentoId, requisitante);
        if (!temPermissao) {
            return res.status(403).json({ message: "Acesso proibido a estes logs." });
        }
        
        const logs = await LogModel.buscarLogs({ ...req.query, estacionamentoId });
        res.status(200).json(logs);
    } catch (error) {
        console.error("Erro ao buscar logs:", error);
        res.status(500).json({ message: "Erro interno ao buscar logs." });
    }
};