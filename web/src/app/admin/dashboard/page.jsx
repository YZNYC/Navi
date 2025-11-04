"use client";

import React from 'react';
import Link from 'next/link';

// CORREÇÃO: Alinhando o nome do componente que foi digitado incorretamente
// De 'EstabilishManagementTable' para 'EstablishmentManagementTable' (assumindo o nome correto)
import InfoCard from '../../../components/dashboard/cards/InfoCard'; 
import { mockDashboardData, mockUsers, mockEstablishments } from '../../../data/mockData'; 
import { Users, Building, DollarSign, Calendar, FileText, Star, ParkingCircle } from 'lucide-react'; 

// Importações de Componentes
import KpiSection from '../../../components/dashboard/KpiSection';
import ChartCard from '../../../components/dashboard/cards/ChartCard';
import UserManagementTable from '../../../components/dashboard/UserManagementTable';
import EstablishmentManagementTable from '../../../components/dashboard/EstabilishManagementTable'; // Mantenho o nome atual para não quebrar outros arquivos
import MapCard from '../../../components/dashboard/cards/MapCard';
import EngagementReportCard from '../../../components/dashboard/cards/EngagementReportCard';
import CuponModal from '../../../components/dashboard/modal/cuponModal'

// Componentes de Gráfico (Recharts)
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ... (UserGrowthChart e PlatformActivityChart - Mantidos como antes) ...

const UserGrowthChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc3" />
            <XAxis dataKey="name" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="motoristas" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} name="Motoristas" />
            <Line type="monotone" dataKey="estacionamentos" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} name="Proprietários (Estab.)" />
        </LineChart>
    </ResponsiveContainer>
);

const PlatformActivityChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc3" />
            <XAxis dataKey="name" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="platform" fill="#10b981" name="Reservas" />
            <Bar dataKey="establishments" fill="#f59e0b" name="Novos Contratos" />
        </BarChart>
    </ResponsiveContainer>
);

// --- Componente Principal da Página ---

export default function DashboardPage() {
    const { charts } = mockDashboardData;
    
    // Dados de Summary
    const summaryData = {
        totalUsers: { value: mockUsers.length, change: 20.5 },
        activeEstablishments: { value: mockEstablishments.filter(e => e.status === 'verified').length, change: 15.2 },
        activeVacancies: { value: 4100, change: 5.1 }, 
        totalRevenue: { value: 23445700.00, change: 12.3 }, 
        activeReservations: { value: 1200, change: 8.9 }, 
        activeSubscribers: { value: 450, change: 10.1 }, 
        averageRating: { value: 4.8, change: 0.1 }, 
    };

    // 4 KPIs de Destaque para o Topo
    const topKpis = [
        { key: 'totalUsers', title: 'Total de Usuários', icon: Users, data: summaryData.totalUsers },
        { key: 'activeEstablishments', title: 'Estabelecimentos Ativos', icon: Building, data: summaryData.activeEstablishments },
        { key: 'activeVacancies', title: 'Vagas Ativas Hoje', icon: ParkingCircle, data: summaryData.activeVacancies },
        { key: 'totalRevenue', title: 'Receita Líquida (Mês)', icon: DollarSign, unit: 'R$', data: summaryData.totalRevenue },
    ];


    return (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Visão Geral ADM</h1>

            {/* 1. SEÇÃO KPIS: 4 Cards de Destaque no Topo */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {topKpis.map(kpi => (
                    <InfoCard
                        key={kpi.key}
                        title={kpi.title}
                        value={kpi.data.value}
                        change={kpi.data.change}
                        icon={kpi.icon}
                        unit={kpi.unit}
                    />
                ))}
            </section>

            {/* 2. SEÇÃO GRÁFICOS: Layout de 2 Colunas (Grandes) */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* GRÁFICO 1 */}
                <ChartCard 
                    title="Crescimento de Novos Usuários"
                    subtitle="Motoristas e Proprietários ao longo do tempo"
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={'monthly'} 
                >
                    <UserGrowthChart data={charts.userGrowth} />
                </ChartCard>
                
                {/* GRÁFICO 2 */}
                <ChartCard 
                    title="Atividade da Plataforma"
                    subtitle="Reservas e Novos Contratos"
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={'monthly'} 
                >
                    <PlatformActivityChart data={charts.platformRevenue} />
                </ChartCard>
            </section>
            
            {/* 3. SEÇÃO GERENCIAMENTO: 2 Tabelas Lado a Lado (Alinhamento de Conteúdo Similar) */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* TABELA DE USUÁRIOS */}
                <div className="flex flex-col">
                    <UserManagementTable users={mockUsers} />
                </div>
                
                {/* TABELA DE ESTABELECIMENTOS */}
                <div className="flex flex-col">
                    <EstablishmentManagementTable establishments={mockEstablishments} />
                </div>
            </section>

            {/* 4. SEÇÃO MAPA E RELATÓRIOS: Mapa (Bloco Maior) + Relatório e KPIs Secundários (Blocos Menores) */}
            {/* Usamos o grid 3/4 + 1/4 no desktop, ou 1/3 + 2/3, para criar a sensação de blocagem */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* COLUNA 1: Mapa (2/3 ou 1/2) */}
                {/* O Mapa precisa de espaço para ser visualmente impactante. Usaremos 2 colunas de 3. */}
                <div className="lg:col-span-1 flex flex-col">
                    <MapCard title="Estacionamentos por Região" />
                </div>
                
                {/* COLUNA 2: Engajamento e KPIs Secundários (1/3 ou 1/2) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* ENGAJAMENTO (Ficaria menor que o mapa) */}
                    <EngagementReportCard
                        topEstablishments={charts.topEstablishments.map(e => ({id: e.id, name: e.name, rating: e.rating}))}
                        topReservations={charts.topEstablishments.map(e => ({id: e.id, name: e.name, reservations: e.rentedVacancies}))}
                    />

                    {/* KPIs SECUNDÁRIOS: Alinhados horizontalmente se couberem, ou empilhados */}
                </div>
            </section>

            {/* 5. SEÇÃO GESTÃO DE CUPONS (Rodapé/Última Linha) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gestão de Cupons Globais</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Gerencie a criação, edição e desativação de cupons promocionais para toda a plataforma Navi.
                </p>
                <Link href="/admin/cupons" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                    Ir para Gestão de Cupons
                </Link>
            </div>

        </div>
    );
}