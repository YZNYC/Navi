'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Ícones
import { Car, Zap, ParkingSquare, User, Bike, PlusCircle, Building, Loader2, X, Wrench, Trash2, PlayCircle, CarFront, CarFrontIcon  } from 'lucide-react';

// -----------------------------------------------------------------------------
// CONFIGURAÇÕES E SCHEMAS
// -----------------------------------------------------------------------------

const vagaSchema = z.object({
    identificador: z.string()
                   .min(1, "O identificador é obrigatório.")
                   .max(10, "O identificador não pode ter mais de 10 caracteres."),
    tipo_vaga: z.enum(['PADRAO', 'PCD', 'IDOSO', 'ELETRICO', 'MOTO']).default('PADRAO'),
});

const VAGAS_POR_PAGINA_DESKTOP = 32;
const VAGAS_POR_PAGINA_MOBILE = 8; 
const MOBILE_BREAKPOINT = 768;

// -----------------------------------------------------------------------------
// HOOK CUSTOMIZADO PARA RESPONSIVIDADE
// -----------------------------------------------------------------------------
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkScreenSize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    return isMobile;
}

// -----------------------------------------------------------------------------
// COMPONENTES DE UI
// -----------------------------------------------------------------------------
const VagaIcon = ({ tipo, className = "w-6 h-6" }) => {
    switch (tipo) {
        case 'MOTO': return <Bike className={className} />;
        case 'PCD': return <ParkingSquare className={className} />;
        case 'IDOSO': return <User className={className} />;
        case 'ELETRICO': return <Zap className={className} />;
        default: return <Car className={className} />;
    }
};

