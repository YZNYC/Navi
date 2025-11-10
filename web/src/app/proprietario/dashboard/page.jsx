// app/gerente/dashboard/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

// Importe seus componentes e ícones aqui
import { DollarSign, ParkingCircle, Calendar, BarChart, Users } from 'lucide-react';

// --- COMPONENTES SIMPLIFICADOS PARA DEMONSTRAÇÃO ---
// No seu projeto real, estes seriam importados de seus próprios arquivos.

const InfoCard = ({ title, value, description, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
        <div className="bg-yellow-100 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
        </div>
    </div>
);

const ChartCard = ({ title, subtitle, children }) => (
     <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
        <div style={{ height: '300px' }}>
            {children}
        </div>
    </div>
);

const SimpleTable = ({ title, data, columns }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>)}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map(col => <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item[col.key]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// Mock para os gráficos, já que o backend ainda não agrega por data
const mockChartData = [
    { name: 'Set', receita: 4000 }, { name: 'Out', receita: 3000 },
    { name: 'Nov', receita: 5000 }, { name: 'Dez', receita: 4500 },
];

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---

export default function ProprietarioDashboardPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kpis, setKpis] = useState(null);
    const [recentesContratos, setRecentesContratos] = useState([]); // Dados para a tabela

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        if (!user) return; // Garante que o usuário está carregado

        try {
            // Requisições para os endpoints específicos do PROPRIETARIO
            const [kpisResponse, contratosResponse] = await Promise.all([
                api.get('/relatorios/kpis'), // Nossa rota unificada!
                api.get('/contratos')        // Rota para o usuário listar seus próprios contratos (se motorista) ou (futuramente) de seus estac.
            ]);
            
            setKpis(kpisResponse.data);
            setRecentesContratos(contratosResponse.data); // Por agora, usamos a rota geral de 'meus contratos' como exemplo

        } catch (err) {
            console.error('Erro ao carregar o Dashboard:', err);
            setError(err.response?.data?.message || 'Não foi possível carregar os dados.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return <div className="p-8">Carregando Dashboard do Proprietário...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-500">Erro: {error}</div>;
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Seu Dashboard, {user?.nome}</h1>

            {/* SEÇÃO DE KPIs (Dados Reais do Proprietário) */}
            {kpis && (
                 <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <InfoCard
                        title="Receita (Últimos 30 dias)"
                        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.receita)}
                        description="Receita líquida de reservas"
                        icon={DollarSign}
                    />
                    <InfoCard
                        title="Vagas Ocupadas Agora"
                        value={`${kpis.vagas.ocupada + kpis.vagas.reservada}`}
                        description={`De um total de ${kpis.vagas.total} vagas`}
                        icon={ParkingCircle}
                    />
                     <InfoCard
                        title="Taxa de Ocupação"
                        value={`${kpis.vagas.total > 0 ? Math.round(((kpis.vagas.ocupada + kpis.vagas.reservada) / kpis.vagas.total) * 100) : 0}%`}
                        description={`Vagas Livres: ${kpis.vagas.livre}`}
                        icon={BarChart}
                    />
                     <InfoCard
                        title="Reservas Ativas"
                        value={kpis.reservasAtivas}
                        description="Reservas de clientes avulsos"
                        icon={Calendar}
                    />
                </section>
            )}

            {/* SEÇÃO DE GRÁFICOS E TABELAS */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                 <ChartCard title="Receita Mensal (Mock)" subtitle="Acompanhe sua performance">
                    {/* Placeholder para gráfico futuro */}
                    <div>Gráfico de Receita virá aqui</div>
                </ChartCard>

                 <SimpleTable 
                    title="Últimos Contratos (Exemplo)" 
                    data={recentesContratos}
                    columns={[
                        { label: 'Cliente', key: 'id_usuario'}, // Futuramente, buscar nome do usuário
                        { label: 'Plano', key: 'id_plano' },  // Futuramente, buscar nome do plano
                        { label: 'Status', key: 'status'}
                    ]}
                 />
            </section>
        </div>
    );
}