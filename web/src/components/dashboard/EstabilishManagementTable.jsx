// src/components/Dashboard/EstablishmentManagementTable.jsx
"use client";

import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function EstablishmentManagementTable({ establishments }) { // Recebe 'establishments' via prop
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'verified', 'pending', 'deactivated'

  // O filtro agora trabalha DIRETAMENTE com o array 'establishments' que foi passado.
  const filteredEstablishments = establishments.filter(est => {
    const matchesSearch = est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          est.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          est.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || est.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (estId) => {
    // Lógica de simulação
    console.log(`Toggle status for establishment ID: ${estId}`);
  };

  const handleVerify = (estId) => {
    // Lógica de simulação
    console.log(`Verify establishment ID: ${estId}`);
  };

  const handleViewDetails = (estId) => {
    // Lógica de simulação
    console.log(`View details for establishment ID: ${estId}`);
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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gerenciamento de Estacionamentos</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* ... (Filtros e busca) ... */}
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

      <div className="overflow-x-auto">
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
            {filteredEstablishments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Nenhum estacionamento encontrado.</td>
              </tr>
            ) : (
              filteredEstablishments.map((est) => (
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
                        onChange={() => handleToggleStatus(est.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// REMOVIDA: A definição de const mockEstablishments [...]