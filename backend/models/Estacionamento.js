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
  
    const { localizacao, ...dadosNormais } = estacionamentoData;
    const novoEstacionamento = await prisma.estacionamento.create({
        data: dadosNormais,
    });

    // 3. Se um dado de localização foi enviado atualizamos usando uma query SQL pura
    if (localizacao && localizacao.coordinates) {
        const [longitude, latitude] = localizacao.coordinates;

        await prisma.$executeRaw`
            UPDATE estacionamento 
            SET localizacao = ST_PointFromText(${`POINT(${longitude} ${latitude})`}) 
            WHERE id_estacionamento = ${novoEstacionamento.id_estacionamento}
        `;
    }

    // 4. Retorna o estacionamento criado no passo 2
    return novoEstacionamento;
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