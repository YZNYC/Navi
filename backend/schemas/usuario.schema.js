import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string({ required_error: "O nome é obrigatório." }).min(3, "O nome precisa de no mínimo 3 caracteres."),
    email: z.string({ required_error: "O email é obrigatório." }).email("Formato de email inválido."),
    senha: z.string({ required_error: "A senha é obrigatória." }).min(3, "A senha precisa de no mínimo 8 caracteres."),
    papel: z.enum(['ADMINISTRADOR', 'PROPRIETARIO', 'MOTORISTA']).optional(),
    telefone: z.string().optional(),
  }),
});

export const atualizarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(3, "O nome precisa de no mínimo 3 caracteres.").optional(),
    email: z.string().email("Formato de email inválido.").optional(),
    telefone: z.string().optional(),
    url_foto_perfil: z.string().url("URL da foto de perfil inválida.").optional(),
  }),
});