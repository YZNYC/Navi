'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES
// -----------------------------------------------------------------------------
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, PlusCircle, Loader2, Users, X, Edit, Trash2 } from 'lucide-react';
import { IMaskInput } from 'react-imask';

// -----------------------------------------------------------------------------
// SCHEMAS E COMPONENTES DE UI
// -----------------------------------------------------------------------------
const criarEAdicionarFuncionarioSchema = z.object({
  nome: z.string().min(3, "O nome completo é obrigatório."),
  email: z.string().email("Formato de email inválido."),
  telefone: z.string().optional(),
  permissao: z.enum(['GESTOR', 'OPERADOR']),
});
const editarFuncionarioSchema = z.object({
  email: z.string().email("Formato de email inválido."),
  telefone: z.string().optional(),
  permissao: z.enum(['GESTOR', 'OPERADOR']),
});

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={onClose}>
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

const FuncionarioTableRow = ({ funcionario, onEditClick, onDeleteClick }) => {
    const permissaoClasses = {
        GESTOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        OPERADOR: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    const iniciais = funcionario.usuario.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        {funcionario.usuario.url_foto_perfil ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={funcionario.usuario.url_foto_perfil} alt={funcionario.usuario.nome} />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                                {iniciais}
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{funcionario.usuario.nome}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{funcionario.usuario.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permissaoClasses[funcionario.permissao]}`}>
                    {funcionario.permissao}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{funcionario.usuario.telefone || '-'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEditClick(funcionario)} className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-400 mr-4 transition-colors"><Edit size={18} /></button>
                <button onClick={() => onDeleteClick(funcionario)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
            </td>
        </tr>
    );
};

const MaskedInput = React.forwardRef((props, ref) => {
    const { onChange, ...otherProps } = props;
    return (
        <IMaskInput
            {...otherProps}
            mask="(00) 00000-0000"
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500"
            placeholder="(11) 98765-4321"
        />
    );
});
MaskedInput.displayName = 'MaskedInput';

const ModalAdicionarFuncionario = ({ isOpen, onClose, estacionamentoId, onFuncionarioAdicionado }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(criarEAdicionarFuncionarioSchema) });
    const onSubmit = async (data) => {
        const loadingToast = toast.loading("Adicionando funcionário...");
        try {
            await api.post(`/estacionamentos/${estacionamentoId}/funcionarios/novo`, data);
            toast.success("Funcionário adicionado com sucesso!", { id: loadingToast });
            reset(); onClose();
            onFuncionarioAdicionado();
        } catch (error) { toast.error(error.response?.data?.message || 'Erro ao adicionar.', { id: loadingToast }); }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Funcionário">
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 -mt-4 mb-6">Um novo usuário será criado e vinculado a este estacionamento. A senha será temporária.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="nome_add" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                    <input {...register('nome')} id="nome_add" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                </div>
                 <div>
                    <label htmlFor="email_add" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input {...register('email')} id="email_add" type="email" placeholder="email@exemplo.com" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="telefone_add" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone (Opcional)</label>
                    <MaskedInput {...register('telefone')} id="telefone_add" />
                </div>
                <div>
                    <label htmlFor="permissao_add" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nível de Permissão</label>
                    <select {...register('permissao')} id="permissao_add" className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500">
                        <option value="OPERADOR">Operador (Check-in/Check-out)</option>
                        <option value="GESTOR">Gestor (Ver Relatórios)</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition">Adicionar Funcionário</button>
            </form>
        </Modal>
    );
};

const ModalEditarFuncionario = ({ isOpen, onClose, estacionamentoId, funcionario, onFuncionarioAtualizado }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(editarFuncionarioSchema) });
    
    useEffect(() => {
        if (funcionario) {
            reset({
                email: funcionario.usuario.email || '',
                telefone: funcionario.usuario.telefone || '',
                permissao: funcionario.permissao
            });
        }
    }, [funcionario, reset]);

    const onSubmit = async (data) => {
        const loadingToast = toast.loading("Atualizando funcionário...");
        try {
            await Promise.all([
                api.patch(`/estacionamentos/${estacionamentoId}/funcionarios/${funcionario.usuario.id_usuario}`, { permissao: data.permissao }),
                api.put(`/usuarios/${funcionario.usuario.id_usuario}`, { email: data.email, telefone: data.telefone })
            ]);
            toast.success("Funcionário atualizado!", { id: loadingToast });
            onClose();
            onFuncionarioAtualizado();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao atualizar.', { id: loadingToast });
        }
    };
    if (!funcionario) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Editar ${funcionario.usuario.nome}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 <div>
                    <label htmlFor="email_edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input {...register('email')} id="email_edit" type="email" placeholder="email@exemplo.com" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="telefone_edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                    <MaskedInput {...register('telefone')} id="telefone_edit" />
                </div>
                <div>
                    <label htmlFor="permissao_edit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nível de Permissão</label>
                    <select {...register('permissao')} id="permissao_edit" className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 focus:ring-amber-500 focus:border-amber-500">
                        <option value="OPERADOR">Operador</option>
                        <option value="GESTOR">Gestor</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition">Salvar Alterações</button>
            </form>
        </Modal>
    );
};
// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA PÁGINA
// -----------------------------------------------------------------------------
export default function GerenciarFuncionariosPage() {
    const [meusEstacionamentos, setMeusEstacionamentos] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroEstacionamento, setFiltroEstacionamento] = useState('');
    const [filtroPermissao, setFiltroPermissao] = useState('TODOS');
    const [ordem, setOrdem] = useState('ALFABETICA');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingFuncionario, setEditingFuncionario] = useState(null);
    const [deletingFuncionario, setDeletingFuncionario] = useState(null);
    
    const fetchFuncionarios = useCallback(async (estacionamentoId) => {
        if (!estacionamentoId) return;
        setIsLoading(true); setFuncionarios([]);
        try {
            const response = await api.get(`/estacionamentos/${estacionamentoId}/funcionarios`);
            setFuncionarios(response.data);
        } catch (err) { toast.error('Erro ao carregar funcionários.'); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => {
        const fetchEstacionamentos = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/estacionamentos/meus');
                setMeusEstacionamentos(response.data);
                if (response.data.length > 0) {
                    setFiltroEstacionamento(response.data[0].id_estacionamento.toString());
                } else {
                    setIsLoading(false);
                }
            } catch (err) { setError('Não foi possível carregar seus estacionamentos.'); setIsLoading(false); }
        };
        fetchEstacionamentos();
    }, []);
    
    useEffect(() => {
        if (filtroEstacionamento) fetchFuncionarios(filtroEstacionamento);
    }, [filtroEstacionamento, fetchFuncionarios]);

    const onDeleteFuncionario = async (funcionario) => {
        const loadingToast = toast.loading("Removendo funcionário...");
        try {
            await api.delete(`/estacionamentos/${filtroEstacionamento}/funcionarios/${funcionario.usuario.id_usuario}`);
            toast.success("Funcionário removido com sucesso.", { id: loadingToast });
            setDeletingFuncionario(null);
            fetchFuncionarios(filtroEstacionamento);
        } catch (error) { toast.error(error.response?.data?.message || 'Erro ao remover.', { id: loadingToast }); }
    };
    
    const funcionariosFiltradosEOrdenados = useMemo(() => {
        return funcionarios
            .filter(func => filtroPermissao === 'TODOS' || func.permissao === filtroPermissao)
            .sort((a, b) => {
                if (ordem === 'ALFABETICA') {
                    return a.usuario.nome.localeCompare(b.usuario.nome);
                } else { // DATA_CRIACAO (admissao)
                    return new Date(b.data_admissao) - new Date(a.data_admissao);
                }
            });
    }, [funcionarios, filtroPermissao, ordem]);

    if (isLoading && meusEstacionamentos.length === 0 && !error) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;
    }
    if (error) { return <div className="p-8 text-center text-red-500">{error}</div>; }
    
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 p-4 sm:p-8 font-sans">
             <div className="w-full max-w-7xl mx-auto space-y-8">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Funcionários</h1>
                
                {meusEstacionamentos.length === 0 && !isLoading ? (
                    <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-12 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-700 dark:text-white">Nenhum estacionamento encontrado.</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Você precisa cadastrar um estacionamento antes de poder adicionar funcionários.</p>
                    </div>
                ) : (
                <>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4 border-l-4 border-amber-500">
                    <div className="w-full sm:w-1/4">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Estacionamento</label>
                        <select onChange={(e) => setFiltroEstacionamento(e.target.value)} value={filtroEstacionamento} className="w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500">
                           {meusEstacionamentos.map(e => <option key={e.id_estacionamento} value={e.id_estacionamento}>{e.nome}</option>)}
                        </select>
                    </div>
                    <div className="w-full sm:w-1/4">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Cargo</label>
                        <select onChange={(e) => setFiltroPermissao(e.target.value)} value={filtroPermissao} className="w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500">
                           <option value="TODOS">Todos os Cargos</option><option value="GESTOR">Gestor</option><option value="OPERADOR">Operador</option>
                        </select>
                    </div>
                    <div className="w-full sm:w-1/4">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Ordenar por</label>
                        <select onChange={(e) => setOrdem(e.target.value)} value={ordem} className="w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500">
                           <option value="ALFABETICA">Ordem Alfabética</option><option value="DATA_CRIACAO">Mais Recentes</option>
                        </select>
                    </div>
                  {/* --- Botão de Criação --- */}
                     <div className="w-full sm:w-1/4">
                      
                         <label className="text-xs font-medium text-transparent select-none hidden sm:block">Ação</label>
                         <button 
                             onClick={() => setIsCriarModalOpen(true)} 
                             disabled={meusEstacionamentos.length === 0} 
                             className="w-full sm:w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition whitespace-nowrap h-10 text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                         >
                             <PlusCircle size={20} /> Criar Vaga
                         </button>
                     </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    {isLoading ? (
                        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
                    ) : funcionariosFiltradosEOrdenados.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Funcionário</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permissão</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telefone</th>
                                        <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {funcionariosFiltradosEOrdenados.map(func => (
                                        <FuncionarioTableRow key={func.usuario.id_usuario} funcionario={func} 
                                            onEditClick={setEditingFuncionario}
                                            onDeleteClick={setDeletingFuncionario}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                         <div className="text-center py-16">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Nenhum funcionário encontrado</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Filtre novamente ou adicione o primeiro funcionário.</p>
                        </div>
                    )}
                </div>
                </>
                )}
            </div>
            
            <ModalAdicionarFuncionario isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} estacionamentoId={filtroEstacionamento} onFuncionarioAdicionado={() => fetchFuncionarios(filtroEstacionamento)}/>
            
            <ModalEditarFuncionario isOpen={!!editingFuncionario} onClose={() => setEditingFuncionario(null)} estacionamentoId={filtroEstacionamento} funcionario={editingFuncionario} onFuncionarioAtualizado={() => fetchFuncionarios(filtroEstacionamento)}/>

            <Modal isOpen={!!deletingFuncionario} onClose={() => setDeletingFuncionario(null)} title={`Remover ${deletingFuncionario?.usuario.nome}?`}>
                 <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tem certeza que deseja remover <strong className="dark:text-white">{deletingFuncionario?.usuario.nome}</strong> como funcionário? Esta ação não pode ser desfeita.</p>
                    <div className="flex gap-4 mt-6">
                        <button onClick={() => onDeleteFuncionario(deletingFuncionario)} className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">Sim, Remover</button>
                        <button onClick={() => setDeletingFuncionario(null)} className="flex-1 bg-gray-200 dark:bg-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition">Cancelar</button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}