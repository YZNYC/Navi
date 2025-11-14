import prisma from '../config/prisma.js'; // Ajuste o caminho para o seu ficheiro prisma singleton, se necessário
import { z } from 'zod';

// Schema para validar IDs
const paramsIdSchema = z.string().regex(/^\d+$/, "O ID deve ser um número.");

// === 1. LISTAR CONVERSAS ===
// Busca todas as conversas de IA para o utilizador logado
export const listarConversas = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const conversas = await prisma.conversa_navi.findMany({
            where: { id_usuario: usuarioLogadoId },
            orderBy: { data_atualizacao: 'desc' },
            select: {
                id_conversa: true,
                titulo: true,
                data_atualizacao: true
            }
        });
        res.status(200).json(conversas);
    } catch (error) {
        console.error("Erro ao listar conversas:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// === 2. OBTER HISTÓRICO DE UMA CONVERSA ===
// Busca todas as mensagens de uma conversa específica
export const obterHistorico = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const conversaId = parseInt(paramsIdSchema.parse(req.params.id));

        const conversa = await prisma.conversa_navi.findFirst({
            where: { id_conversa: conversaId, id_usuario: usuarioLogadoId },
            include: {
                mensagens: {
                    orderBy: { data_criacao: 'asc' }
                }
            }
        });

        if (!conversa) {
            return res.status(404).json({ message: "Conversa não encontrada." });
        }

        // Converte o 'content' (que é JSON) de volta para o formato que o frontend espera
        const historico = conversa.mensagens.map(msg => {
            const contentJson = msg.content; // O 'content' da DB é um objeto JSON

            if (msg.role === 'user') {
                // Para o utilizador, o 'content' é apenas a string da pergunta
                return { role: 'user', parts: [{ text: contentJson }] };
            } else {
                // Para o modelo, o 'content' é o JSON { type, content, chartData }
                return {
                    role: 'model',
                    parts: [{ text: contentJson.type === 'chart' ? contentJson.insightText : contentJson.content }],
                    chartData: contentJson.type === 'chart' ? contentJson.chartData : null
                };
            }
        });

        res.status(200).json(historico);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "ID de conversa inválido." });
        }
        console.error("Erro ao obter histórico:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// === 3. SALVAR CONVERSA (COM TÍTULO AUTOMÁTICO) ===
// Salva a pergunta do utilizador e a resposta da IA
export const salvarConversa = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        // O frontend envia o ID da conversa (ou null se for nova) e o histórico completo
        const { conversaId, historico, id_estacionamento } = req.body;

        // O 'historico' vem do frontend, que já inclui a pergunta e a resposta
        const ultimaMensagem = historico[historico.length - 1]; // Resposta da IA
        const penultimaMensagem = historico[historico.length - 2]; // Pergunta do Utilizador

        if (!ultimaMensagem || !penultimaMensagem) {
            return res.status(400).json({ message: "Histórico de conversa inválido." });
        }

        // O 'content' que guardamos no DB:
        // Para o utilizador: a string da pergunta
        // Para o modelo: o objeto JSON completo da resposta da IA
        const userContent = penultimaMensagem.parts[0].text;
        const modelContent = ultimaMensagem.content; // O frontend guarda o JSON completo aqui

        if (conversaId) {
            // --- ATUALIZA CONVERSA EXISTENTE ---
            const conversaIdNum = parseInt(conversaId);

            // 1. Verifica se a conversa pertence ao utilizador (segurança)
            const conversa = await prisma.conversa_navi.findFirst({
                where: { id_conversa: conversaIdNum, id_usuario: usuarioLogadoId }
            });
            if (!conversa) {
                return res.status(403).json({ message: "Não autorizado." });
            }

            // 2. Salva as duas novas mensagens
            await prisma.mensagem_navi.createMany({
                data: [
                    { id_conversa: conversaIdNum, role: 'user', content: userContent },
                    { id_conversa: conversaIdNum, role: 'model', content: modelContent }
                ]
            });
            
            // 3. Atualiza a data da conversa
            await prisma.conversa_navi.update({
                where: { id_conversa: conversaIdNum },
                data: { data_atualizacao: new Date() }
            });

            res.status(200).json({ id_conversa: conversaIdNum, titulo: conversa.titulo });

        } else {
            // --- CRIA NOVA CONVERSA (COM TÍTULO AUTOMÁTICO) ---
            
            // 1. Pega a primeira pergunta do utilizador para gerar o título
            const primeiraPergunta = penultimaMensagem.parts[0].text;
            const titulo = primeiraPergunta.substring(0, 60); // Título automático
            
            // 2. Cria a conversa e as mensagens numa transação
            const novaConversa = await prisma.conversa_navi.create({
                data: {
                    id_usuario: usuarioLogadoId,
                    id_estacionamento: id_estacionamento,
                    titulo: titulo,
                    mensagens: {
                        createMany: {
                            data: [
                                { role: 'user', content: userContent },
                                { role: 'model', content: modelContent }
                            ]
                        }
                    }
                },
                select: { id_conversa: true, titulo: true, data_atualizacao: true } // Retorna os dados para o frontend
            });

            res.status(201).json(novaConversa);
        }

    } catch (error) {
        console.error("Erro ao salvar conversa:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

// === 4. ATUALIZAR TÍTULO DA CONVERSA ===
// A função que estava em falta e a causar o erro
export const atualizarTituloConversa = async (req, res) => {
    try {
        const usuarioLogadoId = req.usuario.id_usuario;
        const conversaId = parseInt(paramsIdSchema.parse(req.params.id));
        const { titulo } = req.body;

        if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
            return res.status(400).json({ message: "Título inválido." });
        }

        // O 'updateMany' é seguro pois verifica o ID da conversa E o ID do utilizador
        const updateResult = await prisma.conversa_navi.updateMany({
            where: {
                id_conversa: conversaId,
                id_usuario: usuarioLogadoId // Garante que o utilizador só edita as suas próprias conversas
            },
            data: {
                titulo: titulo.trim().substring(0, 255) // Limita ao tamanho do DB
            }
        });

        if (updateResult.count === 0) {
            return res.status(404).json({ message: "Conversa não encontrada." });
        }

        res.status(200).json({ message: "Título atualizado com sucesso." });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "ID de conversa inválido." });
        }
        console.error("Erro ao atualizar título:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};

