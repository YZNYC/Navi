"use client";

import React, { useState } from 'react'; 
import Link from 'next/link';

import InfoCard from '../../../components/dashboard/cards/InfoCard'; 

import { DollarSign, Calendar, ParkingCircle, Car, Scan, CheckSquare, Lock, Unlock } from 'lucide-react'; 

import ChartCard from '../../../components/dashboard/cards/ChartCard';
import MapCard from '../../../components/dashboard/cards/MapCard';
import EngagementReportCard from '../../../components/dashboard/cards/EngagementReportCard';
import Sidebar from '@/components/layout/sidebar/Sidebar';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailyOccupancyChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc3" />
            <XAxis dataKey="time" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} name="Carros Estacionados" />
        </LineChart>
    </ResponsiveContainer>
);

const MovementActivityChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc3" />
            <XAxis dataKey="day" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(30, 41, 59)', border: 'none', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="entries" fill="#10b981" name="Entradas" />
            <Bar dataKey="exits" fill="#ef4444" name="Saídas" />
        </BarChart>
    </ResponsiveContainer>
);

export default function OperadorDashboardPage() {
    // 👈 NOVO ESTADO PARA GERENCIAR O CAIXA
    const [isCashRegisterOpen, setIsCashRegisterOpen] = useState(false);
    
    // 👈 NOVA FUNÇÃO PARA ABRIR/FECHAR CAIXA
    const handleToggleCashRegister = () => {
        if (isCashRegisterOpen) {
            // Lógica simples para Fechar
            if (window.confirm("Deseja realmente fechar o caixa e finalizar o turno?")) {
                setIsCashRegisterOpen(false);
                alert("Caixa fechado. O turno foi finalizado.");
            }
        } else {
            // Lógica simples para Abrir
            const initialValue = prompt("Informe o valor inicial (troco) para abrir o caixa:");
            if (initialValue && !isNaN(parseFloat(initialValue))) {
                setIsCashRegisterOpen(true);
                alert(`Caixa aberto com R$ ${parseFloat(initialValue).toFixed(2)}.`);
            } else if (initialValue !== null) {
                alert("Valor inválido ou operação cancelada. O caixa não foi aberto.");
            }
        }
    };
    
    // Variáveis para o botão
    const ButtonIcon = isCashRegisterOpen ? Lock : Unlock;
    const buttonText = isCashRegisterOpen ? 'Fechar Caixa' : 'Abrir Caixa';
    const buttonClass = isCashRegisterOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';


    const operationalData = {
        currentOccupancy: { value: 65, change: 3.5, total: 100 },
        pendingReservations: { value: 12, change: -2, trend: 'down' },
        dailyMovement: { value: 150, change: 15.2, trend: 'up' },
        revenueToday: { value: 1850.50, change: 10.1, trend: 'up' },
        
        occupancyByHour: [
            { time: '8h', occupancy: 30 }, { time: '10h', occupancy: 55 }, 
            { time: '12h', occupancy: 80 }, { time: '14h', occupancy: 70 }, 
            { time: '16h', occupancy: 95 }, { time: '18h', occupancy: 75 },
        ],
        dailyMovementChart: [
            { day: 'Seg', entries: 50, exits: 45 }, { day: 'Ter', entries: 60, exits: 58 }, 
            { day: 'Qua', entries: 75, exits: 70 }, { day: 'Hoje', entries: 80, exits: 70 },
        ]
    };

    const topKpis = [
        { 
            key: 'currentOccupancy', 
            title: 'Ocupação Atual', 
            icon: ParkingCircle, 
            data: { value: `${operationalData.currentOccupancy.value}%`, change: operationalData.currentOccupancy.change, unit: ` / ${operationalData.currentOccupancy.total} Vagas` } 
        },
        { 
            key: 'pendingReservations', 
            title: 'Reservas Pendentes', 
            icon: Calendar, 
            data: { value: operationalData.pendingReservations.value, change: operationalData.pendingReservations.change } 
        },
        { 
            key: 'dailyMovement', 
            title: 'Movimentação Diária', 
            icon: Car, 
            data: { value: operationalData.dailyMovement.value, change: operationalData.dailyMovement.change } 
        },
        { 
            key: 'revenueToday', 
            title: 'Receita Líquida (Hoje)', 
            icon: DollarSign, 
            unit: 'R$', 
            data: { value: operationalData.revenueToday.value, change: operationalData.revenueToday.change } 
        },
    ];


    return (
        <>
        <div className="flex-1 p-6 md:p-8 dark:bg-slate-900 min-h-screen">
            
            {/* NOVO: Título e Botão de Ação do Caixa Alinhados */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel de Operações</h1>
                
                {/* O PRÓPRIO BOTÃO DE CAIXA */}
                <button
                    onClick={handleToggleCashRegister}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white cursor-pointer ${buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
                >
                    <ButtonIcon className="w-5 h-5" />
                    {buttonText}
                </button>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {topKpis.map(kpi => (
                    <InfoCard
                        key={kpi.key}
                        title={kpi.title}
                        value={kpi.data.value}
                        change={kpi.data.change}
                        icon={kpi.icon}
                        unit={kpi.data.unit}
                    />
                ))}
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ChartCard 
                    title="Ocupação do Estacionamento (Hoje)"
                    subtitle="Veículos estacionados a cada hora"
                    dropdownOptions={[{ value: 'daily', label: 'Hoje' }, { value: 'yesterday', label: 'Ontem' }]}
                    selectedDropdown={'daily'} 
                >
                    <DailyOccupancyChart data={operationalData.occupancyByHour} />
                </ChartCard>
                
                <ChartCard 
                    title="Entradas e Saídas (Últimos 4 Dias)"
                    subtitle="Movimentação de veículos no seu pátio"
                    dropdownOptions={[{ value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensal' }]}
                    selectedDropdown={'weekly'} 
                >
                    <MovementActivityChart data={operationalData.dailyMovementChart} />
                </ChartCard>
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                <div className="lg:col-span-1 flex flex-col">
                    <MapCard title="Localização do Estacionamento" />
                </div>
                
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas de Operação</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <Link href="/operador/entrada" className="text-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-yellow-500 hover:text-white transition">
                                <Scan className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Registrar Entrada</span>
                            </Link>
                            <Link href="/operador/reservas" className="text-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-yellow-500 hover:text-white transition">
                                <CheckSquare className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Ver Reservas</span>
                            </Link>
                            <Link href="/operador/movimentacao" className="text-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-yellow-500 hover:text-white transition">
                                <Car className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Painel de Pátio</span>
                            </Link>
                             <button
                                onClick={handleToggleCashRegister}
                                className={`flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium transition cursor-pointer ${isCashRegisterOpen ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'}`}
                            >
                                <ButtonIcon className="w-6 h-6 mx-auto mb-2" />
                                <span>{buttonText}</span>
                            </button>
                        </div>
                    </div>

                    <EngagementReportCard
                        title="Performance do Estacionamento"
                        topEstablishments={[]}
                        topReservations={[]}
                    />
                </div>
            </section>

        </div>
        </>
    );
}