// src/components/Dashboard/KpiSection.jsx

import React from 'react';
import InfoCard from '../dashboard/cards/InfoCard';
import { Users, Building, DollarSign, Calendar, FileText, Star, ParkingCircle } from 'lucide-react'; 
// Certifique-se de que todos os ícones necessários estão importados

export default function KpiSection({ data }) {
  const { totalUsers, activeEstablishments, activeVacancies, totalRevenue, activeReservations, activeSubscribers, averageRating } = data;

  return (
    // A classe gap-6 garante o espaçamento entre os cards
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      
      {/* Card 1: Total de Usuários */}
      <InfoCard
        title="Total de Usuários"
        value={totalUsers.value}
        change={totalUsers.change}
        icon={Users}
      />
      
      {/* Card 2: Estabelecimentos Ativos */}
      <InfoCard
        title="Estabelecimentos Ativos"
        value={activeEstablishments.value}
        change={activeEstablishments.change}
        icon={Building}
      />
      
      {/* Card 3: Vagas Ativas Hoje */}
      <InfoCard
        title="Vagas Ativas Hoje"
        value={activeVacancies.value}
        change={activeVacancies.change}
        icon={ParkingCircle}
      />
      
      {/* Card 4: Receita Líquida (Mês) */}
      <InfoCard
        title="Receita Líquida (Mês)"
        value={totalRevenue.value}
        change={totalRevenue.change}
        icon={DollarSign}
        unit="R$"
      />
      
      {/* Card 5: Reservas Ativas */}
      <InfoCard
        title="Reservas Ativas"
        value={activeReservations.value}
        change={activeReservations.change}
        icon={Calendar}
      />
      
      {/* Card 6: Mensalistas Ativos */}
      <InfoCard
        title="Mensalistas Ativos"
        value={activeSubscribers.value}
        change={activeSubscribers.change}
        icon={FileText}
      />
      
      {/* Card 7: Avaliação Média App */}
      <InfoCard
        title="Avaliação Média App"
        value={averageRating.value}
        change={averageRating.change}
        icon={Star}
      />
      {/* Se houver espaço no grid, adicione um card de placeholder */}
      <div className="hidden xl:block">
        {/* Adiciona um espaço para manter o layout de 4 colunas em telas grandes */}
      </div>

    </section>
  );
}