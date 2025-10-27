import prisma from '../config/prisma.js';

export const criarReserva = async (dadosReserva, usuarioId) => {
    const { id_vaga, id_veiculo } = dadosReserva;

    // Usamos uma transação para garantir a consistência dos dados
    return prisma.$transaction(async (tx) => {
        
        // 1. Verifica se a vaga existe e se está realmente livre.
        const vaga = await tx.vaga.findFirst({
            where: {
                id_vaga: parseInt(id_vaga),
                status: 'LIVRE',
            },
        });

        if (!vaga) {
            throw new Error("Vaga não está disponível para reserva.");
        }

        // 2. Altera o status da vaga para 'RESERVADA'.
        await tx.vaga.update({
            where: { id_vaga: parseInt(id_vaga) },
            data: { status: 'RESERVADA' },
        });

        // 3. Cria o registro da reserva.
        const novaReserva = await tx.reserva.create({
            data: {
                id_vaga: parseInt(id_vaga),
                id_usuario: parseInt(usuarioId),
                id_veiculo: id_veiculo ? parseInt(id_veiculo) : null,
                status: 'ATIVA',
            },
        });

        return novaReserva;
    });
};

// Lista Reserva por usuários
export const listarReservasPorUsuario = async (usuarioId) => {
    return await prisma.reserva.findMany({
        where: { id_usuario: parseInt(usuarioId) },
        include: { vaga: true, veiculo: true }, 
    });
};

// Lista reserva por Estacionamento
export const listarReservasPorEstacionamento = async (estacionamentoId) => {
    return await prisma.reserva.findMany({
        where: {
            vaga: {
                id_estacionamento: parseInt(estacionamentoId),
            },
        },
        include: { usuario: true, veiculo: true, vaga: true }, 
    });
};

export const obterReservaPorId = async (reservaId) => {
    return await prisma.reserva.findUnique({
        where: { id_reserva: parseInt(reservaId) },
    });
};

export const concluirOuCancelarReserva = async (reservaId, novoStatus) => {
   
    return prisma.$transaction(async (tx) => {
        // 1. Encontra a reserva para obter o ID da vaga associada.
        const reserva = await tx.reserva.findUnique({
            where: { id_reserva: parseInt(reservaId) },
        });

        if (!reserva) {
            throw new Error("Reserva não encontrada.");
        }

        // 2. Atualiza o status da vaga de volta para 'LIVRE'.
        await tx.vaga.update({
            where: { id_vaga: reserva.id_vaga },
            data: { status: 'LIVRE' },
        });

        // 3. Atualiza o status da reserva.
        const reservaAtualizada = await tx.reserva.update({
            where: { id_reserva: parseInt(reservaId) },
            data: { status: novoStatus, data_hora_fim: new Date() },
        });

        return reservaAtualizada;
    });
};