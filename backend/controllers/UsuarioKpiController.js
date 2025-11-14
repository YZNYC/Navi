// src/controllers/UsuarioKpiController.js

import { getDistribuicaoPapeis, getTotalVeiculos } from "../models/UsuarioKpiModel.js";

/**
 * Retorna todas as métricas agregadas necessárias para a página de Gestão de Usuários.
 */
export const getUserSummaryKpis = async (req, res) => {
    try {
        const [distribuicaoPapeis, totalVeiculos] = await Promise.all([
            getDistribuicaoPapeis(),
            getTotalVeiculos(),
        ]);

        // 1. Total de Usuários Ativos
        const totalUsuariosAtivos = distribuicaoPapeis.reduce((sum, item) => sum + item._count.papel, 0);

        // 2. Mapeamento da Distribuição
        const distribuicaoFormatada = distribuicaoPapeis.map(item => ({
            role: item.papel,
            count: item._count.papel,
        }));
        
        // 3. Placeholder para variação (sem dados históricos)
        const veiculosBase = 50; 
        const totalVeiculosChange = totalVeiculos > 0 ? parseFloat((((totalVeiculos - veiculosBase) / veiculosBase) * 100).toFixed(1)) : 0;
        
        res.status(200).json({
            // Métricas Totais
            usuarios: {
                ativos: totalUsuariosAtivos,
                inativos: (await prisma.usuario.count()) - totalUsuariosAtivos, // Contagem total - ativos
            },
            // Métricas de Veículos
            veiculos: {
                totalAtivos: totalVeiculos,
                variacao: totalVeiculosChange,
            },
            // Métricas de Distribuição (para gráficos)
            distribuicaoPapeis: distribuicaoFormatada,
        });

    } catch (error) {
        console.error("Erro ao buscar KPIs de Usuário:", error);
        res.status(500).json({ message: "Erro interno ao calcular KPIs de usuário." });
    }
};