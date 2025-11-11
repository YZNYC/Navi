'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, PlusCircle, Loader2, X, Crown, Users, Edit, Trash2, CalendarX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// -----------------------------------------------------------------------------
// SCHEMAS E CONFIGURAÇÕES
// -----------------------------------------------------------------------------
const planoSchema = z.object({
  nome_plano: z.string().min(3, "O nome do plano é obrigatório (mín. 3 caracteres)."),
  preco_mensal: z.coerce.number({ invalid_type_error: "Preço inválido" }).min(0, "O preço não pode ser negativo."),
  descricao: z.string().optional(),
});

const PLANOS_POR_PAGINA = 6;
const CONTRATOS_POR_PAGINA = 6;

// -----------------------------------------------------------------------------
// COMPONENTES DE UI
// -----------------------------------------------------------------------------
const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 pt-12 relative border-t-4 border-amber-500" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:rotate-90"><X size={28}/></button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{title}</h2>
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const PlanoCard = ({ plano, isDestaque, onEdit, onDelete }) => (
    <div className={`relative bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border-l-4 ${isDestaque ? 'border-amber-500 shadow-amber-500/20' : 'border-gray-300 dark:border-slate-700'} shadow-sm hover:shadow-lg transition-all duration-300 group`}>
        {isDestaque && (
            <div className="absolute top-0 right-4 -mt-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Crown size={12}/> Mais Popular
            </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={onEdit} className="text-gray-400 hover:text-amber-500" title="Editar Plano"><Edit size={16}/></button>
             <button onClick={onDelete} className="text-gray-400 hover:text-red-500" title="Excluir Plano"><Trash2 size={16}/></button>
        </div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-white pr-4">{plano.nome_plano}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[40px]">{plano.descricao}</p>
        <div className="flex justify-between items-end mt-4 pt-4 border-t dark:border-slate-700">
            <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">R$ {parseFloat(plano.preco_mensal).toFixed(2)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">/mês</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Users size={16}/> {plano._count.contrato_mensalista}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Assinantes Ativos</p>
            </div>
        </div>
    </div>
);

const PlanoForm = ({ onSubmit, defaultValues = {}, isSubmitting, title = "Salvar Plano" }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(planoSchema), defaultValues,
    });
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="nome_plano" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Plano</label>
                <input {...register('nome_plano')} id="nome_plano" placeholder="Ex: Plano Diurno - Moto" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500"/>
                {errors.nome_plano && <p className="text-red-500 text-xs mt-1">{errors.nome_plano.message}</p>}
            </div>
            <div>
                <label htmlFor="preco_mensal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço Mensal (R$)</label>
                <input type="number" step="0.01" {...register('preco_mensal')} id="preco_mensal" placeholder="250.00" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500"/>
                {errors.preco_mensal && <p className="text-red-500 text-xs mt-1">{errors.preco_mensal.message}</p>}
            </div>
             <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição (Opcional)</label>
                <textarea {...register('descricao')} id="descricao" placeholder="Ex: Acesso de Segunda a Sexta, das 8h às 18h" rows={3} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500"/>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400">
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

const EmptyState = ({ icon: Icon, title, message }) => (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Icon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm">{message}</p>
    </div>
);
// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA PÁGINA
// -----------------------------------------------------------------------------
export default function GerenciarPlanosPage() {
    const [meusEstacionamentos, setMeusEstacionamentos] = useState([]);
    const [filtroEstacionamento, setFiltroEstacionamento] = useState('');
    const [planos, setPlanos] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [modalState, setModalState] = useState({ isOpen: false, type: '', plano: null });
    
    // Estados para paginação e os novos filtros da tabela
    const [paginaPlanos, setPaginaPlanos] = useState(1);
    const [paginaContratos, setPaginaContratos] = useState(1);
    const [filtroStatusContrato, setFiltroStatusContrato] = useState('TODOS');
    const [termoBusca, setTermoBusca] = useState('');
    
    const fetchData = useCallback(async (estacionamentoId) => {
        if (!estacionamentoId) return;
        setIsLoading(true);
        try {
            const [planosRes, contratosRes] = await Promise.all([
                api.get(`/estacionamentos/${estacionamentoId}/planos`),
                api.get(`/estacionamentos/${estacionamentoId}/contratos`)
            ]);
            setPlanos(planosRes.data);
            setContratos(contratosRes.data);
        } catch {
            toast.error("Erro ao carregar os dados.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
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

    const handleEstacionamentoChange = (e) => {
        const novoId = e.target.value;
        setFiltroEstacionamento(novoId);
    };

    const handleOpenModal = (type, plano = null) => setModalState({ isOpen: true, type, plano });
    const handleCloseModal = () => setModalState({ isOpen: false, type: '', plano: null });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const { plano, type } = modalState;
        const loadingToast = toast.loading(type === 'edit' ? "Atualizando plano..." : "Criando plano...");
        const isEditing = type === 'edit';
        
        const apiCall = isEditing 
            ? api.put(`/estacionamentos/${filtroEstacionamento}/planos/${plano.id_plano}`, data)
            : api.post(`/estacionamentos/${filtroEstacionamento}/planos`, data);
        try {
            await apiCall;
            toast.success(isEditing ? "Plano atualizado!" : "Plano criado!", { id: loadingToast });
            handleCloseModal();
            fetchData(filtroEstacionamento);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Ocorreu um erro.', { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const onDelete = async () => {
        const loadingToast = toast.loading("Excluindo plano...");
        try {
            await api.delete(`/estacionamentos/${filtroEstacionamento}/planos/${modalState.plano.id_plano}`);
            toast.success("Plano excluído com sucesso.", { id: loadingToast });
            handleCloseModal();
            fetchData(filtroEstacionamento);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao excluir.', { id: loadingToast, duration: 6000 });
        }
    };

    const planosOrdenados = useMemo(() => {
        if (!planos || planos.length === 0) return [];
        return [...planos].sort((a, b) => b._count.contrato_mensalista - a._count.contrato_mensalista);
    }, [planos]);
    
    const contratosFiltrados = useMemo(() => {
        return contratos
            .filter(c => (filtroStatusContrato === 'TODOS' || c.status === filtroStatusContrato))
            .filter(c => 
                !termoBusca || 
                c.usuario.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
                c.plano_mensal.nome_plano.toLowerCase().includes(termoBusca.toLowerCase())
            );
    }, [contratos, filtroStatusContrato, termoBusca]);
    
    const planosDaPagina = useMemo(() => planosOrdenados.slice((paginaPlanos - 1) * PLANOS_POR_PAGINA, ((paginaPlanos - 1) * PLANOS_POR_PAGINA) + PLANOS_POR_PAGINA), [planosOrdenados, paginaPlanos]);
    const contratosDaPagina = useMemo(() => contratosFiltrados.slice((paginaContratos - 1) * CONTRATOS_POR_PAGINA, ((paginaContratos - 1) * CONTRATOS_POR_PAGINA) + CONTRATOS_POR_PAGINA), [contratosFiltrados, paginaContratos]);
    
    if (isLoading && meusEstacionamentos.length === 0 && !error) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;
    }
    if (error) { return <div className="p-8 text-center text-red-500">{error}</div>; }

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 p-4 sm:p-8 font-sans">
             <div className="w-full max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Planos e Mensalistas</h1>
                     <div className="flex-1 w-full sm:w-auto sm:max-w-xs">
                         <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Gerenciar Estacionamento</label>
                         <select onChange={handleEstacionamentoChange} value={filtroEstacionamento} disabled={meusEstacionamentos.length <= 1} className="w-full mt-1 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500">
                           {meusEstacionamentos.map(e => <option key={e.id_estacionamento} value={e.id_estacionamento}>{e.nome}</option>)}
                        </select>
                    </div>
                </div>
                
                {isLoading ? <div className="flex justify-center p-12"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
                : (
                <>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Planos Ofertados</h2>
                            <button onClick={() => handleOpenModal('create')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition">
                               <PlusCircle size={18}/> Novo Plano
                            </button>
                        </div>
                        {planos.length > 0 ? (
                           <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {planosDaPagina.map(p => <PlanoCard key={p.id_plano} plano={p} isDestaque={p.id_plano === planosOrdenados[0].id_plano && paginaPlanos === 1} onEdit={() => handleOpenModal('edit', p)} onDelete={() => handleOpenModal('confirmDelete', p)} />)}
                            </div>
                            <Pagination totalItens={planos.length} itensPorPagina={PLANOS_POR_PAGINA} paginaAtual={paginaPlanos} onPageChange={setPaginaPlanos} />
                           </>
                        ) : (
                           <EmptyState icon={CalendarX} title="Nenhum plano mensal cadastrado." message="Clique em 'Novo Plano' para criar o primeiro."/>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border dark:border-slate-700">
                         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Gerenciar Mensalistas</h2>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <input type="text" placeholder="Buscar por cliente ou plano..." value={termoBusca} onChange={(e) => {setTermoBusca(e.target.value); setPaginaContratos(1);}} className="w-full md:w-48 p-2 text-sm border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                                <select onChange={(e) => {setFiltroStatusContrato(e.target.value); setPaginaContratos(1);}} className="w-full md:w-auto p-2 text-sm border rounded-md bg-white dark:bg-slate-700 dark:border-slate-600">
                                    <option value="TODOS">Todos os Status</option>
                                    <option value="ATIVO">Ativos</option>
                                    <option value="CANCELADO">Cancelados</option>
                                </select>
                            </div>
                         </div>
                        
                        {contratos.length > 0 ? (
                           <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Mensalista</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Plano</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-slate-700">
                                        {contratosDaPagina.map(c => (
                                            <tr key={c.id_contrato} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4 dark:text-white">{c.usuario.nome}</td>
                                                <td className="px-6 py-4 dark:text-gray-300">{c.plano_mensal.nome_plano}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.status === 'ATIVO' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>{c.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                             <Pagination totalItens={contratosFiltrados.length} itensPorPagina={CONTRATOS_POR_PAGINA} paginaAtual={paginaContratos} onPageChange={setPaginaContratos} />
                           </>
                        ) : (
                           <EmptyState icon={Users} title="Nenhum mensalista encontrado." message="Seus clientes com planos ativos ou cancelados aparecerão aqui."/>
                        )}
                    </div>
                </>
                )}
             </div>
             
             <Modal isOpen={modalState.type === 'create' || modalState.type === 'edit'} onClose={handleCloseModal} title={modalState.type === 'edit' ? "Editar Plano" : "Criar Novo Plano"}>
                 <PlanoForm isSubmitting={isSubmitting} onSubmit={onSubmit} defaultValues={modalState.plano || {}} title={modalState.type === 'edit' ? "Salvar Alterações" : "Criar Plano"}/>
             </Modal>

              <Modal isOpen={modalState.type === 'confirmDelete'} onClose={handleCloseModal} title={`Excluir "${modalState.plano?.nome_plano}"?`}>
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tem certeza? Esta ação é permanente e não pode ser desfeita. Contratos existentes podem ser afetados.</p>
                    <div className="flex gap-4 mt-6">
                        <button onClick={onDelete} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">Sim, Excluir</button>
                        <button onClick={handleCloseModal} className="flex-1 bg-gray-200 dark:bg-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition">Cancelar</button>
                    </div>
                </div>
             </Modal>
        </main>
    );
}