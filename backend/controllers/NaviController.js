import prisma from '../config/prisma.js';

import { getGeminiResponse } from '../services/navi.service.js'; // Agora importa do serviço correto



/**

 * Controller para a IA do PROPRIETÁRIO.

 */

export const askProprietario = async (req, res) => {

    const { id_estacionamento, user_question, history } = req.body;

    const { id_usuario } = req.usuario;



    try {

        // 1. VERIFICA A PERMISSÃO

        const permissao = await prisma.estacionamento.findFirst({

            where: { id_estacionamento: id_estacionamento, id_proprietario: id_usuario }

        });



        if (!permissao) {

            return res.status(403).json({ error: 'Acesso negado a este estacionamento.' });

        }



        // 2. BUSCA OS DADOS COM PRISMA (Lógica já correta)

        const [vagasPorStatus, totalMensalistasAtivos, faturamentoTotal, mediaAvaliacoes, planosAtivos] = await prisma.$transaction([

            prisma.vaga.groupBy({ by: ['status'], where: { id_estacionamento }, _count: { status: true } }),

            prisma.contrato_mensalista.count({ where: { plano: { id_estacionamento }, status: 'ATIVO' } }),

            prisma.pagamento.aggregate({ _sum: { valor_liquido: true }, where: { reserva: { vaga: { id_estacionamento } }, status: 'APROVADO' } }),

            prisma.avaliacao.aggregate({ _avg: { nota: true }, where: { estacionamento: { id_estacionamento } } }),

            prisma.plano_mensal.findMany({ where: { id_estacionamento }, select: { nome: true, preco: true } }),

        ]);



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

        const iaResponse = await getGeminiResponse(user_question, data_context, history);

       

        // 5. RETORNA A RESPOSTA DA IA PARA O FRONTEND

        return res.status(200).json(iaResponse);



    } catch (error) {

        console.error("Erro no controller askProprietario:", error);

        return res.status(500).json({ error: 'Erro interno ao processar sua pergunta.' });

    }

};



/**

 * Controller para a IA do ADMINISTRADOR.

 */

export const askAdmin = async (req, res) => {

    const { user_question, history } = req.body;



    try {

        // Mesma lógica: busca dados globais, monta o contexto e chama o serviço

        const [totalUsuarios, totalEstacionamentos, faturamentoGlobal, usuariosPorPapel] = await prisma.$transaction([

            prisma.usuario.count(),

            prisma.estacionamento.count({ where: { ativo: true } }),

            prisma.pagamento.aggregate({ _sum: { valor_liquido: true }, where: { status: 'APROVADO' } }),

            prisma.usuario.groupBy({ by: ['papel'], _count: { papel: true } }),

        ]);



        const data_context = {

            metricas_plataforma: {

                total_usuarios_cadastrados: totalUsuarios,

                total_estacionamentos_ativos: totalEstacionamentos,

                faturamento_geral_aprovado: faturamentoGlobal._sum.valor_liquido || 0,

                distribuicao_usuarios_por_papel: usuariosPorPapel.map(u => ({ papel: u.papel, contagem: u._count.papel })),

            }

        };



        const iaResponse = await getGeminiResponse(user_question, data_context, history);

        return res.status(200).json(iaResponse);



    } catch (error) {

        console.error("Erro no controller askAdmin:", error);

        return res.status(500).json({ error: 'Erro interno ao processar sua pergunta.' });

    }

};