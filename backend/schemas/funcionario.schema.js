import { z } from 'zod';

const permissaoEnum = z.enum(['GESTOR', 'OPERADOR']);

export const adicionarFuncionarioSchema = z.object({
  body: z.object({
    email_funcionario: z.string({ required_error: "O email do funcionário é obrigatório." }).email("Formato de email inválido."),
    permissao: permissaoEnum,
  }),
});

export const atualizarFuncionarioSchema = z.object({
    body: z.object({
      permissao: permissaoEnum,
    }),
  });