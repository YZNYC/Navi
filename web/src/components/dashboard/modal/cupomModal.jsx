"use client";

import React, { useState, useEffect } from 'react';
import { X, Tag, Percent, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../lib/api'; // Importa a instância do Axios

// Funcao auxiliar que usa o axios (para o modal não precisar da prop axiosFetcher)
const axiosFetcher = async (endpoint, options) => {
    try {
        const response = await api.request(options);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

// Estado inicial limpo para evitar o erro de input controlado/não controlado
const initialCupomData = {
    codigo: '', 
    tipo_desconto: 'PERCENTUAL', // ENUM em maiúsculas
    valor: '',
    data_validade: '', // String vazia, mas tratada no useEffect
    descricao: '', 
    usos_maximos: 1, 
};

export default function CupomModal({ isOpen, onClose, onCreate }) {
  const [cupomData, setcupomData] = useState(initialCupomData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚨 CORREÇÃO 1: Redefinir o estado quando o modal abre (para garantir o estado inicial)
  useEffect(() => {
    if (isOpen) {
        setcupomData(initialCupomData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // O backend espera ENUM em MAIÚSCULAS para tipo_desconto
    const finalValue = name === 'tipo_desconto' ? value.toUpperCase() : value;
    setcupomData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 🚨 Mapeamento para garantir que o backend receba o body esperado
    const dataToSend = {
        codigo: cupomData.codigo.toUpperCase(),
        descricao: cupomData.descricao || `Cupom de ${cupomData.valor}${cupomData.tipo_desconto === 'PERCENTUAL' ? '%' : 'R$'}`,
        tipo_desconto: cupomData.tipo_desconto, 
        valor: parseFloat(cupomData.valor),
        data_validade: cupomData.data_validade, // O formato 'YYYY-MM-DD' já é aceito pelo backend
        usos_maximos: parseInt(cupomData.usos_maximos)
    };
    
    const promise = axiosFetcher('/cupons', {
        method: 'POST',
        data: dataToSend, 
        url: '/cupons' 
    });

    toast.promise(promise, {
        loading: 'Criando cupom...',
        success: (response) => {
            onCreate(response.cupom); // Notifica o pai com os dados do cupom criado
            return `Cupom ${response.cupom.codigo} criado com sucesso!`;
        },
        error: (err) => `Falha: ${err.message}`,
    });

    try {
        await promise;
    } catch (e) {
        // o toast.promise já tratou o erro
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Criar Novo Cupom Global</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400">
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="codigo" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4 mr-2" /> Código do Cupom
            </label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={cupomData.codigo}
              onChange={handleChange}
              placeholder="Ex: NAVI10OFF"
              required
              maxLength={15} 
              className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500 uppercase"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição (Opcional)
            </label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={cupomData.descricao}
              onChange={handleChange}
              placeholder="Ex: 10% de desconto para novos usuários"
              className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Percent className="w-4 h-4 mr-2" /> Tipo de Desconto
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo_desconto"
                  value="percentage"
                  checked={cupomData.tipo_desconto === 'PERCENTUAL'}
                  onChange={handleChange}
                  className="form-radio text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Porcentagem (%)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo_desconto"
                  value="fixed"
                  checked={cupomData.tipo_desconto === 'FIXO'}
                  onChange={handleChange}
                  className="form-radio text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Valor Fixo (R$)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-1">
                <label htmlFor="valor" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor ({cupomData.tipo_desconto === 'PERCENTUAL' ? '%' : 'R$'})
                </label>
                <input
                  type="number"
                  id="valor"
                  name="valor"
                  value={cupomData.valor}
                  onChange={handleChange}
                  min="1"
                  step={cupomData.tipo_desconto === 'FIXO' ? "0.01" : "1"}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                />
            </div>
            <div className="space-y-2 col-span-2">
              <label htmlFor="data_validade" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" /> Data de Validade
              </label>
              <input
                type="date"
                id="data_validade"
                name="data_validade"
                value={cupomData.data_validade}
                onChange={handleChange}
                required
                className="cursor-pointer w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="usos_maximos" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Usos Máximos (Total na Plataforma)
            </label>
            <input
              type="number"
              id="usos_maximos"
              name="usos_maximos"
              value={cupomData.usos_maximos}
              onChange={handleChange}
              min="1"
              required
              className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-screen py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Criando...' : 'Criar Cupom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}