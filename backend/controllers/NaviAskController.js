import { NaviService } from '../services/navi.service.js';
import { askNaviAdminSchema, askNaviProprietarioSchema } from '../schemas/navi.schema.js';
import { DocumentGenerateNavi } from '../models/DocumentGenerateNavi.js'; // Importação corrigida
import prisma from '../config/prisma.js'; // Prisma (necessário para checagem de autorização)

// Checagem de Autorização de Dados (Regra 2.1)
const verificarAutorizacao = async (estacionamentoId, userId) => {
    // ATENÇÃO: Model names em snake_case para forçar o erro a ser do Prisma
    
    // 1. Checa se é proprietário
    const isProprietario = await prisma.estacionamento.count({
        where: { id_estacionamento: estacionamentoId, id_proprietario: userId },
    });
    if (isProprietario > 0) return true;

    // 2. Checa se é funcionário/gestor
    const isEmployee = await prisma.estacionamento_funcionario.count({
        where: { id_estacionamento: estacionamentoId, id_usuario: userId },
    });
    return isEmployee > 0;
};

// 1. Controller para Admin (Global)
export const naviAdminController = async (req, res) => {
    try {
        const validationResult = askNaviAdminSchema.safeParse(req.body);
        if (!validationResult.success) { return res.status(400).json({ error: 'Dados inválidos.', details: validationResult.error.flatten() }); }
        const { user_question, history } = validationResult.data;

        // O BLOCO QUE CAUSA O 500 ESTÁ AQUI ABAIXO
        const dataContext = await NaviService.buscaDados.buscaGlobal();
        
        const naviResponse = await NaviService.ask(user_question, dataContext, history);
        
        if (naviResponse.type === 'document') {
             return DocumentService.generateAndSend(res, naviResponse, dataContext, 'Global_Navi');
        }

        res.status(200).json(naviResponse);
    } catch (error) {
        // CORREÇÃO CRÍTICA: Retorna o erro detalhado para o frontend e loga no backend
        console.error('ERRO INTERNO 500 (Admin):', error); 
        res.status(500).json({ error: 'Erro interno ao processar a requisição da IA.', debug: error.message });
    }
};

// 2. Controller para Proprietário (Específico)
export const naviProprietarioController = async (req, res) => {
    try {
        const validationResult = askNaviProprietarioSchema.safeParse(req.body);
        if (!validationResult.success) { return res.status(400).json({ error: 'Dados inválidos.', details: validationResult.error.flatten() }); }
        const { id_estacionamento, user_question, history } = validationResult.data;
        const userId = req.usuario.id_usuario; 

        // REGRA CRÍTICA: AUTORIZAÇÃO DE DADOS
        const temPermissao = await verificarAutorizacao(id_estacionamento, userId);
        if (!temPermissao && req.usuario.papel !== 'ADMINISTRADOR') {
            return res.status(403).json({ error: 'Acesso proibido. Você não tem permissão para este estacionamento.' });
        }

        // O BLOCO QUE CAUSA O 500 ESTÁ AQUI ABAIXO
        const dataContext = await NaviService.buscaDados.buscaEstacionamento(id_estacionamento);
        
        const naviResponse = await NaviService.ask(user_question, dataContext, history);
        
        if (naviResponse.type === 'document') {
             return DocumentService.generateAndSend(res, naviResponse, dataContext, 'Proprietario_Navi');
        }

        res.status(200).json(naviResponse);
    } catch (error) {
        // CORREÇÃO CRÍTICA: Retorna o erro detalhado para o frontend e loga no backend
        console.error('ERRO INTERNO 500 (Proprietário):', error);
        res.status(500).json({ error: 'Erro interno ao processar a requisição da IA.', debug: error.message });
    }
};