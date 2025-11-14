// src/app/admin/users/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Users, Truck, Percent, TrendingUp, TrendingDown, Layers } from 'lucide-react'; // Adicionado Layers
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Para o Gráfico de Distribuição

// Importa a instância do Axios (backend)
import api from '../../../lib/api'; 

// Componentes Reutilizados
import InfoCard from '../../../components/dashboard/cards/InfoCard'; 
import UserManagementTable from '../../../components/dashboard/UserManagementTable'; 
import ChartCard from '../../../components/dashboard/cards/ChartCard';

// --- CONSTANTES ---
const PIE_CHART_COLORS = ['#FFD600', '#3b82f6', '#10b981', '#ef4444', '#f59e0b']; // Cores para o gráfico de Pizza

// --- FUNÇÃO FETCH HELPER LOCAL --- (Para consistência)
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

// --- COMPONENTE DE GRÁFICO DE DISTRIBUIÇÃO (FINALIZADO) ---
const RoleDistributionChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">Nenhum dado de distribuição de papéis.</div>;
    }
    
    // Garante que o total é 0 se o array for vazio
    const total = data.reduce((sum, entry) => sum + entry.count, 0);

    const chartData = data.map((entry, index) => ({
        // Nome: 'ADMINISTRADOR (3.4%)'
        name: `${entry.role} (${((entry.count / total) * 100).toFixed(1)}%)`,
        value: entry.count,
        color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '8px' }} 
                    formatter={(value, name) => [value, name.split('(')[0].trim()]} // Formata o tooltip (valor e nome sem %)
                />
                <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '10px' }}
                />
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%" // Ajustado para dar espaço à legenda
                    outerRadius={100}
                    fill="#8884d8"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};


export default function UserManagementPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [userKpis, setUserKpis] = useState({
        ativos: 0,
        inativos: 0,
        totalVeiculos: 0,
        variacaoVeiculos: 0,
        distribuicaoPapeis: [],
    });
    const router = useRouter();
    
    
    // Função unificada de Fetch
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. BUSCA DADOS DA TABELA DE USUÁRIOS (TODOS)
            const fetchedUsers = await axiosFetcher('/usuarios');
            
            // 2. BUSCA TODOS OS KPIS AGREGADOS DE USUÁRIO
            const fetchedKpis = await axiosFetcher('/usuarios/kpis/summary');
            
            // Mapeamento e set de Usuários (Inalterado)
            const mappedUsers = Array.isArray(fetchedUsers) 
                ? fetchedUsers.map(user => ({
                    id: user.id_usuario,
                    name: user.nome,
                    email: user.email,
                    role: user.papel.toLowerCase(), 
                    isActive: user.ativo,
                })) 
                : []; 
            setUsers(mappedUsers);

            // 3. SET DOS KPIS DE USUÁRIOS
            setUserKpis({
                ativos: fetchedKpis.usuarios.ativos,
                inativos: fetchedKpis.usuarios.inativos,
                totalVeiculos: fetchedKpis.veiculos.totalAtivos,
                variacaoVeiculos: fetchedKpis.veiculos.variacao,
                distribuicaoPapeis: fetchedKpis.distribuicaoPapeis.map(p => ({ role: p.papel, count: p.count })),
            });


        } catch (err) {
            if (err.message && err.message.includes('401')) {
                toast.error("Sessão expirada. Faça login novamente.");
                router.push('/login/administrador'); 
            } else {
                toast.error(err.message || 'Falha ao carregar a lista de usuários.');
                setError(err.message || 'Falha na conexão.');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    // 🚨 FUNÇÃO DE CALLBACK PARA ATUALIZAÇÃO LOCAL DE USUÁRIO (IDÊNTICA À DA DASHBOARD)
    const handleLocalUserUpdate = useCallback((updatedData) => {
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === updatedData.id 
                    ? { ...user, ...updatedData } 
                    : user
            )
        );
        // Não chama fetchData() imediatamente.
        // O re-fetch total será feito via onUpdate() para atualizar os KPIs e sincronizar o BD.
    }, []);


    // FUNÇÃO DE RE-RENDER CENTRALIZADA: Chamada pelos filhos após uma ação de PUT/PATCH
    const handleUpdateAndRefresh = useCallback(() => {
        fetchData(); 
    }, [fetchData]);


    useEffect(() => {
        const tokenExists = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (tokenExists) {
            fetchData();
        } else {
            router.push('/login/administrador'); 
        }
    }, [fetchData, router]);


    if (loading) {
        return <div className="flex justify-center items-center min-h-screen dark:text-white"><p>Carregando dados dos Usuários...</p></div>;
    }
    
    if (error) {
        return (
            <div className="p-6 md:p-8 dark:text-red-400">
                <h1 className="text-3xl font-bold mb-6">Erro na Conexão</h1>
                <p>Não foi possível carregar a página. Detalhes: {error}</p>
                <button onClick={handleUpdateAndRefresh} className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md">Tentar Novamente</button>
            </div>
        );
    }

    // --- KPIS DA PÁGINA (REAL-TIME CALC.) ---
    const totalUsers = userKpis.ativos + userKpis.inativos;
    const topKpis = [
        { title: 'Usuários Ativos', icon: Users, data: { value: userKpis.ativos, change: 0 } },
        { title: 'Usuários Inativos', icon: Users, data: { value: userKpis.inativos, change: 0 } },
        { title: 'Total de Veículos Ativos', icon: Truck, data: { value: userKpis.totalVeiculos, change: userKpis.variacaoVeiculos } },
        { title: 'Taxa de Proprietários/Motoristas', icon: Percent, data: { value: totalUsers > 0 ? parseFloat((userKpis.distribuicaoPapeis.find(p => p.role === 'proprietario')?.count / totalUsers * 100).toFixed(1)) : 0, change: 0, unit: '%' } },
    ];


    return (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Gestão de Usuários da Plataforma</h1>

            {/* 1. SEÇÃO KPIS DE GESTÃO */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {topKpis.map(kpi => (
                    <InfoCard
                        key={kpi.title}
                        title={kpi.title}
                        value={kpi.data.value}
                        change={kpi.data.change}
                        icon={kpi.icon}
                        unit={kpi.unit}
                    />
                ))}
            </section>
            
            {/* 2. GRÁFICOS DE DISTRIBUIÇÃO */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ChartCard 
                    title="Distribuição de Papéis"
                    subtitle={`Total de Usuários Ativos: ${userKpis.ativos}`}
                >
                    <RoleDistributionChart data={userKpis.distribuicaoPapeis} />
                </ChartCard>
                
                <ChartCard 
                    title="Engajamento de Veículos"
                    subtitle="Percentual de Motoristas com veículos cadastrados"
                >
                    <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
                        *Dados de Engajamento por Motorista seriam colocados aqui.*
                    </div>
                </ChartCard>
            </section>

            {/* 3. TABELA PRINCIPAL DE GERENCIAMENTO (Reutilizada da Visão Geral) */}
            <section className="mb-8">
                <UserManagementTable 
                    users={users} 
                    onUpdate={handleUpdateAndRefresh} 
                    onLocalStatusChange={handleLocalUserUpdate} 
                    axiosFetcher={axiosFetcher} 
                />
            </section>
        </div>
    );
}