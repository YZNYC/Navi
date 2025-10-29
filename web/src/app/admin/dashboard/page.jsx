// src/app/admin/dashboard/page.jsx

"use client";

import React from 'react';
// CORRIGIDO: Assumindo que o arquivo central de dados é o '../../../data/mockData'
import { mockDashboardData, mockUsers, mockEstablishments } from '../../../data/mockData'; 

// CORREÇÃO ESSENCIAL DOS PATHS: 
// 1. Uniformidade na nomenclatura de pastas: 'Dashboard' (PascalCase)
// 2. Uniformidade nos nomes dos componentes
import KpiSection from '../../../components/dashboard/KpiSection';
import ChartCard from '../../../components/dashboard/cards/ChartCard';
import UserManagementTable from '../../../components/dashboard/UserManagementTable';
// Ajustado o nome do componente de tabela:
import EstablishmentManagementTable from '../../../components/dashboard/EstabilishManagementTable'; 
import MapCard from '../../../components/dashboard/cards/MapCard';
import EngagementReportCard from '../../../components/dashboard/cards/EngagementReportCard';

// Componentes de Gráfico (A ser implementado usando Recharts, por exemplo)
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link'; // Certifique-se de que Link está importado, pois ele é usado no final.


// --- Funções de Gráfico (Mockup de Componentes Client-Side) ---

// Componente para o Gráfico de Crescimento (Motoristas e Proprietários)
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

// Componente para o Gráfico de Atividade (Reservas e Contratos)
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
    // Dados centrais
    const { charts } = mockDashboardData;
    
    // Simulação dos dados de Summary (agora referenciando os mocks reais)
    const summaryData = {
        totalUsers: { value: mockUsers.length, change: 20.5 },
        activeEstablishments: { value: mockEstablishments.filter(e => e.status === 'verified').length, change: 15.2 },
        activeVacancies: { value: 4100, change: 5.1 }, // Dados estáticos
        totalRevenue: { value: 23445700.00, change: 12.3 }, // Dados estáticos
        activeReservations: { value: 1200, change: 8.9 }, // Dados estáticos
        activeSubscribers: { value: 450, change: 10.1 }, // Dados estáticos
        averageRating: { value: 4.8, change: 0.1 }, // Dados estáticos
    };

    return (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Visão Geral ADM</h1>

            {/* SEÇÃO 1: KPIS - Cards "Hero" */}
            <KpiSection data={summaryData} />

            {/* SEÇÃO 2: GRÁFICOS DE TENDÊNCIA E DADOS - Layout de 2 colunas */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ChartCard 
                    title="Crescimento de Novos Usuários"
                    subtitle="Motoristas e Proprietários ao longo do tempo"
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={'monthly'} 
                >
                    <UserGrowthChart data={charts.userGrowth} />
                </ChartCard>
                
                <ChartCard 
                    title="Atividade da Plataforma"
                    subtitle="Reservas e Novos Contratos"
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={'monthly'} 
                >
                    <PlatformActivityChart data={charts.platformRevenue} />
                </ChartCard>
            </section>

            {/* SEÇÃO 3: GERENCIAMENTO E MAPA - Layout de 3 colunas (2/3 + 1/3) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Tabela de Usuários (2/3) */}
                <div className="lg:col-span-2">
                    <UserManagementTable users={mockUsers} />
                </div>
                
                {/* Mapa Geográfico (1/3) */}
                <div className="lg:col-span-1 h-[450px]">
                    <MapCard title="Estacionamentos por Região" />
                </div>
            </section>

            {/* SEÇÃO 4: GERENCIAMENTO DE ESTACIONAMENTOS E ENGAJAMENTO - Layout de 2 colunas */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* Tabela de Estacionamentos (1/2) */}
                <div>
                    <EstablishmentManagementTable establishments={mockEstablishments} />
                </div>

                {/* Relatório de Engajamento (1/2) */}
                <div className="h-[450px]">
                    <EngagementReportCard
                        topEstablishments={charts.topEstablishments.map(e => ({id: e.id, name: e.name, rating: e.rating}))}
                        topReservations={charts.topEstablishments.map(e => ({id: e.id, name: e.name, reservations: e.rentedVacancies}))}
                    />
                </div>
            </section>
            
            {/* SEÇÃO 5: GESTÃO DE CUPONS (Aqui ficaria o link/card para o CRUD de Cupons) */}
            <div className=" mt-25 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gestão de Cupons Globais</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Gerencie a criação, edição e desativação de cupons promocionais para toda a plataforma Navi.
                </p>
                <Link href="/admin/cupons" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Ir para Gestão de Cupons
                </Link>
            </div>

        </div>
    );
}