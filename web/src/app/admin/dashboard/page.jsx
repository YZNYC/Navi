// src/app/admin/dashboard/page.jsx

"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { toast } from 'sonner'; 

// Importa a instância do Axios configurada
import api from '../../../lib/api'; 

import InfoCard from '../../../components/dashboard/cards/InfoCard'; 
import { mockDashboardData, mockUsers, mockEstablishments } from '../../../data/mockData';
import { Users, Building, DollarSign, Calendar, FileText, Star, ParkingCircle } from 'lucide-react'; 

// Importações de Componentes
import ChartCard from '../../../components/dashboard/cards/ChartCard';
import UserManagementTable from '../../../components/dashboard/UserManagementTable';
import EstablishmentManagementTable from '../../../components/dashboard/EstablishmentManagementTable'; 
import MapCard from '../../../components/dashboard/cards/MapCard';
import EngagementReportCard from '../../../components/dashboard/cards/EngagementReportCard';

// Componentes de Gráfico (Recharts)
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- FUNÇÃO FETCH HELPER LOCAL ---
const axiosFetcher = async (endpoint, options = {}) => {
    try {
        const response = await api.request({
            url: endpoint,
            method: options.method || 'GET',
            data: options.data,
            params: options.params,
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || `Requisição falhou: ${error.message}`;
        throw new Error(message);
    }
};

// --- DADOS DE KPI SIMULADOS (BASE HISTÓRICA) ---
const mockKpiSummary = {
    // Valores de BASE (Mês Passado) para cálculo de variação
    totalUsers: { base: 5 }, // 5 usuários no mês passado (totalUsers é o valor atual)
    activeEstablishments: { base: 4 }, // 4 estabelecimentos ativos no mês passado (5 ativos no BD)
    // Para Receita:
    totalRevenue: { value: 23445700.00, base: 20000000.00, change: 17.22 }, 
};


// Componentes de Gráfico (Recharts) e Dados Mock (inalterados)
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

const mockCharts = {
    userGrowthMonthly: [
        { name: 'Jan', motoristas: 400, proprietarios: 240 },
        { name: 'Fev', motoristas: 300, proprietarios: 139 },
        { name: 'Mar', motoristas: 200, proprietarios: 980 },
        { name: 'Abr', motoristas: 278, proprietarios: 390 },
        { name: 'Mai', motoristas: 189, proprietarios: 480 },
        { name: 'Jun', motoristas: 239, proprietarios: 380 },
    ],
    userGrowthWeekly: [
        { name: 'S1', motoristas: 100, proprietarios: 60 },
        { name: 'S2', motoristas: 80, proprietarios: 40 },
        { name: 'S3', motoristas: 50, proprietarios: 20 },
        { name: 'S4', motoristas: 70, proprietarios: 50 },
    ],
    platformActivityMonthly: [
        { name: 'Jan', reservas: 12000, contratos: 800 },
        { name: 'Fev', reservas: 10000, contratos: 700 },
        { name: 'Mar', reservas: 15000, contratos: 1000 },
        { name: 'Abr', reservas: 11000, contratos: 600 },
        { name: 'Mai', reservas: 9000, contratos: 500 },
        { name: 'Jun', reservas: 13000, contratos: 900 },
    ],
    platformActivityWeekly: [
        { name: 'S1', reservas: 3000, contratos: 200 },
        { name: 'S2', reservas: 2500, contratos: 180 },
        { name: 'S3', reservas: 4000, contratos: 250 },
        { name: 'S4', reservas: 3500, contratos: 170 },
    ],
    topEstablishments: [
        { id: 1, name: "Parking Central", rating: 4.9, rentedVacancies: 120 },
        { id: 2, name: "Aeroporto P.1", rating: 4.8, rentedVacancies: 110 },
        { id: 3, name: "Shopping Leste", rating: 4.7, rentedVacancies: 95 },
    ]
};

// --- Componente Principal da Página ---

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const router = useRouter(); 
    
    // ESTADOS INDIVIDUAIS PARA O FILTRO DE CADA GRÁFICO
    const [userGrowthTimeframe, setUserGrowthTimeframe] = useState('monthly');
    const [platformActivityTimeframe, setPlatformActivityTimeframe] = useState('monthly');
    
    // STATE KEY CHANGER: Chave que força a re-renderização
    const [renderKey, setRenderKey] = useState(0); 

    // Estado para KPIs
    const initialKpiState = { value: 0, change: 0 };
    const [summaryData, setSummaryData] = useState({
        totalUsers: initialKpiState,
        activeEstablishments: initialKpiState,
        activeVacancies: { value: 4100, change: 5.1 }, 
        totalRevenue: { value: 23445700.00, change: 12.3 }, 
        activeReservations: { value: 1200, change: 8.9 }, 
        activeSubscribers: { value: 450, change: 10.1 }, 
        averageRating: { value: 4.8, change: 0.1 }, 
    });


    // USEMEMO 1: Lógica de Filtragem para o Gráfico de Crescimento
    const userGrowthData = useMemo(() => {
        if (userGrowthTimeframe === 'weekly') {
            return mockCharts.userGrowthWeekly;
        }
        return mockCharts.userGrowthMonthly;
    }, [userGrowthTimeframe]);

    // USEMEMO 2: Lógica de Filtragem para o Gráfico de Atividade
    const platformActivityData = useMemo(() => {
        if (platformActivityTimeframe === 'weekly') {
            return mockCharts.platformActivityWeekly;
        }
        return mockCharts.platformActivityMonthly;
    }, [platformActivityTimeframe]);


    // Função unificada de Fetch para Usuários e Estacionamentos
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [fetchedUsers, fetchedEstablishments] = await Promise.all([
                axiosFetcher('/usuarios'), 
                axiosFetcher('/estacionamentos'),
            ]);

            // Mapeamento dos usuários
            const mappedUsers = Array.isArray(fetchedUsers) ? fetchedUsers.map(user => ({
                id: user.id_usuario,
                name: user.nome,
                email: user.email,
                role: user.papel.toLowerCase(), 
                isActive: user.ativo,
            })) : [];
            setUsers(mappedUsers);

            // VERIFICAÇÃO E MAPEAMENTO DOS ESTACIONAMENTOS
            const mappedEstablishments = Array.isArray(fetchedEstablishments) 
                ? fetchedEstablishments.map(est => ({
                    id: est.id_estacionamento,
                    name: est.nome,
                    cnpj: est.cnpj,
                    address: est.endereco_completo,
                    status: est.ativo ? 'verified' : 'deactivated', 
                    rating: 4.5, 
                })) 
                : []; 
            setEstablishments(mappedEstablishments);

            // Cálculo de KPIs
            
            // 🚨 CORREÇÃO: Conta APENAS usuários ATIVOS (isActive: true)
            const totalUsersCount = mappedUsers.filter(user => user.isActive).length;
            
            // 🚨 CORREÇÃO: Conta APENAS estabelecimentos ATIVOS (status: 'verified')
            const activeEstablishmentsCount = mappedEstablishments.filter(e => e.status === 'verified').length; 
            
            // 🚨 LÓGICA DE CÁLCULO DA VARIAÇÃO PERCENTUAL
            const usersBase = mockKpiSummary.totalUsers.base;
            const totalUsersChange = usersBase > 0 
                ? ((totalUsersCount - usersBase) / usersBase) * 100
                : 0; 

            const estabsBase = mockKpiSummary.activeEstablishments.base;
            const activeEstabsChange = estabsBase > 0 
                ? ((activeEstablishmentsCount - estabsBase) / estabsBase) * 100
                : 0;
            
            const totalRevenueValue = mockKpiSummary.totalRevenue.value;
            const totalRevenueBase = mockKpiSummary.totalRevenue.base;
            const totalRevenueChange = totalRevenueBase > 0
                ? ((totalRevenueValue - totalRevenueBase) / totalRevenueBase) * 100
                : 0;

            setSummaryData(prev => ({
                ...prev,
                // Usuários Totais (Aplicando valor atual e variação)
                totalUsers: { 
                    value: totalUsersCount, 
                    change: parseFloat(totalUsersChange.toFixed(1)) 
                },
                // Estabelecimentos Ativos (Aplicando valor atual e variação)
                activeEstablishments: { 
                    value: activeEstablishmentsCount, 
                    change: parseFloat(activeEstabsChange.toFixed(1)) 
                },
                // Receita (Aplicando valor simulado e variação)
                totalRevenue: { 
                    value: totalRevenueValue, 
                    change: parseFloat(totalRevenueChange.toFixed(1)) 
                },
            }));

        } catch (err) {
            if (err.message && err.message.includes('401')) {
                localStorage.removeItem('authToken'); 
                sessionStorage.removeItem('authToken');
                toast.error("Sessão expirada. Faça login novamente.");
                setError("Sessão expirada ou acesso negado.");
            } else {
                toast.error(err.message || 'Falha ao carregar o Dashboard.');
                setError(err.message || 'Falha ao carregar o Dashboard.');
            }
        } finally {
            setLoading(false);
        }
    }, []);


    // FUNÇÃO DE RE-RENDER CENTRALIZADA: Chamada pelos filhos após um PUT/PATCH
    const handleUpdateAndRefresh = useCallback(() => {
        setRenderKey(prevKey => prevKey + 1); // 🚨 FORÇA RE-RENDER
        fetchData(); 
    }, [fetchData]);
    
    // MANIPULADOR DE MUDANÇA DO FILTRO - INDIVIDUAL PARA CRESCIMENTO
    const handleUserGrowthTimeframeChange = (newTimeframe) => {
        setUserGrowthTimeframe(newTimeframe);
    };

    // MANIPULADOR DE MUDANÇA DO FILTRO - INDIVIDUAL PARA ATIVIDADE
    const handlePlatformActivityTimeframeChange = (newTimeframe) => {
        setPlatformActivityTimeframe(newTimeframe);
    };

    useEffect(() => {
        const tokenExists = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (tokenExists) {
            fetchData();
        } else {
            setError("Token de acesso não encontrado. Faça login para acessar o painel.");
            setLoading(false);
        }
    }, [fetchData]);


    // 4 KPIs de Destaque para o Topo
    const topKpis = [
        { key: 'totalUsers', title: 'Total de Usuários', icon: Users, data: summaryData.totalUsers },
        { key: 'activeEstablishments', title: 'Estabelecimentos Ativos', icon: Building, data: summaryData.activeEstablishments },
        { key: 'activeVacancies', title: 'Vagas Ativas Hoje', icon: ParkingCircle, data: summaryData.activeVacancies },
        { key: 'totalRevenue', title: 'Receita Líquida (Mês)', icon: DollarSign, unit: 'R$', data: summaryData.totalRevenue },
    ];


    // Se estiver carregando
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen dark:text-white">
                <p>Carregando dados do Dashboard...</p>
            </div>
        );
    }
    
    // Se houver erro
    if (error) {
        return (
            <div className="p-6 md:p-8 dark:text-red-400">
                <h1 className="text-3xl font-bold mb-6">Erro na Conexão</h1>
                <p>Não foi possível carregar os dados. Detalhes: {error}</p>
                <button onClick={fetchData} className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md">Tentar Novamente</button>
            </div>
        );
    }


    return (
        // APLICANDO A CHAVE para forçar a re-renderização completa!
        <div 
            className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen" 
            key={renderKey}
        >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Visão Geral ADM</h1>

            {/* 1. SEÇÃO KPIS */}
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
                {/* GRÁFICO 1: Crescimento de Usuários */}
                <ChartCard 
                    title="Crescimento de Novos Usuários"
                    subtitle={`Dados ${userGrowthTimeframe === 'monthly' ? 'Mensais' : 'Semanais'}`}
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={userGrowthTimeframe} 
                    onDropdownChange={handleUserGrowthTimeframeChange} // MANIPULADOR INDIVIDUAL
                >
                    <UserGrowthChart data={userGrowthData} /> {/* DADOS INDIVIDUAIS */}
                </ChartCard>
                
                {/* GRÁFICO 2: Atividade da Plataforma */}
                <ChartCard 
                    title="Atividade da Plataforma"
                    subtitle={`Dados ${platformActivityTimeframe === 'monthly' ? 'Mensais' : 'Semanais'}`}
                    dropdownOptions={[{ value: 'monthly', label: 'Mensal' }, { value: 'weekly', label: 'Semanal' }]}
                    selectedDropdown={platformActivityTimeframe} 
                    onDropdownChange={handlePlatformActivityTimeframeChange} // MANIPULADOR INDIVIDUAL
                >
                    <PlatformActivityChart data={platformActivityData} /> {/* DADOS INDIVIDUAIS */}
                </ChartCard>
            </section>
            
            {/* 3. SEÇÃO GERENCIAMENTO: TABELAS COM DADOS REAIS */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* TABELA DE USUÁRIOS */}
                <div className="flex flex-col">
                    <UserManagementTable 
                        users={users} 
                        onUpdate={handleUpdateAndRefresh} 
                        axiosFetcher={axiosFetcher} 
                    />
                </div>
                
                {/* TABELA DE ESTABELECIMENTOS */}
                <div className="flex flex-col">
                    <EstablishmentManagementTable 
                        establishments={establishments} 
                        onUpdate={handleUpdateAndRefresh} 
                        axiosFetcher={axiosFetcher} 
                    />
                </div>
            </section>

            {/* 4. SEÇÃO MAPA E RELATÓRIOS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                <div className="lg:col-span-1 flex flex-col">
                    <MapCard title="Estacionamentos por Região" />
                </div>
                
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <EngagementReportCard
                        topEstablishments={mockCharts.topEstablishments.map(e => ({id: e.id, name: e.name, rating: e.rating}))}
                        topReservations={mockCharts.topEstablishments.map(e => ({id: e.id, name: e.name, reservations: e.rentedVacancies}))}
                    />
                </div>
            </section>

            {/* 5. SEÇÃO GESTÃO DE CUPONS */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gestão de Cupons Globais</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Gerencie a criação, edição e desativação de cupons promocionais para toda a plataforma Navi.
                </p>
                <Link href="/admin/cupons" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                    Ir para Gestão de Cupons
                </Link>
            </div>

        </div>
    );
}