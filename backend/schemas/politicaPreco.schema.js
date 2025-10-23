import { z } from 'zod';

export const politicaPrecoSchema = z.object({
  body: z.object({
    descricao: z.string({ required_error: "A descrição é obrigatória." }),
    preco_primeira_hora: z.number({ required_error: "O preço da primeira hora é obrigatório." }).positive("O valor deve ser positivo."),
    preco_horas_adicionais: z.number().positive("O valor deve ser positivo.").optional(),
    preco_diaria: z.number().positive("O valor deve ser positivo.").optional(),
  }),
});