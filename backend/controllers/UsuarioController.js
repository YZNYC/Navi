
import { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario, desativarUsuario } from "../models/Usuario.js";

// Função para remover o campo de senha do objeto de usuário
const removerSenha = (usuario) => {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
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
        const usuario = await obterUsuarioPorId(req.params.id);
        if (usuario) {
            res.status(200).json(removerSenha(usuario));
        } else {
            res.status(404).json({ message: "Usuário não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ message: "Erro ao obter usuário." });
    }
};

export const criarUsuarioController = async (req, res) => {
    try {

          const dadosDoCorpo = req.body;
        if (!dadosDoCorpo.papel) {
            dadosDoCorpo.papel = 'MOTORISTA';
        }
        const novoUsuario = await criarUsuario(req.body);
        res.status(201).json({ message: "Usuário criado com sucesso!", usuario: removerSenha(novoUsuario) });
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
             return res.status(409).json({ message: 'Este email já está em uso.' });
        }
        console.error('ERRO DETALHADO:', error); 
        res.status(500).json({ message: "Erro ao criar usuário." });
    }
};

export const atualizarUsuarioController = async (req, res) => {
    try {
        const idAlvo = parseInt(req.params.id);
        const requisitante = req.usuario; 

        // Ação permitida apenas para o próprio usuário ou para um admin.
        if (requisitante.id_usuario !== idAlvo && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você só pode editar seu próprio perfil." });
        }
        
        // Impede que um usuário comum mude seu próprio papel para admin.
        if (req.body.papel && requisitante.papel !== 'ADMINISTRADOR') {
            delete req.body.papel; 
        }

        const usuarioAtualizado = await atualizarUsuario(idAlvo, req.body);
        res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: removerSenha(usuarioAtualizado) });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
};

export const excluirUsuarioController = async (req, res) => {
    try {
        const idAlvo = parseInt(req.params.id);
        const requisitante = req.usuario;

        // Ação permitida apenas para o próprio usuário ou para um admin.
        if (requisitante.id_usuario !== idAlvo && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: "Acesso proibido. Você só pode excluir seu próprio perfil." });
        }

        await desativarUsuario(idAlvo);
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        res.status(500).json({ message: "Erro ao excluir usuário." });
    }
};