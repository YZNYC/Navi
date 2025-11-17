// src/controllers/EstabelecimentoKpiController.js

import { getVagaKpis, getMediaAvaliacaoPlataforma } from "../models/EstabelecimentoKpiModel.js";
import { listarEstacionamentos } from "../models/Estacionamento.js"; // Para a contagem total
// Importar logicamente o Model de Pagamentos para a Receita

/**
 * Retorna todas as métricas agregadas necessárias para a página de Gestão de Estabelecimentos.
 */
export const getEstablishmentSummaryKpis = async (req, res) => {
    try {
        const [vagasKpis, mediaAvaliacao, todosEstacionamentos] = await Promise.all([
            getVagaKpis(),
            getMediaAvaliacaoPlataforma(),
            listarEstacionamentos(),
        ]);

        // 1. CÁLCULO DE VAGAS
        const totalVagas = vagasKpis.total;
        const ocupadas = vagasKpis.status.find(s => s.status === 'OCUPADA')?.count || 0;
        const reservadas = vagasKpis.status.find(s => s.status === 'RESERVADA')?.count || 0;
        const totalOcupado = ocupadas + reservadas;
        const ocupacaoMedia = totalVagas > 0 ? parseFloat(((totalOcupado / totalVagas) * 100).toFixed(1)) : 0.0;

        // 2. CÁLCULO DE ESTACIONAMENTOS
        const totalEstabs = todosEstacionamentos.length;
        const activeEstabs = todosEstacionamentos.filter(e => e.ativo).length;
        
        // 3. CÁLCULO DE RECEITA/AVALIAÇÃO
        // ⚠️ Placeholder: Este cálculo deve ser feito no Model real contra a tabela Pagamento
        const receitaMediaPorVaga = 155.50; // Placeholder
        const receitaMediaChange = 10.1; // Placeholder

        res.status(200).json({
            // Métricas de Vagas
            vagas: {
                total: totalVagas,
                ocupacaoMedia: ocupacaoMedia,
                ocupadas: ocupadas,
                reservadas: reservadas,
            },
            // Métricas de Estabelecimentos
            estabelecimentos: {
                total: totalEstabs,
                ativos: activeEstabs,
            },
            // Métricas de Desempenho
            desempenho: {
                receitaMediaPorVaga: { value: receitaMediaPorVaga, change: receitaMediaChange, unit: 'R$' },
                mediaAvaliacaoPlataforma: { value: mediaAvaliacao.media, change: 0.0, unit: '★' },
            }
        });

    } catch (error) {
        console.error("Erro ao buscar KPIs de Estabelecimento:", error);
        res.status(500).json({ message: "Erro interno ao calcular KPIs de estacionamento." });
    }
};