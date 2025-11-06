// src/models/Relatorio.js
import prisma from '../config/prisma.js';

// 1. KPI: Total de Usuários Ativos
export const contarTotalDeUsuarios = async () => {
    return await prisma.usuario.count({
        where: { ativo: true }
    });
};

// 2. KPI: Total de Estacionamentos Ativos
export const contarEstacionamentosAtivos = async () => {
    return await prisma.estacionamento.count();
};

// 3. KPI: Total de Vagas Livres (assumindo que todas as vagas existem)
export const contarVagasAtivas = async () => {
    return await prisma.vaga.count();
};

// 4. KPI: Total de Receita Líquida no Mês (simplesmente somando pagamentos aprovados)
export const calcularReceitaMensal = async () => {
    // Busca a soma de todos os pagamentos aprovados no último mês (30 dias)
    const data30DiasAtras = new Date();
    data30DiasAtras.setDate(data30DiasAtras.getDate() - 30);

    const resultado = await prisma.pagamento.aggregate({
        _sum: {
            valor_liquido: true,
        },
        where: {
            status: 'APROVADO',
            data_hora: {
                gte: data30DiasAtras,
            },
        },
    });

    return resultado._sum.valor_liquido || 0;
};

// 5. KPI: Total de Reservas Ativas
export const contarReservasAtivas = async () => {
    return await prisma.reserva.count({
        where: { status: 'ATIVA' }
    });
};