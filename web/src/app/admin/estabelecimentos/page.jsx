// src/app/admin/establishments/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Building, ParkingCircle, DollarSign, Percent, Star } from 'lucide-react'; 

// Importa a instância do Axios (backend)
import api from '../../../lib/api'; 

// Componentes Reutilizados
import InfoCard from '../../../components/dashboard/cards/InfoCard'; 
import EstablishmentManagementTable from '../../../components/dashboard/EstablishmentManagementTable'; 
import ChartCard from '../../../components/dashboard/cards/ChartCard';


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


export default function EstablishmentManagementPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [establishments, setEstablishments] = useState([]);
    const [vacancyKpis, setVacancyKpis] = useState({ totalVagas: 0, ocupacaoMedia: 0, ocupadas: 0, reservadas: 0 });
    const [platformKpis, setPlatformKpis] = useState({
        totalEstabs: 0,
        activeEstabs: 0,
        receitaMedia: { value: 0.00, change: 0.0, unit: 'R$' }, 
        mediaAvaliacao: { value: 0.0, change: 0.0, unit: '★' },
    });
    const router = useRouter();
    
    
    // Função unificada de Fetch
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 🚨 1. BUSCA DADOS DA TABELA DE ESTACIONAMENTOS
            const fetchedEstablishments = await axiosFetcher('/estacionamentos');
            
            // 🚨 2. BUSCA TODOS OS KPIS AGREGADOS EM UMA ÚNICA CHAMADA
            const fetchedKpis = await axiosFetcher('/estabelecimentos/kpis/summary');
            
            // Mapeamento e set de Estabelecimentos (Inalterado)
            const mappedEstablishments = Array.isArray(fetchedEstablishments) 
                ? fetchedEstablishments.map(est => ({
                    id: est.id_estacionamento,
                    name: est.nome,
                    cnpj: est.cnpj,
                    address: est.endereco_completo,
                    status: est.ativo ? 'verified' : 'deactivated', 
                    rating: fetchedKpis.desempenho.mediaAvaliacaoPlataforma.value, // Usar média real como mock para a tabela
                })) 
                : []; 
            setEstablishments(mappedEstablishments);

            // 3. SET DOS KPIS DE VAGAS E PLATAFORMA
            setVacancyKpis({
                totalVagas: fetchedKpis.vagas.total,
                ocupacaoMedia: fetchedKpis.vagas.ocupacaoMedia,
                ocupadas: fetchedKpis.vagas.ocupadas,
                reservadas: fetchedKpis.vagas.reservadas,
            });

            setPlatformKpis({
                totalEstabs: fetchedKpis.estabelecimentos.total,
                activeEstabs: fetchedKpis.estabelecimentos.ativos,
                receitaMedia: fetchedKpis.desempenho.receitaMediaPorVaga,
                mediaAvaliacao: fetchedKpis.desempenho.mediaAvaliacaoPlataforma,
            });


        } catch (err) {
            if (err.message && err.message.includes('401')) {
                toast.error("Sessão expirada. Faça login novamente.");
                router.push('/login/administrador'); 
            } else {
                toast.error(err.message || 'Falha ao carregar a lista de estabelecimentos.');
                setError(err.message || 'Falha na conexão.');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    // 🚨 FUNÇÃO DE CALLBACK PARA ATUALIZAÇÃO LOCAL DE ESTACIONAMENTO (Para a tabela)
    const handleLocalEstablishmentUpdate = useCallback((updatedData) => {
        setEstablishments(prevEstabs => 
            prevEstabs.map(estab => 
                estab.id === updatedData.id 
                    ? { ...estab, ...updatedData } 
                    : estab
            )
        );
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
        return <div className="flex justify-center items-center min-h-screen dark:text-white"><p>Carregando dados dos Estabelecimentos...</p></div>;
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
    const topKpis = [
        { title: 'Vagas Totais', icon: ParkingCircle, data: { value: vacancyKpis.totalVagas, change: 0 } },
        { title: 'Ocupação Média (%)', icon: Percent, data: { value: vacancyKpis.ocupacaoMedia, change: 0, unit: '%' } },
        { title: 'Receita Média / Vaga', icon: DollarSign, data: platformKpis.receitaMedia, unit: 'R$' },
        { title: 'Avaliação Média Plataforma', icon: Star, data: platformKpis.mediaAvaliacao, unit: '★' },
    ];


    return (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Gestão de Estabelecimentos</h1>

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
            
            {/* 2. TABELA PRINCIPAL DE GERENCIAMENTO */}
            <section className="mb-8">
                <EstablishmentManagementTable 
                    establishments={establishments} 
                    onUpdate={handleUpdateAndRefresh} 
                    onLocalStatusChange={handleLocalEstablishmentUpdate} 
                    axiosFetcher={axiosFetcher} 
                />
            </section>

            {/* 3. RELATÓRIOS/GRÁFICOS ESPECÍFICOS */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ChartCard 
                    title="Vagas Ocupadas vs. Reservadas"
                    subtitle="Visão instantânea do uso da plataforma"
                >
                    <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
                        <p className="text-lg">
                            Total de Vagas: **{vacancyKpis.totalVagas}** 
                            <br/>
                            Ocupadas: **{vacancyKpis.ocupadas}** | Reservadas: **{vacancyKpis.reservadas}**
                        </p>
                    </div>
                </ChartCard>
                
                <ChartCard 
                    title="Avaliação Média por Estacionamento"
                    subtitle="Top 5 e Piores 5 avaliações"
                >
                    <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
                        *Este gráfico exigiria um endpoint específico para ranking.
                    </div>
                </ChartCard>
            </section>
        </div>
    );
}