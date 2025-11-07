// src/controllers/NaviProprietarioController.js

import prisma from '../config/prisma.js'; // Ajuste o caminho se necessário
import { askNavi } from '../services/navi.service.js';
import { generateDocument } from '../services/document.service.js'; // Para geração de documentos
import { askNaviProprietarioSchema } from '../schemas/navi.schema.js'; // Ajuste o caminho se necessário

// Função auxiliar para checar se o usuário tem permissão sobre o estacionamento
const verificarAcessoEstacionamento = async (estacionamentoId, userId) => {
    // Checa se o usuário é o proprietário
    const isProprietario = await prisma.estacionamento.count({
        where: { id_estacionamento: estacionamentoId, id_proprietario: userId },
    });
    if (isProprietario > 0) return true;

    // Checa se o usuário é um GESTOR/OPERADOR (Ajuste as permissões necessárias aqui)
    const isFuncionario = await prisma.estacionamento_funcionario.count({
        where: { id_estacionamento: estacionamentoId, id_usuario: userId },
    });
    return isFuncionario > 0;
};


export const naviProprietarioController = async (req, res) => {
  try {
    // 1. VALIDAÇÃO ZOD (INPUT)
    const validationResult = askNaviProprietarioSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Dados de requisição inválidos.', 
        details: validationResult.error.flatten() 
      });
    }
    const { id_estacionamento, user_question, history } = validationResult.data;
    const userId = req.usuario.id_usuario;

    // 2. AUTORIZAÇÃO (CRÍTICO: SEGURANÇA POR ID!)
    const temPermissao = await verificarAcessoEstacionamento(id_estacionamento, userId);
    if (!temPermissao && req.usuario.papel !== 'ADMINISTRADOR') {
        return res.status(403).json({ error: 'Acesso proibido. Você não gerencia este estacionamento.' });
    }

    // 3. BUSCA DE DADOS (GERAÇÃO DO DATA_CONTEXT ESPECÍFICO)
    
    // Vagas (Contagem por Status e Tipo)
    const vagasStatus = await prisma.vaga.groupBy({
        by: ['status', 'tipo_vaga'],
        where: { id_estacionamento: id_estacionamento },
        _count: { id_vaga: true },
    });
    
    // Mensalistas (Contratos Ativos)
    const totalMensalistas = await prisma.contrato_mensalista.count({
        where: { 
            status: 'ATIVO',
            plano_mensal: { id_estacionamento: id_estacionamento }
        }
    });

    // Planos Ativos
    const planosAtivos = await prisma.plano_mensal.findMany({
        where: { id_estacionamento: id_estacionamento, ativo: true },
        select: { id_plano: true, nome_plano: true, preco_mensal: true }
    });

    // Avaliações (Média e Total)
    const avaliacoes = await prisma.avaliacao.aggregate({
        where: { id_estacionamento: id_estacionamento },
        _avg: { nota: true },
        _count: { id_avaliacao: true }
    });
    
    // Faturamento (Exemplo de agregação de todos os tempos, Status APROVADO)
    const faturamentoAgregado = await prisma.pagamento.aggregate({
        where: { 
            status: 'APROVADO',
            reserva: {
                vaga: { id_estacionamento: id_estacionamento }
            }
        },
        _sum: { valor_liquido: true }
    });

    // Reservas (Contagem por Status)
    const reservasStatus = await prisma.reserva.groupBy({
        by: ['status'],
        where: { vaga: { id_estacionamento: id_estacionamento } },
        _count: { id_reserva: true },
    });


    // Montagem do Contexto (NÃO INCLUIR PLACA OU PII)
    const dataContext = {
        metaData: {
            dataGeracao: new Date().toISOString(),
            idEstacionamento: id_estacionamento,
            tipoContexto: "ProprietarioEstacionamento",
        },
        vagas: {
            total: vagasStatus.reduce((acc, v) => acc + v._count.id_vaga, 0),
            detalhes: vagasStatus.map(v => ({ status: v.status, tipo: v.tipo_vaga, count: v._count.id_vaga }))
        },
        mensalistas: {
            totalAtivos: totalMensalistas,
            planos: planosAtivos,
        },
        avaliacoes: {
            mediaNota: avaliacoes._avg.nota,
            total: avaliacoes._count.id_avaliacao,
        },
        faturamento: {
            totalAprovadoGeral: faturamentoAgregado._sum.valor_liquido || 0,
        },
        reservas: {
            contagemPorStatus: reservasStatus.map(r => ({ status: r.status, count: r._count.id_reserva })),
        }
    };

    // 4. CHAMADA DA IA
    const naviResponse = await askNavi(user_question, dataContext, history);

    // 5. TRATAMENTO DA RESPOSTA (LÓGICA DE DOCUMENTO)
    if (naviResponse.type === 'document' && naviResponse.documentType) {
        const { documentType, documentTitle } = naviResponse;
        
        const fileBuffer = await generateDocument(documentType, documentTitle, dataContext);

        const contentType = documentType === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const fileExtension = documentType === 'PDF' ? 'pdf' : 'docx';
        const estacionamentoNome = await prisma.estacionamento.findUnique({ where: { id_estacionamento: id_estacionamento }, select: { nome: true } });
        const fileName = `${documentTitle.replace(/\s/g, '_')}_${estacionamentoNome.nome.replace(/\s/g, '_')}_Navi.${fileExtension}`;

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', fileBuffer.length);
        
        return res.status(200).send(fileBuffer);
    }

    // 6. RESPOSTA JSON (Texto ou Gráfico)
    return res.status(200).json(naviResponse);

  } catch (error) {
    console.error('ERRO NO NAVI PROPRIETARIO CONTROLLER:', error);
    // Em caso de erro, garantir que a resposta seja JSON para o frontend
    return res.status(500).json({ error: 'Ocorreu um erro interno ao processar a requisição da IA.' });
  }
};