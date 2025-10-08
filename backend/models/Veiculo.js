import prisma from '../config/prisma.js';

export const criarVeiculo = async (dadosVeiculo, usuarioId) => {
    return await prisma.veiculo.create({
        data: {
            ...dadosVeiculo,
            id_usuario: usuarioId,
        },
    });
};

export const listarVeiculosPorUsuario = async (usuarioId) => {
    return await prisma.veiculo.findMany({
        where: { id_usuario: parseInt(usuarioId) },
    });
};

export const obterVeiculoPorId = async (veiculoId) => {
    return await prisma.veiculo.findUnique({
        where: { id_veiculo: parseInt(veiculoId) },
    });
};


export const atualizarVeiculo = async (veiculoId, dadosVeiculo) => {
    return await prisma.veiculo.update({
        where: { id_veiculo: parseInt(veiculoId) },
        data: dadosVeiculo,
    });
};

export const excluirVeiculo = async (veiculoId) => {
    return await prisma.veiculo.delete({
        where: { id_veiculo: parseInt(veiculoId) },
    });
};
