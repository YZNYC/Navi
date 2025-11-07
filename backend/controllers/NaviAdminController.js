// src/controllers/NaviAdminController.js

import prisma from '../config/prisma.js'; // Ajuste o caminho se necessário
import { askNavi } from '../services/navi.service.js';
import { generateDocument } from '../services/document.service.js'; // Para geração de documentos
import { askNaviAdminSchema } from '../schemas/navi.schema.js'; // Ajuste o caminho se necessário

export const naviAdminController = async (req, res) => {
  try {
    // 1. VALIDAÇÃO ZOD (INPUT)
    const validationResult = askNaviAdminSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Dados de requisição inválidos.', 
        details: validationResult.error.flatten() 
      });
    }
    const { user_question, history } = validationResult.data;
    
    // 2. AUTORIZAÇÃO (Implicita pelo middleware authorize(['ADMINISTRADOR']))

    // 3. BUSCA DE DADOS (GERAÇÃO DO DATA_CONTEXT GLOBAL)
    
    const totalEstacionamentos = await prisma.estacionamento.count();
    const totalUsuarios = await prisma.usuario.count({ where: { ativo: true } });

    // Contagem de usuários por papel (Roles)
    const contagemPorPapel = await prisma.usuario.groupBy({
        by: ['papel'],
        where: { ativo: true },
        _count: {
            id_usuario: true,
        },
    });
    
    // Calcula a média de avaliações global
    const mediaAvaliacao = await prisma.avaliacao.aggregate({
        _avg: {
            nota: true,
        },
    });
    
    // Contagem de Vagas por Status
    const vagasStatus = await prisma.vaga.groupBy({
        by: ['status'],
        _count: {
            id_vaga: true,
        },
    });
    
    // Montagem do Contexto (APENAS DADOS NÃO SIGILOSOS)
    const dataContext = {
        metaData: {
            dataGeracao: new Date().toISOString(),
            tipoContexto: "GlobalAdministrador",
        },
        estacionamentos: {
            total: totalEstacionamentos,
        },
        usuarios: {
            total: totalUsuarios,
            contagemPorPapel: contagemPorPapel.map(item => ({
                papel: item.papel, 
                count: item._count.id_usuario
            })),
        },
        operacional: {
            vagas: vagasStatus.map(v => ({ status: v.status, count: v._count.id_vaga })),
        },
        metricasGerais: {
            mediaAvaliacaoGlobal: mediaAvaliacao._avg.nota,
        },
    };

    // 4. CHAMADA DA IA
    const naviResponse = await askNavi(user_question, dataContext, history);
    
    // 5. TRATAMENTO DA RESPOSTA (LÓGICA DE DOCUMENTO)
    if (naviResponse.type === 'document' && naviResponse.documentType) {
        const { documentType, documentTitle } = naviResponse;
        
        const fileBuffer = await generateDocument(documentType, documentTitle, dataContext);

        const contentType = documentType === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const fileExtension = documentType === 'PDF' ? 'pdf' : 'docx';
        const fileName = `${documentTitle.replace(/\s/g, '_')}_Global_Navi.${fileExtension}`;

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', fileBuffer.length);
        
        return res.status(200).send(fileBuffer);
    }

    // 6. RESPOSTA JSON (Texto ou Gráfico)
    return res.status(200).json(naviResponse);

  } catch (error) {
    console.error('ERRO NO NAVI ADMIN CONTROLLER:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno ao processar a requisição da IA.' });
  }
};