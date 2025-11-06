// src/controllers/RelatorioController.js
import * as RelatorioModel from '../models/Relatorio.js';

export const obterKpisController = async (req, res) => {
    try {
        // Dispara todas as consultas de KPIs em paralelo (MUITO mais rápido)
        const [
            totalUsers,
            totalEstablishments,
            totalVacancies,
            totalRevenue,
            activeReservations,
        ] = await Promise.all([
            RelatorioModel.contarTotalDeUsuarios(),
            RelatorioModel.contarEstacionamentosAtivos(),
            RelatorioModel.contarVagasAtivas(),
            RelatorioModel.calcularReceitaMensal(),
            RelatorioModel.contarReservasAtivas(),
        ]);

        // Retorna todos os dados de uma vez
        res.status(200).json({
            totalUsers,
            totalEstablishments,
            totalVacancies,
            totalRevenue,
            activeReservations,
        });

    } catch (error) {
        console.error("Erro ao obter KPIs para o Dashboard:", error);
        res.status(500).json({ message: "Erro interno ao gerar relatórios do dashboard." });
    }
};

// Outros controladores de gráfico viriam aqui (obterCrescimentoController, etc.)