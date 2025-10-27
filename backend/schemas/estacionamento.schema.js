
import { z } from 'zod';

// src/schemas/estacionamento.schema.js
export const criarEstacionamentoSchema = z.object({
  body: z.object({
    nome: z.string({ required_error: "O nome é obrigatório." }),
    cnpj: z.string({ required_error: "O CNPJ é obrigatório." }),
    cep: z.string({ required_error: "O CEP é obrigatório." }).length(9, "O CEP deve ter 9 caracteres (XXXXX-XXX)."),
    numero: z.string({ required_error: "O número do endereço é obrigatório." }),
    latitude: z.number({ required_error: "A latitude é obrigatória." }),
    longitude: z.number({ required_error: "A longitude é obrigatória." }),
  }),
});

export const atualizarEstacionamentoSchema = z.object({
  body: z.object({
    nome: z.string().optional(),
    cnpj: z.string().optional(),
    endereco_completo: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    horario_abertura: z.string().optional(),
    horario_fechamento: z.string().optional(),
    dias_funcionamento: z.string().optional(),
  }),
});