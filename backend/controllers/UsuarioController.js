import { criarUsuario, atualizarUsuario, desativarUsuario, listarUsuarios, obterUsuarioPorId} from "../models/Usuario.js";
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../schemas/usuario.schema.js';
import prisma from "../config/prisma.js";
import { paramsSchema } from '../schemas/params.schema.js';

const removerSenha = (usuario) => {
    if (!usuario) return null;
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
};


export const criarUsuarioController = async (req, res) => {
    try {
       
        const { body } = criarUsuarioSchema.parse(req);

        if (!body.papel) {
            body.papel = 'MOTORISTA'; // Padrão Motorista
        }

      
        const novoUsuario = await criarUsuario(body);
        res.status(201).json({ message: "Usuário criado com sucesso!", usuario: removerSenha(novoUsuario) });

    } catch (error) {
     
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
             return res.status(409).json({ message: 'Este email já está em uso.' });
        }
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ message: "Erro interno ao criar usuário." });
    }
};

// src/controllers/UsuarioController.js - DENTRO DE atualizarUsuarioController

export const atualizarUsuarioController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Valida tanto o ID na URL quanto os campos no body
        const { params } = paramsSchema.parse(req); // Assume que paramsSchema está importado
        const idAlvo = parseInt(params.id);
        const requisitante = req.usuario;

        // 🚨 CORREÇÃO 1: Extrai o body e valida APENAS o body
        const { body: dadosAtualizacao } = atualizarUsuarioSchema.parse(req); 
        
        // 🚨 CORREÇÃO 2: Verifica se o objeto de atualização tem chaves
        if (Object.keys(dadosAtualizacao).length === 0) {
            return res.status(400).json({ message: "Corpo da requisição vazio ou inválido." });
        }

        // 2. EXECUÇÃO: Lógica de negócio e permissão.
        if (requisitante.id_usuario !== idAlvo && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você só pode editar seu próprio perfil." });
        }
        
        // Regra para impedir que não-admins mudem o papel
        if (dadosAtualizacao.papel && requisitante.papel !== 'ADMINISTRADOR') {
            // Remove o papel do objeto se não for admin
            delete dadosAtualizacao.papel; 
        }

        const usuarioAtualizado = await atualizarUsuario(idAlvo, dadosAtualizacao);
        res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: removerSenha(usuarioAtualizado) });
    } catch (error) {
        if (error.name === 'ZodError') {
            // Se o Zod falhar por dados inválidos, ele retorna 400
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
};

export const excluirUsuarioController = async (req, res) => {
    try {
       
        const { params } = paramsSchema.parse(req);
        const idAlvo = parseInt(params.id);
        const requisitante = req.usuario;

        if (requisitante.id_usuario !== idAlvo && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você só pode excluir seu próprio perfil." });
        }
        
        await desativarUsuario(idAlvo);
        res.status(204).send();
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao excluir usuário:", error);
        res.status(500).json({ message: "Erro interno ao excluir usuário." });
    }
};

export const listarUsuariosController = async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        const usuariosSemSenha = usuarios.map(removerSenha);
        res.status(200).json(usuariosSemSenha);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar usuários." });
    }
};

export const obterUsuarioPorIdController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req);
        const usuario = await obterUsuarioPorId(params.id);
        
        if (usuario) {
            res.status(200).json(removerSenha(usuario));
        } else {
            res.status(404).json({ message: "Usuário não encontrado." });
        }
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de usuário inválido.", errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: "Erro ao obter usuário." });
    }
};