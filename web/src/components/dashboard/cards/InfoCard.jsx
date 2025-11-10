// src/components/InfoCard.jsx

import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa'; // Mantemos os ícones de seta

const InfoCard = ({ title, value, change, icon: Icon, unit = '' }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  // O change pode ser 0 ou undefined. Se for undefined, não mostraremos a porcentagem.
  const hasChange = change !== undefined && change !== null;

  // Classes Tailwind para Modo Claro/Escuro e Cores
  const changeTextClass = isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500';
  const ArrowIcon = isPositive ? FaArrowUp : isNegative ? FaArrowDown : FaMinus;

  // Formatando o valor
  const formattedValue = unit === 'R$'
    ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value.toLocaleString('pt-BR');

  return (
    // CORREÇÃO: Aplicando classes Tailwind para o Card e Flexbox
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 flex flex-col gap-4 border-l-3 border-amber-500">
      
      {/* Título e Ícone */}
      <div className="flex justify-between items-center">
        {/* CORREÇÃO: Classes Tailwind para texto e cor */}
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {/* CORREÇÃO: Aplica cor de destaque ao ícone */}
        {Icon && <Icon className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
      </div>
      
      {/* Valor Principal */}
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {formattedValue}
      </div>
      
      {/* Porcentagem de Mudança */}
      {hasChange && (
        // CORREÇÃO: Classes Tailwind para a mudança percentual
        <div className={`flex items-center text-sm font-medium ${changeTextClass}`}>
          <ArrowIcon className="w-3 h-3 mr-1" />
          {/* Usamos Math.abs para garantir que o número exibido seja positivo (a seta já indica a direção) */}
          {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default InfoCard;