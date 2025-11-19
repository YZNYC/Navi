import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../config/prisma.js'; 

// =================================================================
// 1. CONFIGURAÇÃO DO CLIENTE GEMINI
// =================================================================
if (!process.env.GOOGLE_API_KEY) {
  throw new Error('A variável de ambiente GOOGLE_API_KEY não foi encontrada.');
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' }); 

// =================================================================
// 2. PERSONA DA INTELIGÊNCIA ARTIFICIAL
// =================================================================
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
**4. Formato da Resposta (REGRA CRÍTICA):** A sua resposta DEVE ser sempre uma string contendo um objeto JSON perfeitamente válido e pronto para ser 'parseado' (JSON.parse), sem exceções.
  - **IMPORTANTE:** Certifique-se de que todos os caracteres especiais dentro dos valores do JSON, como aspas duplas (") e quebras de linha (especialmente em resumos Markdown), estão devidamente escapados com barras invertidas (ex: \\", \\n).
  - Se a pergunta for um pedido de análise ou insight em texto, o JSON deve ter a estrutura: \`{ "type": "text", "content": "Seu insight em Markdown aqui... Lembre-se de escapar \\n e \\"..." }\`
  - Se a pergunta pedir um gráfico, o JSON DEVE ter a estrutura: \`{ "type": "chart", "insightText": "Um breve resumo do gráfico...", "chartData": { ...objeto de dados para Chart.js... } }\`
  - Se a pergunta for um pedido formal de relatório, o JSON DEVE ter a estrutura: \`{ "type": "document", "insightText": "Breve resumo do documento...", "documentType": "PDF"|"DOCX", "documentTitle": "Titulo do Relatório" }\`
  - Para o campo chartData, gere apenas a estrutura de dados e as opções de configuração visual. **NUNCA gere a propriedade 'callbacks' dentro das opções.**
  - Se a pergunta pedir imagens, diga que você não é um modelo capaz de gerar imagens, mas pode gerar gráficos.
**5. Tratamento de Contexto Vazio:** Se o "Contexto de Dados para Análise" for um objeto vazio ({}), a pergunta é geral. Responda com base na sua identidade e objetivo.
**6. Memória da Conversa:** A seguir, você receberá o histórico da conversa atual. Use este histórico para entender o contexto de perguntas de acompanhamento.
**7. Linguagem Natural:** Ao apresentar os dados, traduza os nomes técnicos das chaves do JSON para uma linguagem natural e amigável.
**8. Formatação de Texto:** Use Markdown para formatar suas respostas de texto para melhor legibilidade. Use títulos (com ##), negrito (com **) e listas (com -).
`;


// === 3. LÓGICA DE BUSCA DE DADOS (BuscaDados) - Buscas Prisma ===

const BuscaDados = {
    // 3.1. Busca para Administrador (Global)
    buscaGlobal: async () => {
        // Nomes de modelos diretos (usuario, estacionamento, avaliacao)
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

    // 3.2. Busca para Proprietário (Específico)
    buscaEstacionamento: async (id_estacionamento) => {
        const id = id_estacionamento;

        const vagasStatus = await prisma.vaga.groupBy({
            by: ['status', 'tipo_vaga'],
            where: { id_estacionamento: id },
            _count: { id_vaga: true },
        });

        // CORREÇÃO: Usando a relação aninhada através do model plano_mensal
        // para encontrar os contratos que pertencem ao estacionamento.
        const totalMensalistas = await prisma.contrato_mensalista.count({ 
            where: { 
                status: 'ATIVO', 
                // Filtra pelo ID do estacionamento através da relação com o plano
                plano: { 
                    id_estacionamento: id 
                } 
            } 
        });
        
        // Faturamento (Exemplo)
        const faturamentoAgregado = await prisma.pagamento.aggregate({
            where: { 
                status: 'APROVADO',
                // Filtra pelo ID do estacionamento através da relação Reserva -> Vaga
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


// =================================================================
// 4. OBJETO DE SERVIÇO EXPORTADO (NaviService)
// =================================================================

export const NaviService = {
    /**
     * Envia o prompt para o Gemini e trata a resposta.
     */
    ask: async (user_question, data_context, history) => {

        const formattedHistory = (history || [])
            .map(msg => `${msg.role}: ${msg.parts.map(p => p.text).join('')}`)
            .join('\n');

        const prompt = `
            ${NAVI_PERSONA}

            ## Histórico da Conversa Anterior
            ${formattedHistory}

            ## Contexto de Dados para Análise (Extraído do Banco de Dados)
            ${JSON.stringify(data_context, null, 2)}

            ## Nova Pergunta do Gestor
            ${user_question}
        `;

        console.log('Enviando prompt para o Gemini...');
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const rawTextResponse = response.text();
            console.log('Resposta bruta recebida do Gemini:', rawTextResponse);

            const cleanedResponse = rawTextResponse.replace(/^```json\s*/, '').replace(/```$/, '').trim();
            return JSON.parse(cleanedResponse);

        } catch (e) {
            console.error('Falha ao parsear JSON da IA. Tratando como texto.', e);
            return { type: 'text', content: "Ocorreu um erro ao processar a resposta da IA. Por favor, tente novamente." };
        }
    },
    
    // Exporta as funções de busca para uso no Controller
    buscaDados: BuscaDados,
};