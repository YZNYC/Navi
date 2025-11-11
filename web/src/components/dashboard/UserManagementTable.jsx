// src/components/Dashboard/UserManagementTable.jsx
"use client";

import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // 🚨 IMPORTAÇÃO NECESSÁRIA

const ITEMS_PER_PAGE = 4; // Itens por página

export default function UserManagementTable({ users, onUpdate, axiosFetcher }) { 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); 
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter(); // 🚨 INICIALIZAÇÃO

  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' ? user.isActive : !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // LÓGICA DE PAGINAÇÃO
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Ações de navegação
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // LÓGICA DE AÇÃO: Alternar Status (ativo/inativo)
  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive; 
    
    const promise = axiosFetcher(`/usuarios/${user.id}`, {
        method: 'PATCH',
        data: { ativo: newStatus },
    });

    toast.promise(promise, {
        loading: `Alterando status de ${user.name}...`,
        success: `Status de ${user.name} atualizado para ${newStatus ? 'Ativo' : 'Inativo'}.`,
        error: (err) => `Falha ao alterar status: ${err.message}`,
    });

    try {
        await promise;
        onUpdate();
    } catch (e) {
        console.error(e);
    }
  };

  // LÓGICA DE AÇÃO: Alterar Papel
  const handleChangeRole = async (userId, newRole) => {
      const promise = axiosFetcher(`/usuarios/${userId}`, {
          method: 'PATCH',
          data: { papel: newRole.toUpperCase() },
      });

      toast.promise(promise, {
          loading: `Alterando papel para ${newRole.toUpperCase()}...`,
          success: `Papel atualizado com sucesso para ${newRole.toUpperCase()}.`,
          error: (err) => `Falha ao alterar papel: ${err.message}`,
      });

      try {
          await promise;
          onUpdate();
      } catch (e) {
          console.error(e);
      }
  };

  // 🚨 AÇÃO REAL: Redireciona para a página de detalhes do usuário
  const handleViewDetails = (userId) => {
    toast.info(`Redirecionando para detalhes do usuário ID: ${userId}`);
    router.push(`/admin/usuarios/${userId}`); 
  };


  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gerenciamento de Usuários</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">Todos os Papéis</option>
          <option value="motorista">Motorista</option>
          <option value="proprietario">Proprietário</option>
          <option value="administrador">Administrador</option>
        </select>
        <select
          className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <div className="overflow-x-auto flex-1 min-h-[300px]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Papel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Nenhum usuário encontrado.</td>
              </tr>
            ) : (
              currentItems.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* Select de Papel */}
                    <select
                      className="bg-transparent border border-gray-300 dark:border-slate-600 rounded-md py-1 px-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    >
                      <option value="motorista">Motorista</option>
                      <option value="proprietario">Proprietário</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* Toggle de Status */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={user.isActive}
                        onChange={() => handleToggleStatus(user)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>
                      <span className={`ml-3 text-sm font-medium ${user.isActive ? 'text-green-500' : 'text-red-500'}`}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(user.id)} // 🚨 AÇÃO REAL
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-2"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {/* Linhas de preenchimento para manter o layout fixo */}
            {Array.from({ length: ITEMS_PER_PAGE - currentItems.length }).map((_, index) => (
                <tr key={`filler-user-${index}`} className="opacity-0 h-[48px]">
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap">.</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPONENTE DE PAGINAÇÃO */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Exibindo {Math.min(startIndex + 1, filteredUsers.length)}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} de {filteredUsers.length} usuários
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