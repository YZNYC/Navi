'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, PlusCircle, Loader2, X, Edit, Trash2, History, ArchiveRestore, Tags, Archive } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// -----------------------------------------------------------------------------
// SCHEMAS E COMPONENTES
// -----------------------------------------------------------------------------
const politicaSchema = z.object({
    descricao: z.string({ required_error: "A descrição é obrigatória." }).min(3, "Mínimo de 3 caracteres."),
    preco_primeira_hora: z.coerce.number({ invalid_type_error: "Valor inválido" }).min(0, "O preço não pode ser negativo."),
    preco_horas_adicionais: z.coerce.number().min(0).optional().nullable(),
    preco_diaria: z.coerce.number().min(0).optional().nullable(),
});

const POLITICAS_ATIVAS_POR_PAGINA = 4;
const POLITICAS_HISTORICO_POR_PAGINA = 3;

// --- COMPONENTES DE UI ---

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} transition={{ type: "spring", stiffness: 400, damping: 40 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 pt-12 relative border-t-4 border-amber-500" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:rotate-90"><X size={28} /></button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{title}</h2>
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const PoliticaCard = ({ politica, onEdit, onDeactivate }) => (
    <div className="bg-gray-50 dark:bg-slate-700/70 p-6 rounded-xl border  space-y-4 shadow-sm hover:shadow-md  transition-shadow duration-300 border-l-4 border-l-amber-500">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{politica.descricao}</h3>
            <div className="flex gap-2">
                <button onClick={onEdit} className="  text-gray-400 hover:text-amber-500 transition-colors" title="Editar"><Edit size={18} /></button>
                <button onClick={onDeactivate} className="text-gray-400 hover:text-red-500 transition-colors" title="Desativar"><Trash2 size={18} /></button>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-amber-500/30 dark:divide-amber-500/30">
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">1ª Hora</p>
                <p className="font-semibold text-gray-900 dark:text-white">R$ {parseFloat(politica.preco_primeira_hora).toFixed(2)}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hora Adic.</p>
                <p className="font-semibold text-gray-900 dark:text-white">R$ {parseFloat(politica.preco_horas_adicionais || 0).toFixed(2)}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Diária</p>
                <p className="font-semibold text-gray-900 dark:text-white">R$ {parseFloat(politica.preco_diaria || 0).toFixed(2)}</p>
            </div>
        </div>
    </div>
);

const PoliticaForm = ({ onSubmit, defaultValues = {}, isSubmitting, title = "Salvar Política" }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(politicaSchema),
        defaultValues,
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição da Política</label>
                <input {...register('descricao')} id="descricao" placeholder="Ex: Tarifa Padrão Fim de Semana" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="preco_primeira_hora" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">1ª Hora</label>
                    <input type="number" step="0.01" {...register('preco_primeira_hora')} id="preco_primeira_hora" placeholder="15.00" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                    {errors.preco_primeira_hora && <p className="text-red-500 text-xs mt-1">{errors.preco_primeira_hora.message}</p>}
                </div>
                <div>
                    <label htmlFor="preco_horas_adicionais" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora Adicional</label>
                    <input type="number" step="0.01" {...register('preco_horas_adicionais')} id="preco_horas_adicionais" placeholder="8.00" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                    {errors.preco_horas_adicionais && <p className="text-red-500 text-xs mt-1">{errors.preco_horas_adicionais.message}</p>}
                </div>
                <div>
                    <label htmlFor="preco_diaria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diária</label>
                    <input type="number" step="0.01" {...register('preco_diaria')} id="preco_diaria" placeholder="60.00" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                    {errors.preco_diaria && <p className="text-red-500 text-xs mt-1">{errors.preco_diaria.message}</p>}
                </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center disabled:bg-gray-400">
                {isSubmitting ? <Loader2 className="animate-spin" /> : title}
            </button>
        </form>
    );
};

const Pagination = ({ totalItens, itensPorPagina, paginaAtual, onPageChange }) => {
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    if (totalPaginas <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${paginaAtual === page ? 'bg-amber-500 text-white shadow' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'}`}>
                    {page}
                </button>
            ))}
        </div>
    );
};
// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA PÁGINA
// -----------------------------------------------------------------------------
export default function GerenciarPoliticasPage() {
    const [meusEstacionamentos, setMeusEstacionamentos] = useState([]);
    const [filtroEstacionamento, setFiltroEstacionamento] = useState('');
    const [politicasAtivas, setPoliticasAtivas] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [modalState, setModalState] = useState({ isOpen: false, politica: null, type: '' });

    const [paginaAtiva, setPaginaAtiva] = useState(1);
    const [paginaHistorico, setPaginaHistorico] = useState(1);

    const fetchData = useCallback(async (estacionamentoId) => {
        if (!estacionamentoId) return;
        setIsLoading(true);
        setPaginaAtiva(1);
        setPaginaHistorico(1);
        try {
            const [ativasRes, historicoRes] = await Promise.all([
                api.get(`/estacionamentos/${estacionamentoId}/politicas`),
                api.get(`/estacionamentos/${estacionamentoId}/politicas/historico`)
            ]);
            setPoliticasAtivas(ativasRes.data);
            setHistorico(historicoRes.data);
        } catch {
            toast.error("Erro ao carregar políticas de preço.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await api.get('/estacionamentos/meus');
                setMeusEstacionamentos(response.data);
                if (response.data.length > 0) {
                    const primeiroId = response.data[0].id_estacionamento.toString();
                    setFiltroEstacionamento(primeiroId);
                } else {
                    setIsLoading(false);
                }
            } catch {
                setError('Não foi possível carregar seus estacionamentos.');
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (filtroEstacionamento) fetchData(filtroEstacionamento);
    }, [filtroEstacionamento, fetchData]);

    const politicasAtivasDaPagina = useMemo(() => {
        const inicio = (paginaAtiva - 1) * POLITICAS_ATIVAS_POR_PAGINA;
        return politicasAtivas.slice(inicio, inicio + POLITICAS_ATIVAS_POR_PAGINA);
    }, [politicasAtivas, paginaAtiva]);

    const historicoDaPagina = useMemo(() => {
        const inicio = (paginaHistorico - 1) * POLITICAS_HISTORICO_POR_PAGINA;
        return historico.slice(inicio, inicio + POLITICAS_HISTORICO_POR_PAGINA);
    }, [historico, paginaHistorico]);

    const handleOpenModal = (type, politica = null) => {
        setModalState({ isOpen: true, type, politica });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, politica: null, type: '' });
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const { politica, type } = modalState;
        const loadingToast = toast.loading(type === 'edit' ? "Atualizando política..." : "Criando política...");
        const isEditing = type === 'edit';

        const apiCall = isEditing
            ? api.put(`/estacionamentos/${filtroEstacionamento}/politicas/${politica.id_politica_preco}`, data)
            : api.post(`/estacionamentos/${filtroEstacionamento}/politicas`, data);

        try {
            await apiCall;
            toast.success(isEditing ? "Política atualizada!" : "Política salva com sucesso!", { id: loadingToast });
            handleCloseModal();
            fetchData(filtroEstacionamento);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ocorreu um erro.', { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDeactivate = async () => {
        const politicaId = modalState.politica.id_politica_preco;
        const loadingToast = toast.loading("Desativando...");
        try {
            await api.delete(`/estacionamentos/${filtroEstacionamento}/politicas/${politicaId}`);
            toast.success("Política movida para o histórico.", { id: loadingToast });
            handleCloseModal();
            fetchData(filtroEstacionamento);
        } catch (error) { toast.error("Erro ao desativar política.", { id: loadingToast }); }
    };

    const onRestore = async (politicaId) => {
        const loadingToast = toast.loading("Restaurando...");
        try {
            await api.patch(`/estacionamentos/${filtroEstacionamento}/politicas/${politicaId}/restaurar`);
            toast.success("Política restaurada com sucesso!", { id: loadingToast });
            fetchData(filtroEstacionamento);
        } catch (error) { toast.error("Erro ao restaurar política.", { id: loadingToast }); }
    };

    if (isLoading && meusEstacionamentos.length === 0 && !error) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;
    }
    if (error) { return <div className="p-8 text-center text-red-500">{error}</div>; }

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 p-4 sm:p-8 font-sans">
            <div className="w-full max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Políticas de Preço</h1>
                    <div className="flex-1 w-full sm:w-auto sm:max-w-xs">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Gerenciar Estacionamento</label>
                        <select onChange={(e) => setFiltroEstacionamento(e.target.value)} value={filtroEstacionamento} disabled={meusEstacionamentos.length <= 1} className="w-full mt-1 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500">
                            {meusEstacionamentos.map(e => <option key={e.id_estacionamento} value={e.id_estacionamento}>{e.nome}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Políticas Ativas</h2>
                        <button onClick={() => handleOpenModal('create')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition">
                            <PlusCircle size={18} /> Nova Política
                        </button>
                    </div>
                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin text-amber-500" /></div>
                        : politicasAtivas.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {politicasAtivasDaPagina.map(p => <PoliticaCard key={p.id_politica_preco} politica={p} onEdit={() => handleOpenModal('edit', p)} onDeactivate={() => handleOpenModal('confirmDelete', p)} />)}
                                </div>
                                <Pagination totalItens={politicasAtivas.length} itensPorPagina={POLITICAS_ATIVAS_POR_PAGINA} paginaAtual={paginaAtiva} onPageChange={setPaginaAtiva} />
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <Tags className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Nenhuma política de preço ativa.</h3>
                                <p className="mt-1 text-sm">Clique em "Nova Política" para começar.</p>
                            </div>
                        )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4"><History size={22} /> Histórico de Políticas</h2>
                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin text-amber-500" /></div>
                        : historico.length > 0 ? (
                            <>
                                <ul className="space-y-3">
                                    {historicoDaPagina.map(p => (
                                        <li key={p.id_politica_preco} className="bg-gray-50 dark:bg-slate-700/70 p-3 rounded-lg flex justify-between items-center hover:shadow-md hover:shadow-slate-500/20 dark:hover:shadow-slate-700/30 transition-shadow border dark:border-slate-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{p.descricao}</span>
                                            <button onClick={() => onRestore(p.id_politica_preco)} className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 font-semibold p-2 rounded-md hover:bg-amber-100/50 dark:hover:bg-amber-900/50 transition-colors">
                                                <ArchiveRestore className="text-amber-500" size={16} /> Restaurar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <Pagination totalItens={historico.length} itensPorPagina={POLITICAS_HISTORICO_POR_PAGINA} paginaAtual={paginaHistorico} onPageChange={setPaginaHistorico} />
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <Archive className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Seu histórico está vazio.</h3>
                                <p className="mt-1 text-sm">Políticas desativadas aparecerão aqui.</p>
                            </div>
                        )}
                </div>
            </div>

            <Modal isOpen={modalState.type === 'create' || modalState.type === 'edit'} onClose={handleCloseModal} title={modalState.politica ? "Editar Política de Preço" : "Criar Nova Política"}>
                <PoliticaForm isSubmitting={isSubmitting} onSubmit={onSubmit} defaultValues={modalState.politica || {}} title={modalState.politica ? "Salvar Alterações" : "Criar Política"} />
            </Modal>

            <Modal isOpen={modalState.type === 'confirmDelete'} onClose={handleCloseModal} title={`Desativar "${modalState.politica?.descricao}"?`}>
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tem certeza que deseja mover esta política para o histórico? Ela se tornará inativa, mas poderá ser restaurada no futuro.</p>
                    <div className="flex gap-4 mt-6">
                        <button onClick={onDeactivate} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">Sim, Desativar</button>
                        <button onClick={handleCloseModal} className="flex-1 bg-gray-200 dark:bg-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition">Cancelar</button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}