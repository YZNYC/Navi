// src/components/Dashboard/EngagementReportCard.jsx
import React from 'react';
import Link from 'next/link'; // Adicionado
import { ChevronRight, Star, Bookmark } from 'lucide-react';

// REMOVIDA: A definição dos mocks internos (mockTopEst, mockTopRes)

export default function EngagementReportCard({ topEstablishments = [], topReservations = [] }) {
  // Funções para formatar avaliação e reservas (simples para o mockup)
  const formatRating = (rating) => `${rating.toFixed(1)}`;
  const formatCount = (count) => count.toLocaleString('pt-BR');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Relatório de Engajamento</h3>
      
      <div className="space-y-6 flex-1">
        {/* Mais Bem Avaliados */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" /> Top Avaliações
          </h4>
          <ul className="divide-y divide-gray-200 dark:divide-slate-700">
            {topEstablishments.length === 0 ? (
                <li className="py-2 text-sm text-gray-500 dark:text-gray-400">Nenhum dado de avaliação disponível.</li>
            ) : (
                topEstablishments.map((est) => (
                    <li key={est.id} className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md px-1 cursor-pointer">
                        <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-indigo-500" /> {est.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatRating(est.rating)} <span className="text-yellow-500">★</span>
                        </span>
                    </li>
                ))
            )}
          </ul>
        </div>

        {/* Mais Reservados */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-pink-500" /> Top Reservas
          </h4>
          <ul className="divide-y divide-gray-200 dark:divide-slate-700">
            {topReservations.length === 0 ? (
                 <li className="py-2 text-sm text-gray-500 dark:text-gray-400">Nenhum dado de reserva disponível.</li>
            ) : (
                topReservations.map((est) => (
                    <li key={est.id} className="flex justify-between items-center py-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md px-1 cursor-pointer">
                        <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 text-indigo-500" /> {est.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCount(est.reservations)} reservas
                        </span>
                    </li>
                ))
            )}
          </ul>
        </div>
      </div>
      
      {/* Opção para ver relatório completo */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <Link href="/admin/relatorios" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center">
              Ver Relatório Completo <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
      </div>
    </div>
  );
}