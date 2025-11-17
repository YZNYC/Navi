// src/models/Log.js
import prisma from '../config/prisma.js';

export const buscarLogs = async (filtros) => {
    const { estacionamentoId, dataInicio, dataFim } = filtros;
    const whereClause = {
        id_estacionamento: parseInt(estacionamentoId),
    };

    if (dataInicio) {
        whereClause.data_log = { ...whereClause.data_log, gte: new Date(dataInicio) };
    }
    if (dataFim) {
        // Adiciona 1 dia para incluir o dia final por completo
        const dataFimAjustada = new Date(dataFim);
        dataFimAjustada.setDate(dataFimAjustada.getDate() + 1);
        whereClause.data_log = { ...whereClause.data_log, lt: dataFimAjustada };
    }
    
    return prisma.log.findMany({
        where: whereClause,
        include: { 
            usuario: { 
                select: { nome: true } 
            } 
        },
        orderBy: { data_log: 'desc' },
        take: 200,
    });
};