// src/lib/schemas/navi.schema.js

import { z } from 'zod';

// Esquema para a IA Global do ADMIN (não requer id_estacionamento)
export const askNaviAdminSchema = z.object({
  user_question: z.string().min(1, 'A pergunta do utilizador é obrigatória.'),
  history: z.array(z.object({
    role: z.string().min(1),
    parts: z.array(z.object({
      text: z.string().min(1),
    })),
  })).optional(),
});

// Esquema para a IA do PROPRIETÁRIO (requer id_estacionamento para segurança)
export const askNaviProprietarioSchema = askNaviAdminSchema.extend({
  id_estacionamento: z.union([z.string().cuid(), z.number().int()], {
      invalid_type_error: 'O ID do estacionamento deve ser um número ou CUID válido.',
    }).transform(val => parseInt(val, 10)), // Garante que o ID é tratado como INT no controller
});