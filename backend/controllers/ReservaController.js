import {criarReserva, listarReservasPorUsuario, listarReservasPorEstacionamento,  obterReservaPorId,  concluirOuCancelarReserva} from "../models/Reserva.js";
import { criarReservaSchema } from "../schemas/reserva.schema.js";
import { paramsSchema } from '../schemas/params.schema.js';
import prisma from "../config/prisma.js";

// Função auxiliar para verificar se o requisitante pode interagir com a reserva.
const verificarPermissaoSobreReserva = async (reservaId, requisitante) => {
    const reserva = await prisma.reserva.findUnique({
        where: { id_reserva: parseInt(reservaId) },
        include: { vaga: { include: { estacionamento: true } } }
    });
    if (!reserva) return { permitido: false, status: 404, message: "Reserva não encontrada." };
    const donoDaReserva = reserva.id_usuario === requisitante.id_usuario;
    const donoDoEstacionamento = reserva.vaga.estacionamento.id_proprietario === requisitante.id_usuario;
    const isAdmin = requisitante.papel === 'ADMINISTRADOR';
    if (donoDaReserva || donoDoEstacionamento || isAdmin) return { permitido: true };
    return { permitido: false, status: 403, message: "Acesso proibido a esta reserva." };
};


export const criarReservaController = async (req, res) => {
    try {
        const { body } = criarReservaSchema.parse(req);
        const usuarioId = req.usuario.id_usuario;
        
        const vagaExiste = await prisma.vaga.findUnique({ where: { id_vaga: body.id_vaga } });
        if (!vagaExiste) return res.status(404).json({ message: "Vaga não encontrada." });

        if (body.id_veiculo) {
            const veiculo = await prisma.veiculo.findUnique({ where: { id_veiculo: body.id_veiculo } });
            if (!veiculo) return res.status(404).json({ message: "Veículo não encontrado." });
            if (veiculo.id_usuario !== usuarioId) return res.status(403).json({ message: "Este veículo não pertence a você." });
        }
        
        const novaReserva = await criarReserva(body, usuarioId);
        res.status(201).json({ message: "Reserva criada com sucesso!", reserva: novaReserva });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        if (error.message.includes("Vaga não está disponível")) {
            return res.status(409).json({ message: error.message });
        }
        console.error("Erro ao criar reserva:", error);
        res.status(500).json({ message: "Erro interno ao criar reserva." });
    }
};

export const listarMinhasReservasController = async (req, res) => {
    try {
        const usuarioId = req.usuario.id_usuario;
        const reservas = await listarReservasPorUsuario(usuarioId);
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Erro ao listar suas reservas:", error);
        res.status(500).json({ message: "Erro interno ao listar reservas." });
    }
};

export const obterReservaPorIdController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req); // Valida que o :id é um número
        const requisitante = req.usuario;

        const permissao = await verificarPermissaoSobreReserva(params.id, requisitante);
        if (!permissao.permitido) {
            return res.status(permissao.status).json({ message: permissao.message });
        }
        
        const reserva = await obterReservaPorId(params.id);
        res.status(200).json(reserva);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de reserva inválido.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao obter reserva:", error);
        res.status(500).json({ message: "Erro interno ao obter reserva." });
    }
};


export const cancelarReservaController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req); // Valida o :reservaId (que é mapeado para :id no schema genérico)
        const requisitante = req.usuario;

        const permissao = await verificarPermissaoSobreReserva(params.id, requisitante);
        if (!permissao.permitido) {
            return res.status(permissao.status).json({ message: permissao.message });
        }
        
        // Adicional: regra de negócio para não cancelar reserva que não está ATIVA
        const reservaAlvo = await obterReservaPorId(params.id);
        if (reservaAlvo.status !== 'ATIVA') {
            return res.status(400).json({ message: "Esta reserva não está mais ativa e não pode ser cancelada." });
        }

        const reservaCancelada = await concluirOuCancelarReserva(params.id, 'CANCELADA');
        res.status(200).json({ message: "Reserva cancelada com sucesso!", reserva: reservaCancelada });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de reserva inválido.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao cancelar reserva:", error);
        res.status(500).json({ message: "Erro interno ao cancelar reserva." });
    }
};


// Controlador usado nas rotas de estacionamento
export const listarReservasDeEstacionamentoController = async (req, res) => {
    try {
        const { estacionamentoId } = req.params; 
        const reservas = await listarReservasPorEstacionamento(estacionamentoId);
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Erro ao listar reservas do estacionamento:", error);
        res.status(500).json({ message: "Erro interno ao listar reservas." });
    }
};