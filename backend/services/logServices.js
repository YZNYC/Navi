// src/services/logService.js
import prisma from '../config/prisma.js';

// Função central para registrar logs. Ela é assíncrona, mas não a esperamos (roda em "fire-and-forget").
export const registrarLog = async ({ id_usuario_acao, id_estacionamento, acao, detalhes }) => {
    try {
        await prisma.log.create({
            data: {
                id_usuario_acao: id_usuario_acao ? parseInt(id_usuario_acao) : undefined,
                id_estacionamento: id_estacionamento ? parseInt(id_estacionamento) : undefined,
                acao,
                detalhes: detalhes || {}, // Garante que seja um objeto JSON válido
            },
        });
    } catch (error) {
        console.error("ERRO CRÍTICO AO REGISTRAR LOG:", error);
    }
};