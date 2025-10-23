import prisma from '../config/prisma.js';

export const criarPoliticaPreco = async (dadosPolitica, estacionamentoId) => {
    return await prisma.politica_preco.create({
        data: {
            ...dadosPolitica,
            id_estacionamento: parseInt(estacionamentoId),
        },
    });
};

export const listarPoliticasPorEstacionamento = async (estacionamentoId) => {
    return await prisma.politica_preco.findMany({
        where: { id_estacionamento: parseInt(estacionamentoId) },
    });
};

export const obterPoliticaPorId = async (politicaId) => {
    return await prisma.politica_preco.findUnique({
        where: { id_politica_preco: parseInt(politicaId) },
    });
};

export const atualizarPoliticaPreco = async (politicaId, dadosPolitica) => {
    return await prisma.politica_preco.update({
        where: { id_politica_preco: parseInt(politicaId) },
        data: dadosPolitica,
    });
};

export const excluirPoliticaPreco = async (politicaId) => {
    return await prisma.politica_preco.delete({
        where: { id_politica_preco: parseInt(politicaId) },
    });
};