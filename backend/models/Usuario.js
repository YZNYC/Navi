import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';


const listarUsuarios = async () => {
    return await prisma.usuario.findMany({
        where: { ativo: true } 
    });
};

const obterUsuarioPorId = async (id) => {
    return await prisma.usuario.findUnique({
        where: { 
            id_usuario: parseInt(id),
            ativo: true
        }
    });
};

const criarUsuario = async (dadosUsuario) => {

    const senhaHash = await bcrypt.hash(dadosUsuario.senha, 10);
    
    return await prisma.usuario.create({
        data: {
            ...dadosUsuario,
            senha: senhaHash,
        }
    });
};

const atualizarUsuario = async (id, dadosUsuario) => {

    if (dadosUsuario.senha) {
        dadosUsuario.senha = await bcrypt.hash(dadosUsuario.senha, 10);
    }

    return await prisma.usuario.update({
        where: { id_usuario: parseInt(id) },
        data: dadosUsuario,
    });
};

const desativarUsuario = async (id) => {
    return await prisma.usuario.update({
        where: { id_usuario: parseInt(id) },
        data: { ativo: false },
    });
};

export { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario, desativarUsuario };