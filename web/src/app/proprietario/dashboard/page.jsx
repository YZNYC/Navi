'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// --- CORREÇÃO DO CONFLITO DE NOMES ---
// Importa o ícone 'BarChart' da lucide, mas o renomeia para 'BarChartIcon'
import { 
    DollarSign, 
    ParkingCircle, 
    Calendar, 
    Users, 
    Building, 
    FileText, 
    Star, 
    Loader2, 
    TrendingUp, 
    BarChart as BarChartIcon, // <-- RENOMEADO AQUI
    BrainCircuit, 
    Notebook 
} from 'lucide-react';

// A importação do 'recharts' agora pode usar o nome 'BarChart' sem conflito
import { 
    BarChart, 
    Bar, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

// -----------------------------------------------------------------------------
// COMPONENTES DE UI REFINADOS
// -----------------------------------------------------------------------------

const KpiCard = ({ title, value, icon: Icon, unit = '' }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border dark:border-slate-700 flex items-center gap-6 transition-transform hover:-translate-y-1 border-l-4 border-amber-500">
        <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-lg">
            <Icon className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
            <p className="text-md font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{unit}{value}</p>
        </div>
    </div>
);

const ChartCard = ({ title, subtitle, children }) => (
     <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700 h-full border-b-4 border-amber-500">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>
        <div className="h-80 mt-4">{children}</div>
    </div>
);

const QuickActionButton = ({ href, icon: Icon, title, subtitle }) => (
    <Link href={href} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors shadow-sm hover:shadow-md border-b-4 border-transparent hover:border-amber-500">
        <Icon className="w-10 h-10 text-amber-500 flex-shrink-0"/>
        <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
    </Link>
);

const ReviewCard = ({ avaliacao }) => (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border dark:border-slate-700 h-full">
        <div className="flex justify-between items-center">
            <p className="font-semibold text-sm dark:text-white">{avaliacao.usuario.nome}</p>
            <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor"/>
                <span className="font-bold">{parseFloat(avaliacao.nota).toFixed(1)}</span>
            </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{avaliacao.comentario || 'Sem comentário.'}"</p>
    </div>
);

const Pagination = ({ totalItens, itensPorPagina, paginaAtual, onPageChange }) => {
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    if (totalPaginas <= 1) return null;
    const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            {paginas.map(page => (
                <button key={page} onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${paginaAtual === page ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'}`}>
                    {page}
                </button>
            ))}
        </div>
    );
};

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA PÁGINA
// -----------------------------------------------------------------------------
export default function ProprietarioDashboardPage() {
    const { user } = useAuth();
    const [meusEstacionamentos, setMeusEstacionamentos] = useState([]);
    const [selectedEstacionamento, setSelectedEstacionamento] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [paginaContratos, setPaginaContratos] = useState(1);
    const CONTRATOS_POR_PAGINA = 4;
    
    const mockGraphData = {
        dailyRevenue: [
            { dia: 'Seg', valor: 150 }, { dia: 'Ter', valor: 220 }, { dia: 'Qua', valor: 190 },
            { dia: 'Qui', valor: 300 }, { dia: 'Sex', valor: 450 }, { dia: 'Sab', valor: 600 }, { dia: 'Dom', valor: 550 },
        ],
        monthlySubscribers: [
            { mes: 'Jul', novos: 3 }, { mes: 'Ago', novos: 5 }, { mes: 'Set', novos: 4 },
            { mes: 'Out', novos: 8 }, { mes: 'Nov', novos: 7 },
        ]
    };

    useEffect(() => {
        const fetchEstacionamentos = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/estacionamentos/meus');
                setMeusEstacionamentos(response.data);
                if (response.data.length > 0) {
                    setSelectedEstacionamento(response.data[0]);
                } else {
                    setIsLoading(false);
                }
            } catch {
                setError('Não foi possível carregar seus estacionamentos.');
                setIsLoading(false);
            }
        };
        fetchEstacionamentos();
    }, []);

    useEffect(() => {
        if (!selectedEstacionamento) return;
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/estacionamentos/${selectedEstacionamento.id_estacionamento}/dashboard`);
                setDashboardData(response.data);
            } catch {
                toast.error('Erro ao carregar dados do dashboard.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [selectedEstacionamento]);

    const contratosPaginados = useMemo(() => {
        if (!dashboardData?.ultimosContratos) return [];
        const inicio = (paginaContratos - 1) * CONTRATOS_POR_PAGINA;
        return dashboardData.ultimosContratos.slice(inicio, inicio + CONTRATOS_POR_PAGINA);
    }, [dashboardData?.ultimosContratos, paginaContratos]);

    const ocupacao = useMemo(() => {
        const vagas = dashboardData?.kpis?.vagas;
        if (!vagas || vagas.total === 0) return 0;
        return Math.round(((vagas.ocupada + vagas.reservada) / vagas.total) * 100);
    }, [dashboardData?.kpis?.vagas]);

    if (!user || (isLoading && !dashboardData && !error)) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;
    }
    if (error) { return <div className="p-8 text-center text-red-500">{error}</div>; }

    if (meusEstacionamentos.length === 0) {
        return (
            <div className="flex-1 p-8 text-center">
                <h2 className="text-2xl font-bold dark:text-white">Bem-vindo, {user.nome}!</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Você ainda não possui estacionamentos cadastrados.</p>
            </div>
        );
    }
    
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8 font-sans">
            <div className="w-full mx-auto space-y-10 px-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                     {meusEstacionamentos.length > 1 && (
                         <div className="w-full sm:w-auto sm:max-w-xs">
                             <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Visualizando Estacionamento</label>
                             <select onChange={(e) => setSelectedEstacionamento(meusEstacionamentos.find(est => est.id_estacionamento == e.target.value))} value={selectedEstacionamento?.id_estacionamento || ''} className="w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500">
                                {meusEstacionamentos.map(e => <option key={e.id_estacionamento} value={e.id_estacionamento}>{e.nome}</option>)}
                            </select>
                        </div>
                     )}
                </div>
                
                {dashboardData && selectedEstacionamento && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedEstacionamento.id_estacionamento}>
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                       <KpiCard title="Receita (Mês)" value={(dashboardData.kpis.receitaMes || 0).toFixed(2)} icon={DollarSign} unit="R$ "/>
                       <KpiCard title="Reservas Ativas" value={dashboardData.kpis.reservasAtivas || 0} icon={Calendar}/>
                       <KpiCard title="Total de Vagas" value={dashboardData.kpis.vagas?.total || 0} icon={ParkingCircle}/>
                       <KpiCard title="Ocupação Atual" value={`${ocupacao}%`} icon={TrendingUp}/>
                    </section>
                    
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        <ChartCard title="Receita Diária (Mock)" subtitle="Performance na última semana">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockGraphData.dailyRevenue} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false}/>
                                    <XAxis dataKey="dia" fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af"/>
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af" tickFormatter={(value) => `R$${value}`}/>
                                    <Tooltip cursor={{fill: 'rgba(245, 158, 11, 0.1)'}} wrapperClassName="!bg-white/80 dark:!bg-slate-700/80 !border-slate-300 dark:!border-slate-600 rounded-lg shadow-lg backdrop-blur-sm" />
                                    <Bar dataKey="valor" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Receita"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                        <ChartCard title="Novos Mensalistas (Mock)" subtitle="Aquisição nos últimos meses">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockGraphData.monthlySubscribers} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false}/>
                                    <XAxis dataKey="mes" fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af" />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#9ca3af" />
                                    <Tooltip wrapperClassName="!bg-white/80 dark:!bg-slate-700/80 !border-slate-300 dark:!border-slate-600 rounded-lg shadow-lg backdrop-blur-sm" />
                                    <Line type="monotone" dataKey="novos" name="Novos Assinantes" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        <div className="h-[600px] bg-white dark:bg-slate-800 rounded-xl shadow-md border dark:border-slate-700 overflow-hidden border-b-4 border-amber-500">
                             <iframe src={`https://maps.google.com/maps?q=${selectedEstacionamento.latitude},${selectedEstacionamento.longitude}&z=16&output=embed`} className="w-full h-full border-0"></iframe>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700 border-b-4 border-amber-500 flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-xl font-semibold dark:text-white">Reputação do Estacionamento</h3>
                                 <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-full">
                                    <Star size={16}/>
                                    <span>{parseFloat(dashboardData.avaliacaoMedia || 0).toFixed(1)}</span>
                                </div>
                            </div>
                             {dashboardData.ultimasAvaliacoes.length > 0 ? (
                                <div className="space-y-4 flex-grow">
                                    {dashboardData.ultimasAvaliacoes.map(a => <ReviewCard key={a.id_avaliacao} avaliacao={a} />)}
                                </div>
                            ) : (<p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8 flex-grow flex items-center justify-center">Ainda não há avaliações para este estacionamento.</p>)}
                        </div>
                    </section>
                    
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700 border-b-4 border-amber-500">
                            <h3 className="text-xl font-semibold dark:text-white mb-4">Ações Rápidas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <QuickActionButton href="/proprietario/estabelecimento/vagas" icon={Building} title="Gerenciar Vagas" subtitle="Adicionar, editar e visualizar"/>
                                <QuickActionButton href="/proprietario/financeiro/politicas" icon={DollarSign} title="Políticas de Preço" subtitle="Definir tarifas e promoções"/>
                                <QuickActionButton href="/proprietario/estabelecimento/funcionarios" icon={Users} title="Gerenciar Equipe" subtitle="Adicionar e remover funcionários"/>
                                <QuickActionButton href="/proprietario/financeiro/planos" icon={FileText} title="Planos Mensais" subtitle="Configurar planos para mensalistas"/>
                                <QuickActionButton href="/proprietario/ia/nav-ia" icon={BrainCircuit} title="Navi IA" subtitle="Obter insights e previsões"/>
                                <QuickActionButton href="/proprietario/logs" icon={Notebook} title="Logs" subtitle="Verificar registros de atividade"/>
                            </div>
                        </div>
                         <div className="flex flex-col bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700 border-b-4 border-amber-500">
                           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Últimos Contratos de Mensalistas</h3>
                            <div className="flex-grow space-y-3">
                               {contratosPaginados.length > 0 ? contratosPaginados.map(c => (
                                    <div key={c.id_contrato} className="text-sm p-3 rounded-md bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center">
                                       <div>
                                           <p className="font-medium dark:text-gray-200">{c.usuario.nome}</p>
                                           <p className="text-xs text-gray-500 dark:text-gray-400">{c.plano_mensal.nome_plano}</p>
                                       </div>
                                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.status === 'ATIVO' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{c.status}</span>
                                   </div>
                               )) : ( <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8">Nenhum contrato recente.</p> )}
                            </div>
                            <Pagination totalItens={dashboardData.ultimosContratos.length} itensPorPagina={CONTRATOS_POR_PAGINA} paginaAtual={paginaContratos} onPageChange={setPaginaContratos}/>
                        </div>
                    </section>
                </motion.div>
                )}
            </div>
        </main>
    );
}