import { z } from 'zod';

export const paramsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "O ID deve ser um número positivo."), // Garante que o ID na URL seja numérico
  
  }),
});

// Versão específica para o aninhamento de rotas de política de preço
export const politicaPrecoParamsSchema = z.object({
  params: z.object({
    estacionamentoId: z.string().regex(/^\d+$/, "O ID do estacionamento deve ser um número."),
    politicaId: z.string().regex(/^\d+$/, "O ID da política deve ser um número.").optional(),
  }),
});