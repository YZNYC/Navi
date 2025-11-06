import { adicionarFuncionario, listarFuncionariosPorEstacionamento, atualizarPermissaoFuncionario, removerFuncionario } from "../models/Funcioario.js";
import { obterEstacionamentoPorId } from "../models/Estacionamento.js";
import { adicionarFuncionarioSchema, atualizarFuncionarioSchema } from "../schemas/funcionario.schema.js";
import prisma from "../config/prisma.js";

const verificarDonoDoEstacionamento = async (estacionamentoId, requisitanteId) => {
    const estacionamento = await obterEstacionamentoPorId(estacionamentoId);
    if (!estacionamento || estacionamento.id_proprietario !== requisitanteId) {
        return false;
    }
    return true;
};

export const adicionarFuncionarioController = async (req, res) => {
    try {
        const { estacionamentoId } = req.params;
        const { body } = adicionarFuncionarioSchema.parse(req);
        const requisitante = req.usuario;
  
        if (requisitante.papel !== 'ADMINISTRADOR') {
            const ehDono = await verificarDonoDoEstacionamento(estacionamentoId, requisitante.id_usuario);
            if (!ehDono) {
                return res.status(403).json({ message: "Acesso proibido. Você não é o proprietário deste estacionamento." });
            }
        }
        
        const futuroFuncionario = await prisma.usuario.findUnique({ where: { email: body.email_funcionario } });
        if (!futuroFuncionario) {
            return res.status(404).json({ message: "Usuário não encontrado com o email fornecido." });
        }
        
        if (futuroFuncionario.id_usuario === requisitante.id_usuario) {
            return res.status(400).json({ message: "Você não pode se adicionar como funcionário do seu próprio estacionamento." });
        }
        
        const novoFuncionario = await adicionarFuncionario(estacionamentoId, futuroFuncionario.id_usuario, body.permissao);
        res.status(201).json({ message: "Funcionário adicionado com sucesso!", funcionario: novoFuncionario });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }

        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Conflito: Este usuário já é funcionário deste estacionamento." });
        }
        console.error("Erro ao adicionar funcionário:", error);
        res.status(500).json({ message: "Erro interno ao adicionar funcionário." });
    }
};

export const listarFuncionariosController = async (req, res) => {
    try {
        const { estacionamentoId } = req.params;
        const requisitante = req.usuario;

        if (requisitante.papel !== 'ADMINISTRADOR') {
            const ehDono = await verificarDonoDoEstacionamento(estacionamentoId, requisitante.id_usuario);
            if (!ehDono) {
                return res.status(403).json({ message: "Acesso proibido." });
            }
        }

        const funcionarios = await listarFuncionariosPorEstacionamento(estacionamentoId);
        res.status(200).json(funcionarios);
    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        res.status(500).json({ message: "Erro interno ao listar funcionários." });
    }
};

export const removerFuncionarioController = async (req, res) => {
    try {
        const { estacionamentoId, funcionarioId } = req.params;
        const requisitante = req.usuario;

        if (requisitante.papel !== 'ADMINISTRADOR') {
            const ehDono = await verificarDonoDoEstacionamento(estacionamentoId, requisitante.id_usuario);
            if (!ehDono) {
                return res.status(403).json({ message: "Acesso proibido." });
            }
        }
        
        await removerFuncionario(estacionamentoId, funcionarioId);
        res.status(204).send();

    } catch (error) {
     
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Funcionário não encontrado neste estacionamento." });
        }
        console.error("Erro ao remover funcionário:", error);
        res.status(500).json({ message: "Erro interno ao remover funcionário." });
    }
};

export const atualizarPermissaoController = async (req, res) => {
    try {
        const { estacionamentoId, funcionarioId } = req.params;
        const { body } = atualizarFuncionarioSchema.parse(req); 
        const requisitante = req.usuario;

        if (requisitante.papel !== 'ADMINISTRADOR') {
            const ehDono = await verificarDonoDoEstacionamento(estacionamentoId, requisitante.id_usuario);
            if (!ehDono) {
                return res.status(403).json({ message: "Acesso proibido. Você não é o proprietário deste estacionamento." });
            }
        }

        const funcionarioAtualizado = await atualizarPermissaoFuncionario(estacionamentoId, funcionarioId, body.permissao);
        res.status(200).json({ message: "Permissão do funcionário atualizada com sucesso.", funcionario: funcionarioAtualizado });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Funcionário não encontrado neste estacionamento." });
        }
        console.error("Erro ao atualizar permissão do funcionário:", error);
        res.status(500).json({ message: "Erro interno ao atualizar permissão." });
    }
};