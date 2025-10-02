import { readAll, read, update, deleteRecord, create } from '../config/database.js';

const listarVagas = async () => {
    try {
        return await readAll('vagas');
    } catch (error) {
        console.error('Erro ao listar as vagas: ', error)
        throw error
    }
}

const obterVagasPorId = async (id) => {
    try {
        return await read('vagas', `id_vaga = ${id}`)
    } catch (error) {
        console.error('Erro ao pesquisar a vaga por ID: ', error)
        throw error
    }
}

const criarVaga = async (vagaData) => {
    try {
        return await create('vagas', vagaData)
    } catch (error) {
        console.error('Erro ao criar vaga: ', error)
        throw error
    }
}

const atualizarVaga = async (id, vagaData) => {
    try {
        return await update('vagas', vagaData, `id_vaga = ${id}`)
    } catch (error) {
        console.error('Erro ao atualizar vaga: ', error)
        throw error
    }
}

const excluirVaga = async (id) => {
    try {
        return await deleteRecord('vagas', `id_vaga = ${id}`)
    } catch (error) {
        console.error('Erro ao excluir vaga: ', error)
        throw error
    }
}

export { listarVagas, obterVagasPorId, criarVaga, atualizarVaga, excluirVaga }