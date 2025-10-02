import { readAll, read, update, deleteRecord, create } from '../config/database.js';

const listarEstacionamentos = async () => {
    try {
        return await readAll('estacionamento');
    } catch (error) {
        console.error('Erro ao listar estacionamentos:', error);
        throw error;
    }
};

const obterEstacionamentoPorId = async (id) => {
    try {
        return await read('estacionamento', `id_estacionamento = ${id}`);
    } catch (error) {
        console.error('Erro ao obter estacionamento por ID:', error);
        throw error;
    }
};

const criarEstacionamento = async (estacionamentoData) => {
    try {
        return await create('estacionamento', estacionamentoData);
    } catch (error) {
        console.error('Erro ao criar estacionamento:', error);
        throw error;
    }
};

const atualizarEstacionamento = async (id, estacionamentoData) => {
    try {
        return await update('estacionamento', estacionamentoData, `id_estacionamento = ${id}`);
    } catch (error) {
        console.error('Erro ao atualizar estacionamento:', error);
        throw error;
    }
};

const excluirEstacionamento = async (id) => {
    try {
        return await deleteRecord('estacionamento', `id_estacionamento = ${id}`);
    } catch (error) {
        console.error('Erro ao excluir estacionamento:', error);
        throw error;
    }
};

export { listarEstacionamentos, obterEstacionamentoPorId, criarEstacionamento, atualizarEstacionamento, excluirEstacionamento };
