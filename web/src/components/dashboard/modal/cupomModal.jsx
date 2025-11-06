"use client";

import React, { useState } from 'react';
import { X, Tag, Percent, Calendar } from 'lucide-react';

export default function CouponModal({ isOpen, onClose }) {
  const [couponData, setCouponData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expirationDate: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Criar Cupom:", couponData);
    onClose(); 
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
            <label htmlFor="code" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4 mr-2" /> Código do Cupom
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={couponData.code}
              onChange={handleChange}
              placeholder="Ex: NAVI10OFF"
              required
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
                  name="discountType"
                  value="percentage"
                  checked={couponData.discountType === 'percentage'}
                  onChange={handleChange}
                  className="form-radio text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Porcentagem (%)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountType"
                  value="fixed"
                  checked={couponData.discountType === 'fixed'}
                  onChange={handleChange}
                  className="form-radio text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Valor Fixo (R$)</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="discountValue" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor ({couponData.discountType === 'percentage' ? '%' : 'R$'})
              </label>
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={couponData.discountValue}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expirationDate" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" /> Expira em
              </label>
              <input
                type="date"
                id="expirationDate"
                name="expirationDate"
                value={couponData.expirationDate}
                onChange={handleChange}
                required
                className="cursor-pointer w-full p-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="cursor-pointer px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Criar Cupom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}