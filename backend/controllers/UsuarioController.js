import { criarUsuario, atualizarUsuario, desativarUsuario, listarUsuarios, obterUsuarioPorId} from "../models/Usuario.js";
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../schemas/usuario.schema.js';
import { paramsSchema } from '../schemas/params.schema.js';

// Função auxiliar para remover a senha do objeto de usuário antes de enviar a resposta
const removerSenha = (usuario) => {
    if (!usuario) return null;
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
};


export const criarUsuarioController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Garante que o corpo da requisição (nome, email, senha) está correto.
        const { body } = criarUsuarioSchema.parse(req);

        if (!body.papel) {
            body.papel = 'MOTORISTA'; // Define um papel padrão se não for fornecido
        }

        // 2. EXECUÇÃO: Se a validação passar, prossegue com a criação do usuário.
        const novoUsuario = await criarUsuario(body);
        res.status(201).json({ message: "Usuário criado com sucesso!", usuario: removerSenha(novoUsuario) });

    } catch (error) {
        // 3. TRATAMENTO DE ERROS: Captura erros de validação, duplicidade, ou erros genéricos.
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

export const atualizarUsuarioController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Garante que o ID na URL é um número e o body é válido.
        const { params } = paramsSchema.parse(req);
        const { body } = atualizarUsuarioSchema.parse(req);
        const idAlvo = parseInt(params.id);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO: Lógica de negócio e permissão.
        if (requisitante.id_usuario !== idAlvo && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você só pode editar seu próprio perfil." });
        }
        
        if (body.papel && requisitante.papel !== 'ADMINISTRADOR') {
            delete body.papel;
        }

        const usuarioAtualizado = await atualizarUsuario(idAlvo, body);
        res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: removerSenha(usuarioAtualizado) });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
};

export const excluirUsuarioController = async (req, res) => {
    try {
        // 1. VALIDAÇÃO: Garante que o ID na URL é numérico.
        const { params } = paramsSchema.parse(req);
        const idAlvo = parseInt(params.id);
        const requisitante = req.usuario;

        // 2. EXECUÇÃO: Lógica de permissão.
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