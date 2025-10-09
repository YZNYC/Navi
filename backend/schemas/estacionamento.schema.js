
import { z } from 'zod';

export const criarEstacionamentoSchema = z.object({
  body: z.object({
    nome: z.string({ required_error: "O nome do estacionamento é obrigatório." }),
    cnpj: z.string({ required_error: "O CNPJ é obrigatório." }),
    endereco_completo: z.string({ required_error: "O endereço é obrigatório." }),
    latitude: z.number({ required_error: "A latitude é obrigatória." }),
    longitude: z.number({ required_error: "A longitude é obrigatória." }),
    horario_abertura: z.string().optional(),
    horario_fechamento: z.string().optional(),
    dias_funcionamento: z.string().optional(),
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