import 'dotenv/config';

import { GoogleGenerativeAI } from '@google/generative-ai';



// =================================================================

// 1. CONFIGURAÇÃO DO CLIENTE GEMINI

// =================================================================

if (!process.env.GOOGLE_API_KEY) {

  throw new Error('A variável de ambiente GOOGLE_API_KEY não foi encontrada.');

}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Corrigido para 1.5-flash



// =================================================================

// 2. PERSONA DA INTELIGÊNCIA ARTIFICIAL

// =================================================================

// A sua persona, exatamente como você a definiu.

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

   - Para o campo chartData, gere apenas a estrutura de dados e as opções de configuração visual. **NUNCA gere a propriedade 'callbacks' dentro das opções.**

   - Se a pergunta pedir imagens, diga que você não é um modelo capaz de gerar imagens, mas pode gerar gráficos.

**5. Tratamento de Contexto Vazio:** Se o "Contexto de Dados para Análise" for um objeto vazio ({}), a pergunta é geral. Responda com base na sua identidade e objetivo.

**6. Memória da Conversa:** A seguir, você receberá o histórico da conversa atual. Use este histórico para entender o contexto de perguntas de acompanhamento.

**7. Linguagem Natural:** Ao apresentar os dados, traduza os nomes técnicos das chaves do JSON para uma linguagem natural e amigável.

**8. Formatação de Texto:** Use Markdown para formatar suas respostas de texto para melhor legibilidade. Use títulos (com ##), negrito (com **) e listas (com -).

`;



// =================================================================

// 3. FUNÇÃO DE SERVIÇO EXPORTADA

// =================================================================

// [CORREÇÃO-CHAVE]: A lógica da IA agora está dentro de uma função exportada.

export const getGeminiResponse = async (user_question, data_context, history) => {

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



    // Limpa a resposta da IA para garantir que o parse funcione

    const cleanedResponse = rawTextResponse.replace(/^```json\s*/, '').replace(/```$/, '').trim();

    return JSON.parse(cleanedResponse);



  } catch (e) {

    console.error('Falha ao parsear JSON da IA. Tratando como texto.', e);

    // Se falhar, encapsula a resposta bruta num formato de texto padrão

    return { type: 'text', content: "Ocorreu um erro ao processar a resposta da IA. Por favor, tente novamente." };

  }

}; 