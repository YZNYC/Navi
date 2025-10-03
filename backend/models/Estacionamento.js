import prisma from '../config/prisma.js';


const listarEstacionamentos = async () => {
    return await prisma.estacionamento.findMany();
};

const obterEstacionamentoPorId = async (id) => {
    
    return await prisma.estacionamento.findUnique({
        where: { id_estacionamento: parseInt(id) },
    });
};

const criarEstacionamento = async (estacionamentoData) => {
    const novoEstacionamento = await prisma.estacionamento.create({
        data: estacionamentoData,
    });

    return novoEstacionamento.id_estacionamento;
};

const atualizarEstacionamento = async (id, estacionamentoData) => {
    return await prisma.estacionamento.update({
        where: { id_estacionamento: parseInt(id) },
        data: estacionamentoData,
    });
};

const excluirEstacionamento = async (id) => {
    return await prisma.estacionamento.delete({
        where: { id_estacionamento: parseInt(id) },
    });
};

export { listarEstacionamentos, obterEstacionamentoPorId, criarEstacionamento, atualizarEstacionamento, excluirEstacionamento };