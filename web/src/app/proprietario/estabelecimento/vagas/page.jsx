// frontend/app/gerente/vagas/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../../lib/api';

import { Car, Tag, PlusCircle, Loader2 } from 'lucide-react'; // Ícones

const vagaSchema = z.object({
    identificador: z.string().min(1, "Identificador obrigatório."),
    tipo_vaga: z.enum(['PADRAO', 'PCD', 'IDOSO', 'ELETRICO', 'MOTO']).default('PADRAO'),
});

// Componente para um único estacionamento
const EstacionamentoCard = ({ estacionamento }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(vagaSchema),
    });

    const [vagas, setVagas] = useState([]);
    const [isLoadingVagas, setIsLoadingVagas] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');
    
    const carregarVagas = useCallback(async () => {
        setIsLoadingVagas(true);
        try {
            const response = await api.get(`/estacionamentos/${estacionamento.id_estacionamento}/vagas`);
            setVagas(response.data);
        } catch {
            setApiError("Erro ao carregar vagas.");
        } finally {
            setIsLoadingVagas(false);
        }
    }, [estacionamento.id_estacionamento]);
    
    useEffect(() => {
        carregarVagas();
    }, [carregarVagas]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setApiError('');
        setApiSuccess('');
        const dataParaApi = { ...data, id_estacionamento: estacionamento.id_estacionamento };

        try {
            await api.post('/vagas', dataParaApi);
            setApiSuccess(`Vaga '${data.identificador}' criada!`);
            reset({ identificador: '', tipo_vaga: 'PADRAO' });
            carregarVagas(); // Recarrega a lista de vagas
        } catch (error) {
            setApiError(error.response?.data?.message || 'Erro ao criar vaga.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800">{estacionamento.nome}</h2>
            <p className="text-sm text-gray-500 mb-6">{estacionamento.endereco_completo}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna de Adicionar Vaga */}
                <div className="md:col-span-1">
                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                         <h3 className="font-semibold text-gray-700 flex items-center gap-2"><PlusCircle size={18}/>Adicionar Nova Vaga</h3>
                        <div>
                            <input {...register('identificador')} placeholder="Identificador (ex: A-01)" className="w-full p-2 border rounded-md"/>
                            {errors.identificador && <p className="text-red-500 text-xs mt-1">{errors.identificador.message}</p>}
                        </div>
                        <div>
                             <select {...register('tipo_vaga')} className="w-full p-2 border rounded-md bg-white">
                                <option value="PADRAO">Padrão</option>
                                <option value="PCD">PCD</option>
                                <option value="IDOSO">Idoso</option>
                                <option value="ELETRICO">Carro Elétrico</option>
                                <option value="MOTO">Moto</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Adicionar'}
                        </button>
                         {apiError && <p className="text-red-600 text-xs text-center">{apiError}</p>}
                         {apiSuccess && <p className="text-green-600 text-xs text-center">{apiSuccess}</p>}
                    </form>
                </div>
                
                {/* Coluna de Visualização de Vagas */}
                <div className="md:col-span-2">
                     <h3 className="font-semibold text-gray-700 mb-4">Vagas Existentes ({vagas.length})</h3>
                     {isLoadingVagas ? (
                        <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-yellow-600" size={32}/></div>
                    ) : vagas.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                             {vagas.map(vaga => (
                                <div key={vaga.id_vaga} className={`p-3 rounded-md border text-center ${vaga.status === 'LIVRE' ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <p className="font-bold text-sm text-gray-800">{vaga.identificador}</p>
                                    <p className="text-xs text-gray-500">{vaga.tipo_vaga}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-10 px-6 border-2 border-dashed border-gray-300 rounded-lg h-full flex flex-col justify-center">
                            <Car className="mx-auto h-10 w-10 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma vaga cadastrada</h3>
                            <p className="mt-1 text-sm text-gray-500">Use o formulário para começar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default function GerenciarVagasPage() {
    const [meusEstacionamentos, setMeusEstacionamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMeusEstacionamentos = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/estacionamentos/meus');
                setMeusEstacionamentos(response.data);
            } catch (err) {
                setError('Não foi possível carregar seus estacionamentos.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMeusEstacionamentos();
    }, []);
    
    if (isLoading) {
        return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-yellow-600" size={48}/></div>
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>
    }

    return (
        <main className="min-h-screen bg-[#F7F4F0] p-4 sm:p-8 font-sans">
            <div className="w-full max-w-7xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Vagas</h1>
                {meusEstacionamentos.length > 0 ? (
                    meusEstacionamentos.map(estacionamento => (
                        <EstacionamentoCard key={estacionamento.id_estacionamento} estacionamento={estacionamento} />
                    ))
                ) : (
                    <div className="text-center bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg p-12">
                        <h2 className="text-xl font-bold text-gray-700">Você ainda não tem estacionamentos.</h2>
                        <p className="text-gray-500 mt-2">Para gerenciar vagas, primeiro você precisa cadastrar um estacionamento no sistema.</p>
                         {/* Futuramente, aqui pode ter um botão Link para a página de criação de estacionamentos */}
                    </div>
                )}
            </div>
        </main>
    );
}