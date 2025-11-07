import {  criarEstacionamento,  atualizarEstacionamento,  excluirEstacionamento,  listarEstacionamentos,  obterEstacionamentoPorId} from "../models/Estacionamento.js";
import { criarEstacionamentoSchema, atualizarEstacionamentoSchema } from '../schemas/estacionamento.schema.js';
import { paramsSchema } from '../schemas/params.schema.js';
import prisma from '../config/prisma.js'; 

export const listarEstacionamentoController = async (req, res) => {
    try {
        const estacionamentos = await listarEstacionamentos();
        res.status(200).json(estacionamentos);
    } catch (error) {
        console.error('Erro ao listar estacionamentos:', error);
        res.status(500).json({ message: 'Erro interno ao listar estacionamentos.' });
    }
};

export const obterEstacionamentoPorIdController = async (req, res) => {
    try {
        const { params } = paramsSchema.parse(req); 
        const estacionamento = await obterEstacionamentoPorId(params.id);
        
        if (estacionamento) {
            res.status(200).json(estacionamento);
        } else {
            res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de estacionamento inválido.", errors: error.flatten().fieldErrors });
        }
        console.error('Erro ao obter estacionamento pelo ID:', error);
        res.status(500).json({ message: 'Erro interno ao obter estacionamento.' });
    }
};

export const criarEstacionamentoController = async (req, res) => {
    try {
    
        const { body } = criarEstacionamentoSchema.parse(req);
        const proprietarioId = req.usuario.id_usuario;

        const cepFormatado = body.cep.replace('-', '');
        const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
        
        if (!response.ok) {
            return res.status(502).json({ message: "Serviço de CEP indisponível no momento." }); 
        }
        
        const endereco = await response.json();
        if (endereco.erro) {
            return res.status(400).json({ message: "CEP inválido ou não encontrado." });
        }
        
        const enderecoCompleto = `${endereco.logradouro}, ${body.numero} - ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, ${body.cep}`;

        const dadosParaSalvar = {
            ...body, 
            rua: endereco.logradouro || '',
            bairro: endereco.bairro || '',
            cidade: endereco.localidade || '',
            estado: endereco.uf || '',

            endereco_completo: enderecoCompleto,
            id_proprietario: proprietarioId,
        };

        const novoEstacionamento = await criarEstacionamento(dadosParaSalvar);
        res.status(201).json({ message: 'Estacionamento criado com sucesso!', estacionamento: novoEstacionamento });

    } catch (error) {

        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        if (error.code === 'P2002') {
            const campoComErro = error.meta?.target[0];
            return res.status(409).json({ 
                message: `Conflito: Já existe um estacionamento com este ${campoComErro}.` 
            });
        }
        console.error('Erro ao criar estacionamento:', error);
        res.status(500).json({ message: 'Erro interno ao criar estacionamento.' });
    }
};

export const atualizarEstacionamentoController = async (req, res) => {
    try {
       
        const { params } = paramsSchema.parse(req);
        const { body } = atualizarEstacionamentoSchema.parse(req);
        const estacionamentoId = parseInt(params.id);
        const requisitante = req.usuario;

     
        const estacionamentoAlvo = await obterEstacionamentoPorId(estacionamentoId);
        if (!estacionamentoAlvo) {
            return res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }

        if (estacionamentoAlvo.id_proprietario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: 'Acesso proibido. Você não é o proprietário deste estacionamento.' });
        }

        const estacionamentoAtualizado = await atualizarEstacionamento(estacionamentoId, body);
        res.status(200).json({ message: 'Estacionamento atualizado com sucesso!', estacionamento: estacionamentoAtualizado });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "Dados de entrada inválidos.", errors: error.flatten().fieldErrors });
        }
        console.error('Erro ao atualizar estacionamento:', error);
        res.status(500).json({ message: 'Erro ao atualizar estacionamento.' });
    }
};

export const excluirEstacionamentoController = async (req, res) => {
    try {
    
        const { params } = paramsSchema.parse(req);
        const estacionamentoId = parseInt(params.id);
        const requisitante = req.usuario;

        const estacionamentoAlvo = await obterEstacionamentoPorId(estacionamentoId);
        if (!estacionamentoAlvo) {
            return res.status(404).json({ message: 'Estacionamento não encontrado.' });
        }

        if (estacionamentoAlvo.id_proprietario !== requisitante.id_usuario && requisitante.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ message: 'Acesso proibido. Você não é o proprietário deste estacionamento.' });
        }

        await excluirEstacionamento(estacionamentoId);
        res.status(204).send();
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: "ID de estacionamento inválido.", errors: error.flatten().fieldErrors });
        }
        console.error('Erro ao excluir estacionamento:', error);
        res.status(500).json({ message: 'Erro ao excluir estacionamento.' });
    }
};

export const listarMeusEstacionamentosController = async (req, res) => {
    try {
    
        if (!req.usuario || typeof req.usuario.id_usuario === 'undefined') {
            console.error('ERRO FATAL: Chegou no controller sem dados de usuário no token.');
            return res.status(401).json({ message: 'Token de autenticação inválido ou corrompido.' });
        }
        
        const proprietarioId = req.usuario.id_usuario;

        const estacionamentos = await prisma.estacionamento.findMany({
            where: { id_proprietario: proprietarioId },
            orderBy: { nome: 'asc' }, 
        });
    
        res.status(200).json(estacionamentos);

    } catch (error) {
        console.error("Erro detalhado ao listar meus estacionamentos:", error);
        res.status(500).json({ message: "Erro interno ao buscar seus estacionamentos." });
    }
};