const VagaCard = ({ vaga, onClick }) => {
    const statusClasses = {
        LIVRE: 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300',
        OCUPADA: 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300',
        RESERVADA: 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300',
        MANUTENCAO: 'bg-gray-200 dark:bg-gray-800/50 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-400',
    };
    return (
        <button onClick={onClick} className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${statusClasses[vaga.status] || statusClasses.MANUTENCAO}`}>
            <VagaIcon tipo={vaga.tipo_vaga} className="w-8 h-8" />
            <span className="font-bold text-gray-900 dark:text-white mt-2 text-base">{vaga.identificador}</span>
            <span className="text-xs font-semibold uppercase tracking-wider">{vaga.status}</span>
        </button>
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

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 pt-12 relative border-t-4 border-amber-500"
                    onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all duration-300 hover:rotate-90">
                        <X size={28}/>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{title}</h2>
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ModalDetalhesVaga = ({ vaga, isOpen, onClose, onAction }) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    useEffect(() => { if (!isOpen) setIsConfirmingDelete(false); }, [isOpen]);
    if (!vaga) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Gerenciar Vaga ${vaga.identificador}`}>
             <div className="space-y-6">
                <div>
                     <h3 className="font-semibold text-gray-800 dark:text-white">Informações</h3>
                     <div className="text-base text-gray-600 dark:text-gray-400 mt-2 space-y-2 border-l-2 border-amber-500 pl-4">
                        <p className="flex items-center gap-2"><strong>Tipo:</strong> <VagaIcon tipo={vaga.tipo_vaga} className="w-5 h-5" /> {vaga.tipo_vaga}</p>
                        <p><strong>Status:</strong> <span className="font-semibold">{vaga.status}</span></p>
                    </div>
                </div>
                {isConfirmingDelete ? (
                    <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
                        <h3 className="font-bold text-red-800 dark:text-red-200">Atenção!</h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">Deseja excluir esta vaga permanentemente?</p>
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => onAction(vaga.id_vaga, 'EXCLUIR')} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">Sim, excluir</button>
                            <button onClick={() => setIsConfirmingDelete(false)} className="flex-1 bg-gray-200 dark:bg-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Ações Rápidas</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            <button onClick={() => onAction(vaga.id_vaga, 'MANUTENCAO')} className="flex items-center justify-center gap-2 py-3 px-4 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:hover:bg-yellow-900/70 rounded-md transition font-medium">
                                <Wrench size={16}/> Manutenção
                            </button>
                             <button onClick={() => onAction(vaga.id_vaga, 'LIVRE')} className="flex items-center justify-center gap-2 py-3 px-4 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/70 rounded-md transition font-medium">
                                 <PlayCircle size={16}/> Marcar como Livre
                            </button>
                            <button onClick={() => setIsConfirmingDelete(true)} className="sm:col-span-2 flex items-center justify-center gap-2 py-3 px-4 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/70 rounded-md transition font-medium">
                                 <Trash2 size={16}/> Excluir Vaga
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA PÁGINA
// -----------------------------------------------------------------------------
export default function GerenciarVagasPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(vagaSchema) });
    const isMobile = useIsMobile();
    const [meusEstacionamentos, setMeusEstacionamentos] = useState([]);
    const [vagas, setVagas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroEstacionamento, setFiltroEstacionamento] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('TODOS');
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [isCriarModalOpen, setIsCriarModalOpen] = useState(false);
    const [vagaSelecionada, setVagaSelecionada] = useState(null);

    const vagasPorPagina = isMobile ? VAGAS_POR_PAGINA_MOBILE : VAGAS_POR_PAGINA_DESKTOP;
    
    // Efeito para buscar os estacionamentos APENAS UMA VEZ no carregamento da página.
    useEffect(() => {
        const fetchEstacionamentosIniciais = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/estacionamentos/meus');
                setMeusEstacionamentos(response.data);
                if (response.data.length > 0) {
                    // Define o primeiro estacionamento da lista como o padrão
                    setFiltroEstacionamento(response.data[0].id_estacionamento.toString());
                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                setError('Não foi possível carregar seus estacionamentos.');
                setIsLoading(false);
            }
        };
        fetchEstacionamentosIniciais();
    }, []); // <-- Array de dependência vazio garante que rode apenas uma vez.

    // Efeito separado para buscar vagas SEMPRE que o filtro de estacionamento mudar.
    useEffect(() => {
        const fetchVagas = async () => {
            if (!filtroEstacionamento) return;
            setIsLoading(true);
            setVagas([]);
            try {
                const response = await api.get(`/estacionamentos/${filtroEstacionamento}/vagas`);
                setVagas(response.data);
                setPaginaAtual(1); // Reseta a paginação ao trocar
            } catch (err) {
                toast.error('Erro ao carregar as vagas do estacionamento.', { className: 'toast-error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchVagas();
    }, [filtroEstacionamento]); // <-- Dispara este efeito a cada mudança no filtro.

    const vagasFiltradas = useMemo(() =>
        vagas.filter(vaga => (filtroStatus === 'TODOS' || vaga.status === filtroStatus) && (filtroTipo === 'TODOS' || vaga.tipo_vaga === filtroTipo)),
        [vagas, filtroStatus, filtroTipo]
    );

      const vagasDaPagina = useMemo(() => {
        const inicio = (paginaAtual - 1) * vagasPorPagina;
        const fim = inicio + vagasPorPagina;
        return vagasFiltradas.slice(inicio, fim);
    }, [vagasFiltradas, paginaAtual, vagasPorPagina]); // <-- 'vagasPorPagina' adicionada como dependência
    
    
    const onSubmitCriarVaga = async (data) => {
        const loadingToast = toast.loading("Criando vaga...");
        try {
            const dataParaApi = { ...data, id_estacionamento: parseInt(filtroEstacionamento) };
            await api.post('/vagas', dataParaApi);
            toast.success(`Vaga '${data.identificador}' criada!`, { id: loadingToast, className: 'toast-success', duration: 4000 });
            setIsCriarModalOpen(false);
            reset();
            const response = await api.get(`/estacionamentos/${filtroEstacionamento}/vagas`);
            setVagas(response.data);
        } catch(error) {
            const errorData = error.response?.data;
            const message = errorData?.errors ? Object.values(errorData.errors).flat().join('\n') : errorData?.message || "Erro ao criar vaga.";
            toast.error(message, { id: loadingToast, className: 'toast-error', duration: 6000 });
        }
    };
    
    const handleAtualizarStatusVaga = async (vagaId, novoStatus) => {
        const loadingToast = toast.loading("Processando...");
        try {
            if (novoStatus === 'EXCLUIR') {
                await api.delete(`/vagas/${vagaId}`);
                toast.success("Vaga excluída com sucesso.", { id: loadingToast, className: 'toast-success' });
            } else {
                await api.put(`/vagas/${vagaId}`, { status: novoStatus });
                toast.success("Status da vaga atualizado.", { id: loadingToast, className: 'toast-success' });
            }
            setVagaSelecionada(null);
            const response = await api.get(`/estacionamentos/${filtroEstacionamento}/vagas`);
            setVagas(response.data);
        } catch(error) {
            const message = error.response?.data?.message || "Erro ao processar a ação.";
            toast.error(message, { id: loadingToast, className: 'toast-error' });
        }
    };
    
    if (isLoading && meusEstacionamentos.length === 0 && !error) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;
    }
    if (error) { return <div className="p-8 text-center text-red-500">{error}</div>; }

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 p-4 sm:p-8 font-sans">
             <div className="w-full max-w-7xl mx-auto space-y-8">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Vagas</h1>
                
  {/* Local: JSX do seu componente GerenciarVagasPage */}

<div className="bg-gray-50 dark:bg-slate-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-end gap-4 border-l-4 border-amber-500">
    
    {/* --- Filtro de Estacionamento --- */}
    <div className="w-full sm:w-1/4">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Estacionamento</label>
        {meusEstacionamentos.length > 1 ? (
            <select onChange={(e) => setFiltroEstacionamento(e.target.value)} value={filtroEstacionamento} className="w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500 h-10"> {/* Altura h-10 */}
                {meusEstacionamentos.map(e => <option key={e.id_estacionamento} value={e.id_estacionamento}>{e.nome}</option>)}
            </select>
        ) : (
             <div className="font-semibold text-gray-700 dark:text-gray-200 p-2 flex items-center gap-2 w-full mt-1 h-10 border-b border-gray-300 dark:border-slate-600"> {/* Altura h-10 */}
                 <Building size={16}/> {meusEstacionamentos[0]?.nome || 'Nenhum'}
             </div>
        )}
    </div>

    {/* --- Filtro de Tipo de Vaga --- */}
    <div className="w-full sm:w-1/4">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tipo de Vaga</label>
        <select onChange={(e) => { setFiltroTipo(e.target.value); setPaginaAtual(1); }} className="w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500 h-10"> {/* Altura h-10 */}
           <option value="TODOS">Todos os Tipos</option><option value="PADRAO">Padrão</option><option value="PCD">PCD</option><option value="IDOSO">Idoso</option>
           <option value="ELETRICO">Elétrico</option><option value="MOTO">Moto</option>
        </select>
    </div>
    
    {/* --- Filtro de Status --- */}
    <div className="w-full sm:w-1/4">
       <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
        <select onChange={(e) => { setFiltroStatus(e.target.value); setPaginaAtual(1); }} className="w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500 h-10"> {/* Altura h-10 */}
           <option value="TODOS">Todos os Status</option><option value="LIVRE">Livres</option><option value="OCUPADA">Ocupadas</option>
           <option value="RESERVADA">Reservadas</option><option value="MANUTENCAO">Manutenção</option>
       </select>
   </div>

    {/* --- Botão de Criação --- */}
    <div className="w-full sm:w-1/4">
        {/* Adicionado label invisível para alinhar o botão corretamente com os inputs */}
        <label className="text-xs font-medium text-transparent select-none hidden sm:block">Ação</label>
        <button 
            onClick={() => setIsCriarModalOpen(true)} 
            disabled={meusEstacionamentos.length === 0} 
            className="w-full sm:w-full mt-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition whitespace-nowrap h-10 text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <PlusCircle size={20} /> Criar Vaga
        </button>
    </div>
</div>
                 {isLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
                ) : vagas.length > 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Exibindo {vagasDaPagina.length} de {vagasFiltradas.length} vagas (Total: {vagas.length}).</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {vagasDaPagina.map(vaga => <VagaCard key={vaga.id_vaga} vaga={vaga} onClick={() => setVagaSelecionada(vaga)} />)}
                        </div>
                        <Pagination totalItens={vagasFiltradas.length} itensPorPagina={vagasPorPagina} paginaAtual={paginaAtual} onPageChange={setPaginaAtual} />
                    </div>
                ) : (
                    <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-12 shadow-sm">
                        <CarFront className="mx-auto h-12 w-12 text-gray-400" />
                         <h2 className="text-xl font-bold text-gray-700 dark:text-white">Este estacionamento ainda não possui vagas.</h2>
                         <p className="text-gray-500 dark:text-gray-400 mt-2">Clique no botão "Criar Vaga" para começar.</p>
                    </div>
                )}
            </div>
            
            <Modal isOpen={isCriarModalOpen} onClose={() => setIsCriarModalOpen(false)} title="Adicionar Nova Vaga">
                <form onSubmit={handleSubmit(onSubmitCriarVaga)} className="space-y-6">
                     <div>
                         <label htmlFor="identificador" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Identificador da Vaga</label>
                         <input {...register('identificador')} id="identificador" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-amber-500 focus:border-amber-500" placeholder="Ex: A-01, G1-15..."/>
                         {errors.identificador && <p className="text-red-500 text-xs mt-1">{errors.identificador.message}</p>}
                     </div>
                     <div>
                        <label htmlFor="tipo_vaga" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Vaga</label>
                         <select {...register('tipo_vaga')} id="tipo_vaga" className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-amber-500 focus:border-amber-500">
                            <option value="PADRAO">Padrão</option><option value="PCD">PCD</option>
                            <option value="IDOSO">Idoso</option><option value="ELETRICO">Elétrico</option><option value="MOTO">Moto</option>
                        </select>
                     </div>
                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200">Salvar Vaga</button>
                </form>
            </Modal>
            
            <ModalDetalhesVaga isOpen={!!vagaSelecionada} onClose={() => setVagaSelecionada(null)} vaga={vagaSelecionada} onAction={handleAtualizarStatusVaga} />
        </main>
    );
}