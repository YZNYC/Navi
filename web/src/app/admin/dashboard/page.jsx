"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Componentes da UI (assumimos que existem e funcionam)
import InfoCard from '../../../components/dashboard/cards/InfoCard';
import ChartCard from '../../../components/dashboard/cards/ChartCard';
import UserManagementTable from '../../../components/dashboard/UserManagementTable';
import EstablishmentManagementTable from '../../../components/dashboard/EstabilishManagementTable';
import MapCard from '../../../components/dashboard/cards/MapCard';
import EngagementReportCard from '../../../components/dashboard/cards/EngagementReportCard';
import CupomButton from '../../../components/dashboard/buttons/cupomButton';

// Ícones
import { Users, Building, DollarSign, ParkingCircle, Calendar, FileText, Star } from 'lucide-react';

// Gráficos (Recharts)
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// AXIOS e Utilitários
import api from '../../../lib/api'; 
import { mockDashboardData, mockUsers, mockEstablishments } from '../../../data/mockData'; // Mocks mantidos apenas para os dados de gráfico não implementados no Backend.

// --- Componentes de Gráfico (Mantidos como estavam) ---

const UserGrowthChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc3" />
            <XAxis dataKey="name" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="motoristas" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} name="Motoristas" />
            <Line type="monotone" dataKey="proprietarios" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} name="Proprietários (Estab.)" />
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
            <Bar dataKey="reservas" fill="#10b981" name="Reservas" />
            <Bar dataKey="contratos" fill="#f59e0b" name="Novos Contratos" />
        </BarChart>
    </ResponsiveContainer>
);

// --- Componente Principal da Página ---

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        users: [],
        establishments: [],
        kpis: {
            totalUsers: 0,
            totalEstablishments: 0,
            totalVacancies: 0,
            totalRevenue: 0,
            activeReservations: 0,
        },
        charts: mockDashboardData.charts, // Mantido mockado até implementar a lógica de agregação por data no Backend
    });

    // Função de Fetching Otimizada
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Dispara todas as requisições em paralelo com Promise.all
            const [
                usersResponse,
                establishmentsResponse,
                kpisResponse,
            ] = await Promise.all([
                // Rota Existente: Listar Usuários (Requer Admin)
                api.get('/usuarios'), 
                // Rota Existente: Listar Estacionamentos (Pública, mas esta é a rota ADM)
                api.get('/estacionamentos'), 
                // Nova Rota: Obter KPIs (Requer Admin)
                api.get('/relatorios/kpis'), 
            ]);

            setDashboardData(prev => ({
                ...prev,
                users: usersResponse.data,
                establishments: establishmentsResponse.data,
                kpis: kpisResponse.data,
            }));

        } catch (err) {
            console.error('Erro ao carregar o Dashboard:', err);
            // Verifica se o erro é 403 (Proibido) ou 401 (Não Autorizado)
            const status = err.response?.status;
            if (status === 403 || status === 401) {
                setError('Acesso Proibido. Você não tem permissão de Administrador.');
            } else {
                setError('Não foi possível carregar todos os dados. Verifique a API.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Lógica para mapear o objeto KPI para o array que o componente InfoCard espera
    const topKpis = [
        { key: 'totalUsers', title: 'Total de Usuários', icon: Users, unit: '', data: { value: dashboardData.kpis.totalUsers, change: 20.5 } },
        { key: 'activeEstablishments', title: 'Estabelecimentos Ativos', icon: Building, unit: '', data: { value: dashboardData.kpis.totalEstablishments, change: 15.2 } },
        { key: 'totalVacancies', title: 'Total de Vagas', icon: ParkingCircle, unit: '', data: { value: dashboardData.kpis.totalVacancies, change: 5.1 } },
        { key: 'totalRevenue', title: 'Receita Líquida (30 Dias)', icon: DollarSign, unit: 'R$', data: { value: dashboardData.kpis.totalRevenue, change: 12.3 } },
    ];
    
    // Tratamento de Estados
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen dark:text-white">
                <p>Carregando dados do dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen p-8 text-center text-red-500">
                <p>Erro: {error}</p>
            </div>
        );
    }
    
    // Extração dos dados
    const { users, establishments, charts } = dashboardData;

    return (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Visão Geral ADM</h1>

            {/* 1. SEÇÃO KPIS: 4 Cards de Destaque no Topo (DADOS REAIS AGORA) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {topKpis.map(kpi => (
                    <InfoCard
                        key={kpi.key}
                        title={kpi.title}
                        // Formatando a moeda se for Receita
                        value={kpi.key === 'totalRevenue' ? parseFloat(kpi.data.value).toFixed(2) : kpi.data.value} 
                        change={kpi.data.change} // 'change' ainda é mockado
                        icon={kpi.icon}
                        unit={kpi.unit}
                    />
                ))}
            </section>

            {/* 2. SEÇÃO GRÁFICOS: Layout de 2 Colunas (DADOS MOCKADOS TEMPORARIAMENTE) */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ChartCard
                    title="Crescimento de Novos Usuários"
                    subtitle="Motoristas e Proprietários ao longo do tempo"
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={'monthly'}
                >
                    {/* USANDO O MOCK ATÉ IMPLEMENTAR A FUNÇÃO DE AGRUPAMENTO POR DATA NO BACKEND */}
                    <UserGrowthChart data={charts.userGrowth} />
                </ChartCard>

                <ChartCard
                    title="Atividade da Plataforma"
                    subtitle="Reservas e Novos Contratos"
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={'monthly'}
                >
                    {/* USANDO O MOCK ATÉ IMPLEMENTAR A FUNÇÃO DE AGRUPAMENTO POR DATA NO BACKEND */}
                    <PlatformActivityChart data={charts.platformRevenue} />
                </ChartCard>
            </section>

            {/* 3. SEÇÃO GERENCIAMENTO: 2 Tabelas Lado a Lado (DADOS REAIS AGORA) */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col">
                    {/* Passando os dados reais de usuários */}
                    <UserManagementTable users={users} />
                </div>

                <div className="flex flex-col">
                    {/* Passando os dados reais de estabelecimentos */}
                    <EstablishmentManagementTable establishments={establishments} />
                </div>
            </section>

            {/* 4. SEÇÃO MAPA E RELATÓRIOS (USANDO MOCK PARA RELATÓRIOS DETALHADOS) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 flex flex-col">
                    <MapCard title="Estacionamentos por Região" />
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <EngagementReportCard
                        topEstablishments={charts.topEstablishments.map(e => ({ id: e.id, name: e.name, rating: e.rating }))}
                        topReservations={charts.topEstablishments.map(e => ({ id: e.id, name: e.name, reservations: e.rentedVacancies }))}
                    />
                </div>
            </section>

            {/* 5. SEÇÃO GESTÃO DE CUPONS (Rodapé/Última Linha) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gestão de Cupons Globais</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Gerencie a criação, edição e desativação de cupons promocionais para toda a plataforma Navi.
                </p>
                <div>
                    {/* Este botão levaria para a rota de criação de cupons, que usa os controllers de cupom existentes. */}
                    <CupomButton />
                </div>
            </div>
        </div>
    );
}