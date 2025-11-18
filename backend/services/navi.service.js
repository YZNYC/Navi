// src/navi/models/NaviService.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../config/prisma.js'; // Caminho corrigido para o config/prisma.js

// === 1. CONFIGURAÇÃO DA PERSONA E GEMINI ===
const NAVI_PERSONA = `
## Persona: Navi, O Especialista em Gestão

**1. Identidade:** Você é o Navi, um assistente virtual especialista em análise de dados para gestão de estacionamentos.
**2. Objetivo Principal:** Sua missão é transformar dados operacionais em insights claros e acionáveis para ajudar o gestor a tomar decisões inteligentes.
**3. Regras de Comportamento:**
   - **Baseado em Dados:** Sempre baseie suas análises estritamente nos dados fornecidos.
   - **Clareza e Simplicidade:** Comunique-se de forma clara e direta.
   - **Proativo e Prescritivo:** Sugira ações concretas.
   - **Justifique Suas Respostas:** Sempre explique o "porquê" com base nos dados.
   - **Tom Profissional:** Mantenha um tom consultivo e confiável.
**4. Formato da Resposta:** Sua resposta DEVE ser sempre um objeto JSON válido.
   - Se a pergunta for um pedido de análise ou insight em texto, o JSON deve ter a estrutura: \`{ "type": "text", "content": "Seu insight aqui..." }\`
   - Se a pergunta pedir um gráfico, o JSON DEVE ter a estrutura: \`{ "type": "chart", "insightText": "Um breve resumo do gráfico...", "chartData": { ...objeto de dados para Chart.js... } }\`
   - Se a pergunta for um pedido formal de relatório ou documento, o JSON DEVE ter a estrutura: 
     \`{ "type": "document", "insightText": "Breve resumo do documento...", "documentType": "PDF"|"DOCX", "documentTitle": "Titulo do Relatório" }\`
   - Para o campo chartData, gere apenas a estrutura de dados e as opções de configuração visual (como cores, títulos e escalas). **NUNCA gere a propriedade 'callbacks' dentro das opções.**
   - Se a pergunta pedir imagens, diga que você não é um modelo capaz de gerar imagens, mas pode gerar gráficos.
**5. Tratamento de Contexto Vazio:** Se o "Contexto de Dados para Análise" for um objeto vazio ({}), a pergunta é geral. Responda com base na sua identidade e objetivo.
**6. Memória da Conversa:** A seguir, você receberá o histórico da conversa atual. Use este histórico para entender o contexto de perguntas de acompanhamento. Se o usuário fornecer dados após pedir um gráfico, use o pedido anterior do histórico para gerar o gráfico com os novos dados.
`;

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('A variável de ambiente GOOGLE_API_KEY não foi encontrada.');
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


// === 2. LÓGICA DE BUSCA DE DADOS (BuscaDados) ===

const BuscaDados = {
    // 2.1. Busca para Administrador (Global)
    buscaGlobal: async () => {
        const totalEstacionamentos = await prisma.estacionamento.count({ where: { ativo: true } });
        const totalUsuarios = await prisma.usuario.count({ where: { ativo: true } });
        const contagemPorPapel = await prisma.usuario.groupBy({
            by: ['papel'],
            where: { ativo: true },
            _count: { id_usuario: true },
        });
        const mediaAvaliacao = await prisma.avaliacao.aggregate({ _avg: { nota: true } });
        
        return {
            meta: { tipo: "GlobalAdministrador" },
            estacionamentos: { total: totalEstacionamentos },
            usuarios: {
                total: totalUsuarios,
                contagemPorPapel: contagemPorPapel.map(item => ({ papel: item.papel, count: item._count.id_usuario })),
            },
            metricasGerais: { mediaAvaliacaoGlobal: mediaAvaliacao._avg.nota },
        };
    },

    // 2.2. Busca para Proprietário (Específico)
    buscaEstacionamento: async (id_estacionamento) => {
        const id = id_estacionamento;

        const vagasStatus = await prisma.vaga.groupBy({
            by: ['status', 'tipo_vaga'],
            where: { id_estacionamento: id },
            _count: { id_vaga: true },
        });

        // Contagem de Mensalistas Ativos
        const totalMensalistas = await prisma.contratoMensalista.count({
            where: { status: 'ATIVO', plano_mensal: { id_estacionamento: id } }
        });
        
        // Faturamento (Exemplo)
        const faturamentoAgregado = await prisma.pagamento.aggregate({
            where: { 
                status: 'APROVADO',
                reserva: { vaga: { id_estacionamento: id } }
            },
            _sum: { valor_liquido: true }
        });

        return {
            meta: { tipo: "ProprietarioEstacionamento", id_estacionamento: id },
            vagas: {
                detalhes: vagasStatus.map(v => ({ status: v.status, tipo: v.tipo_vaga, count: v._count.id_vaga })),
            },
            mensalistas: { totalAtivos: totalMensalistas },
            faturamento: { totalAprovadoGeral: faturamentoAgregado._sum.valor_liquido || 0 },
        };
    },
};


// === 3. LÓGICA DE INTERAÇÃO COM GEMINI ===

export const NaviService = {
    /**
     * Envia o prompt para o Gemini e trata a resposta.
     */
    ask: async (user_question, data_context, history = []) => {
        const formattedHistory = (history || [])
            .map(msg => `${msg.role}: ${msg.parts.map(p => p.text).join('')}`)
            .join('\n');

        const prompt = `
            ${NAVI_PERSONA}
            ## Histórico da Conversa Anterior
            ${formattedHistory || 'Nenhum histórico fornecido.'}
            ## Contexto de Dados para Análise
            ${JSON.stringify(data_context, null, 2)}
            ## Nova Pergunta do Gestor
            ${user_question}
        `;
        
        const result = await model.generateContent(prompt);
        const rawTextResponse = result.response.text();

        try {
            const cleanedResponse = rawTextResponse.replace(/^```json\s*/, '').replace(/```$/, '').trim();
            return JSON.parse(cleanedResponse);
        } catch (e) {
            console.error('Falha ao parsear JSON da IA:', e);
            return { type: 'text', content: rawTextResponse };
        }
    },
    
    // Exporta as funções de busca para uso no Controller
    buscaDados: BuscaDados,
};