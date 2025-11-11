// src/components/dashboard/buttons/CupomButton.jsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalCreateCupom from "../modal/cupomModal"; // 🚨 Ajuste o nome da importação
import { toast } from 'sonner';

export default function CupomButton() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenModal = () => setIsCreateModalOpen(true);
  const handleCloseModal = () => setIsCreateModalOpen(false);
  
  // Função que será chamada após o modal criar o cupom no BD
  const handleCupomCreated = (newCupom) => {

    toast.success(`Sucesso! Cupom ${newCupom.codigo} criado.`);
    
    handleCloseModal();
  };

  return (
    <>
        {/* Este div era a seção 5 da dashboard, que agora é encapsulada */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Gestão de Cupons Globais
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                Gerencie a criação, edição e desativação de cupons promocionais para toda a plataforma Navi.
            </p>

            <button
                onClick={handleOpenModal}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
                Criar Novo Cupom
            </button>
        </div>

        <ModalCreateCupom
            isOpen={isCreateModalOpen}
            onClose={handleCloseModal}
            onCreate={handleCupomCreated} 
        />
    </>
  );
}