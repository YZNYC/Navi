// src/services/gemini.service.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// A persona é mantida aqui para ser injetada no prompt
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
**4. Formato da Resposta (REGRA CRÍTICA):** A sua resposta DEVE ser sempre uma string contendo um objeto JSON perfeitamente válido e pronto para ser 'parseado', sem exceções. Certifique-se de que todos os caracteres especiais dentro dos valores do JSON, como aspas duplas (") e quebras de linha, estão devidamente escapados com barras invertidas (ex: \\", \\n).
   - Se a pergunta for um pedido de análise ou insight em texto, o JSON deve ter a estrutura: \`{ "type": "text", "content": "Seu insight aqui..." }\`
   - Se a pergunta pedir um gráfico, o JSON DEVE ter a estrutura: \`{ "type": "chart", "insightText": "Um breve resumo do gráfico...", "chartData": { ...objeto de dados para Chart.js... } }\`
   - Para o campo chartData, gere apenas a estrutura de dados e as opções de configuração visual. **NUNCA gere a propriedade 'callbacks' dentro das opções.**
   - Se a pergunta pedir imagens, diga que você não é um modelo capaz de gerar imagens, mas pode gerar gráficos e documentos.
    - Se a pergunta for um pedido formal de relatório ou documento (ex: "Gere o relatório mensal em PDF"), o JSON DEVE ter a estrutura: 
     \`{ "type": "document", "insightText": "Breve resumo do documento...", "documentType": "PDF"|"DOCX", "documentTitle": "Titulo do Relatório" }\`
   - Para solicitações de gráfico, **NUNCA gere a propriedade 'callbacks' dentro das opções.**
**5. Tratamento de Contexto Vazio:** Se o "Contexto de Dados para Análise" for um objeto vazio ({}), a pergunta é geral. Responda com base na sua identidade e objetivo.
**6. Memória da Conversa:** A seguir, você receberá o histórico da conversa atual. Use este histórico para entender o contexto de perguntas de acompanhamento.
**7. Linguagem Natural:** Ao apresentar os dados, traduza os nomes técnicos das chaves do JSON para uma linguagem natural e amigável.
**8. Formatação de Texto:** Use Markdown para formatar suas respostas de texto para melhor legibilidade. Use títulos (com ##), negrito (com **) e listas (com -).
`;

// A inicialização é feita uma vez
if (!process.env.GOOGLE_API_KEY) {
  // Lança erro para garantir que a chave esteja configurada
  throw new Error('A variável de ambiente GOOGLE_API_KEY não foi encontrada.');
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


/**
 * Função principal para interagir com o Gemini, centralizada.
 * @param {string} user_question - A pergunta do gestor.
 * @param {object} data_context - Os dados estruturados (gerados pelo Prisma no Controller).
 * @param {Array} history - O histórico da conversa (opcional).
 * @returns {object} - O objeto JSON final (type: 'text' ou 'chart').
 */
export async function askNavi(user_question, data_context, history = []) {

  // Formata o histórico para o prompt
  const formattedHistory = history
    .map(msg => `${msg.role}: ${msg.parts.map(p => p.text).join('')}`)
    .join('\n');

  // Montagem do prompt
  const prompt = `
    ${NAVI_PERSONA}

    ## Histórico da Conversa Anterior
    ${formattedHistory || 'Nenhum histórico fornecido.'}

    ## Contexto de Dados para Análise (Dados operacionais)
    // Os dados a seguir representam o contexto que você DEVE usar para análise.
    // Analise os números de vagas, usuários, avaliações e a distribuição de roles.
    ${JSON.stringify(data_context, null, 2)}

    ## Nova Pergunta do Gestor
    ${user_question}
  `;

  try {
    const result = await model.generateContent(prompt);
    const rawTextResponse = result.response.text();

    // Lógica de limpeza e parsing JSON (tratamento de ```json)
    let jsonResponse;
    const cleanedResponse = rawTextResponse
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim();

    jsonResponse = JSON.parse(cleanedResponse);
    return jsonResponse;
    
  } catch (e) {
    console.error('Erro no Serviço Gemini (parse ou requisição):', e);
    // Em caso de falha no parse ou na requisição, retorna a mensagem de erro.
    return { 
        type: 'text', 
        content: `Ocorreu um erro. Mensagem bruta da IA: ${rawTextResponse || 'Nenhuma resposta.'}. Detalhes técnicos: ${e.message}` 
    };
  }
}