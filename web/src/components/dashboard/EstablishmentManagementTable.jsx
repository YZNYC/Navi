// src/components/Dashboard/EstablishmentManagementTable.jsx
"use client";

import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 4; // Itens por página

export default function EstablishmentManagementTable({ establishments, onUpdate, axiosFetcher }) { 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(1); 

  const filteredEstablishments = establishments.filter(est => {
    const matchesSearch = est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          est.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          est.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || est.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  // LÓGICA DE PAGINAÇÃO
  const totalPages = Math.ceil(filteredEstablishments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredEstablishments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // LÓGICA DE AÇÃO: Alternar Ativo/Inativo - (Ativação/Inativação)
  const handleToggleStatus = async (estId, currentStatus) => {
    // Determina o novo estado 'ativo' do BD (true/false)
    const newActiveState = currentStatus === 'deactivated'; 
    const action = newActiveState ? 'Ativando' : 'Desativando';
    
    const promise = axiosFetcher(`/estacionamentos/${estId}`, {
        method: 'PATCH', // 🚨 MUDANÇA: Usando PATCH
        data: { ativo: newActiveState }, // Envia o booleano 'ativo' para o BD
    });

    toast.promise(promise, {
        loading: `${action} estacionamento...`,
        success: `Estacionamento atualizado para ${newActiveState ? 'Ativo' : 'Inativo'}.`,
        error: (err) => `Falha ao alterar status: ${err.message}`,
    });

    try {
        await promise;
        onUpdate(); 
    } catch (e) {
        console.error(e);
    }
  };

  // LÓGICA DE AÇÃO: Verificar (Ativar)
  const handleVerify = async (estId) => {
    
    const promise = axiosFetcher(`/estacionamentos/${estId}`, {
        method: 'PATCH', // 🚨 MUDANÇA: Usando PATCH
        data: { ativo: true }, 
    });

    toast.promise(promise, {
        loading: `Verificando estacionamento...`,
        success: `Estacionamento verificado com sucesso!`,
        error: (err) => `Falha ao verificar: ${err.message}`,
    });

    try {
        await promise;
        onUpdate();
    } catch (e) {
        console.error(e);
    }
  };

  const handleViewDetails = (estId) => {
    toast(`Visualizando detalhes do estabelecimento ID: ${estId}`, { icon: '👁️' });
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">Verificado</span>;
      case 'pending': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100">Pendente</span>;
      case 'deactivated': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">Desativado</span>;
      default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">{status}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 flex flex-col h-full border-b-3 border-amber-500">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gerenciamento de Estacionamentos</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CNPJ, endereço..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="verified">Verificado</option>
          <option value="pending">Pendente</option>
          <option value="deactivated">Desativado</option>
        </select>
      </div>

      <div className="overflow-x-auto flex-1 min-h-[300px]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CNPJ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endereço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avaliação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Nenhum estacionamento encontrado.</td>
              </tr>
            ) : (
              currentItems.map((est) => (
                <tr key={est.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{est.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{est.cnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{est.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(est.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {est.rating} <span className="text-yellow-500">★</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(est.id)}
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {est.status === 'pending' && (
                      <button
                        onClick={() => handleVerify(est.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Verificar Estacionamento"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                     <label className="relative inline-flex items-center cursor-pointer" title={est.status === 'deactivated' ? "Ativar" : "Desativar"}>
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={est.status !== 'deactivated'} 
                        onChange={() => handleToggleStatus(est.id, est.status)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
                    </label>
                  </td>
                </tr>
              ))
            )}
            {/* Linhas de preenchimento para manter o layout fixo */}
            {Array.from({ length: ITEMS_PER_PAGE - currentItems.length }).map((_, index) => (
                <tr key={`filler-${index}`} className="opacity-0 h-[48px]">
                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap">.</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPONENTE DE PAGINAÇÃO */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Exibindo {Math.min(startIndex + 1, filteredEstablishments.length)}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredEstablishments.length)} de {filteredEstablishments.length} estacionamentos
        </span>
        <div className="flex items-center space-x-2">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 transition"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-white">
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 transition"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
}