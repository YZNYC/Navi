// src/components/Dashboard/ChartCard.jsx
import React from 'react';

export default function ChartCard({ title, subtitle, children, dropdownOptions, selectedDropdown, onDropdownChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 flex flex-col border-b-3 border-amber-500">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {dropdownOptions && (
          <select
            className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md py-1 px-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-ambar-500"
            value={selectedDropdown}
            onChange={(e) => onDropdownChange && onDropdownChange(e.target.value)}
          >
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex-1 min-h-[250px]">{children}</div> {/* Garante altura mínima para o gráfico */}
    </div>
  );
}