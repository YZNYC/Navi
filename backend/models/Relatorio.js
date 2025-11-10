// src/models/Relatorio.js
import prisma from '../config/prisma.js';

// Funções de KPI Genéricas que aceitam um array de IDs de estacionamento.
// Se o array for 'undefined', calcula para o sistema inteiro (caso do Admin).

export const contarVagasNosEstacionamentos = async (estacionamentoIds) => {
    const whereClause = estacionamentoIds ? { id_estacionamento: { in: estacionamentoIds } } : {};

    const [total, livre, ocupada, reservada] = await Promise.all([
        prisma.vaga.count({ where: whereClause }),
        prisma.vaga.count({ where: { ...whereClause, status: 'LIVRE' } }),
        prisma.vaga.count({ where: { ...whereClause, status: 'OCUPADA' } }),
        prisma.vaga.count({ where: { ...whereClause, status: 'RESERVADA' } }),
    ]);
    return { total, livre, ocupada, reservada };
};

export const calcularReceitaNosEstacionamentos = async (estacionamentoIds) => {
    const whereClause = estacionamentoIds ? { reserva: { vaga: { id_estacionamento: { in: estacionamentoIds } } } } : {};
    
    const data30DiasAtras = new Date();
    data30DiasAtras.setDate(data30DiasAtras.getDate() - 30);

    const resultado = await prisma.pagamento.aggregate({
        _sum: { valor_liquido: true },
        where: {
            status: 'APROVADO',
            data_hora: { gte: data30DiasAtras },
            ...whereClause
        },
    });
    return resultado._sum.valor_liquido || 0;
};

export const contarReservasAtivasNosEstacionamentos = async (estacionamentoIds) => {
    const whereClause = estacionamentoIds ? { vaga: { id_estacionamento: { in: estacionamentoIds } } } : {};

    return prisma.reserva.count({
        where: {
            status: 'ATIVA',
            ...whereClause
        }
    });
};