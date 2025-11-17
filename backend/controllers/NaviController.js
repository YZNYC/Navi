import prisma from '../config/prisma.js';
import { getGeminiResponse } from '../services/navi.service.js'; // Agora importa do serviço correto

/**
 * Controller para a IA do PROPRIETÁRIO.
 */
export const askProprietario = async (req, res) => {
    // [LOG DE DIAGNÓSTICO 1]
    // Se este log não aparecer, o problema está nas suas rotas ou no middleware de autenticação (AuthMiddlewares.js)
    console.log(`[NaviController] Rota /proprietario/ask ATINGIDA!`);
    console.log(`[NaviController] Utilizador autenticado: ${req.usuario?.id_usuario}`);

    const { id_estacionamento, user_question, history } = req.body;
    const { id_usuario } = req.usuario;

    try {
        // 1. VERIFICA A PERMISSÃO
        // [LOG DE DIAGNÓSTICO 2]
        console.log(`[NaviController] Verificando permissão para estacionamento: ${id_estacionamento}...`);
        
        const permissao = await prisma.estacionamento.findFirst({
            where: { id_estacionamento: id_estacionamento, id_proprietario: id_usuario }
        });

        // [LOG DE DIAGNÓSTICO 3]
        // Se o código "congelar" antes deste log, o problema é a sua variável DATABASE_URL no .env
        console.log(`[NaviController] Permissão verificada. Resultado: ${permissao ? 'PERMITIDO' : 'NEGADO'}`);

        if (!permissao) {
            return res.status(403).json({ error: 'Acesso negado a este estacionamento.' });
        }

        // 2. BUSCA OS DADOS COM PRISMA
        // [LOG DE DIAGNÓSTICO 4]
        console.log(`[NaviController] Buscando dados do estacionamento no Prisma...`);
        const [vagasPorStatus, totalMensalistasAtivos, faturamentoTotal, mediaAvaliacoes, planosAtivos] = await prisma.$transaction([
            prisma.vaga.groupBy({ by: ['status'], where: { id_estacionamento }, _count: { status: true } }),
            prisma.contrato_mensalista.count({ where: { plano_mensal: { id_estacionamento }, status: 'ATIVO' } }), // Corrigido 'plano' para 'plano_mensal'
            prisma.pagamento.aggregate({ _sum: { valor_liquido: true }, where: { reserva: { vaga: { id_estacionamento } }, status: 'APROVADO' } }),
            prisma.avaliacao.aggregate({ _avg: { nota: true }, where: { id_estacionamento } }), // Corrigido 'estacionamento: { id_estacionamento }'
            prisma.plano_mensal.findMany({ where: { id_estacionamento }, select: { nome_plano: true, preco_mensal: true } }), // Corrigido 'nome' e 'preco' para 'nome_plano' e 'preco_mensal'
        ]);

        // [LOG DE DIAGNÓSTICO 5]
        console.log(`[NaviController] Dados do Prisma obtidos com sucesso.`);

        // 3. MONTA O CONTEXTO DE DADOS
        const data_context = {
            metricas_estacionamento: {
                id: id_estacionamento,
                distribuicao_vagas: vagasPorStatus.map(v => ({ status: v.status, contagem: v._count.status })),
                total_mensalistas_ativos: totalMensalistasAtivos,
                faturamento_total_aprovado: faturamentoTotal._sum.valor_liquido || 0,
                avaliacao_media: mediaAvaliacoes._avg.nota ? parseFloat(mediaAvaliacoes._avg.nota.toFixed(2)) : 'N/A',
                planos_oferecidos: planosAtivos,
            }
        };

        // 4. CHAMA O SERVIÇO DA IA COM OS DADOS PRONTOS
        // [LOG DE DIAGNÓSTICO 6]
        console.log(`[NaviController] Enviando dados para o navi.service...`);
        const iaResponse = await getGeminiResponse(user_question, data_context, history);
        
        // 5. RETORNA A RESPOSTA DA IA PARA O FRONTEND
        return res.status(200).json(iaResponse);

    } catch (error) {
        // [LOG DE DIAGNÓSTICO 7] - Se algo falhar, veremos o erro aqui
        console.error("Erro no controller askProprietario:", error);
        return res.status(500).json({ error: 'Erro interno ao processar sua pergunta.' });
    }
};

/**
 * Controller para a IA do ADMINISTRADOR.
 */
export const askAdmin = async (req, res) => {
    // [LOG DE DIAGNÓSTICO 1]
    console.log(`[NaviController] Rota /admin/ask ATINGIDA!`);
    console.log(`[NaviController] Utilizador autenticado: ${req.usuario?.id_usuario}`);

    const { user_question, history } = req.body;

    try {
        // [LOG DE DIAGNÓSTICO 2]
        console.log(`[NaviController] Buscando dados globais para Admin...`);
        
        // [CORREÇÃO] A sua tabela não tem um campo 'ativo' em 'estacionamento'. Removi o filtro.
        const [totalUsuarios, totalEstacionamentos, faturamentoGlobal, usuariosPorPapel] = await prisma.$transaction([
            prisma.usuario.count(),
            prisma.estacionamento.count(), 
            prisma.pagamento.aggregate({ _sum: { valor_liquido: true }, where: { status: 'APROVADO' } }),
            prisma.usuario.groupBy({ by: ['papel'], _count: { papel: true } }),
        ]);

        // [LOG DE DIAGNÓSTICO 3]
        // Se "congelar" antes disto, o problema é a ligação do Prisma.
        console.log(`[NaviController] Dados de Admin obtidos.`);

        const data_context = {
            metricas_plataforma: {
                total_usuarios_cadastrados: totalUsuarios,
                total_estacionamentos_ativos: totalEstacionamentos,
                faturamento_geral_aprovado: faturamentoGlobal._sum.valor_liquido || 0,
                distribuicao_usuarios_por_papel: usuariosPorPapel.map(u => ({ papel: u.papel, contagem: u._count.papel })),
            }
        };

        // [LOG DE DIAGNÓSTICO 4]
        console.log(`[NaviController] Enviando dados de Admin para o navi.service...`);
        const iaResponse = await getGeminiResponse(user_question, data_context, history);
        return res.status(200).json(iaResponse);

    } catch (error) {
        // [LOG DE DIAGNÓSTICO 5]
        console.error("Erro no controller askAdmin:", error);
        return res.status(500).json({ error: 'Erro interno ao processar sua pergunta.' });
    }
};