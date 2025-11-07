// src/controllers/RelatorioController.js
import * as RelatorioModel from '../models/Relatorio.js';
import prisma from '../config/prisma.js';

export const obterKpisDashboardController = async (req, res) => {
    try {
        const requisitante = req.usuario;
        let idsDeEstacionamentoParaConsulta; // undefined por padrão

        // ---- LÓGICA DE DECISÃO BASEADA NO PAPEL ----
        if (requisitante.papel === 'PROPRIETARIO') {
            const estacionamentos = await prisma.estacionamento.findMany({
                where: { id_proprietario: requisitante.id_usuario },
                select: { id_estacionamento: true }
            });
            idsDeEstacionamentoParaConsulta = estacionamentos.map(e => e.id_estacionamento);
        }
        else if (requisitante.papel === 'GESTOR' || requisitante.papel === 'OPERADOR') {
            const vinculo = await prisma.estacionamento_funcionario.findFirst({
                where: { id_usuario: requisitante.id_usuario },
                select: { id_estacionamento: true }
            });

            if (!vinculo) {
                return res.status(403).json({ message: "Você não está vinculado a nenhum estacionamento." });
            }
            idsDeEstacionamentoParaConsulta = [vinculo.id_estacionamento];
        }
        // Se for ADMINISTRADOR, 'idsDeEstacionamentoParaConsulta' permanece 'undefined', 
        // o que fará com que o Model calcule os totais para o sistema inteiro.
        
        // Dispara todas as consultas em paralelo
        const [vagas, receita, reservasAtivas] = await Promise.all([
            RelatorioModel.contarVagasNosEstacionamentos(idsDeEstacionamentoParaConsulta),
            RelatorioModel.calcularReceitaNosEstacionamentos(idsDeEstacionamentoParaConsulta),
            RelatorioModel.contarReservasAtivasNosEstacionamentos(idsDeEstacionamentoParaConsulta),
        ]);
        
        // Se a consulta foi para um array vazio (proprietário sem estacionamentos), os KPIs virão zerados.
        if (idsDeEstacionamentoParaConsulta && idsDeEstacionamentoParaConsulta.length === 0) {
            return res.status(200).json({
                vagas: { total: 0, livre: 0, ocupada: 0, reservada: 0 },
                receita: 0,
                reservasAtivas: 0,
                escopo: 'Nenhum estacionamento encontrado.'
            });
        }
        
        res.status(200).json({ vagas, receita, reservasAtivas });

    } catch (error) {
        console.error("Erro ao obter KPIs do dashboard:", error);
        res.status(500).json({ message: "Erro interno ao gerar relatórios." });
    }
};