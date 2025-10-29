// src/components/Dashboard/MapCard.jsx
import React from 'react';
import Image from 'next/image';
import { MapPin, Plus, Minus } from 'lucide-react'; // Ícones de mapa e zoom

export default function MapCard({ title }) {
  // Em um ambiente real, você renderizaria um mapa dinâmico aqui (ex: com Leaflet.js ou Google Maps)
  // Por simplicidade, usaremos uma imagem estática para o mockup.

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="relative flex-1 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
        {/* Placeholder para o mapa real */}
        <Image
          src="/map-placeholder.png" // Crie uma imagem de mapa placeholder em `public/`
          alt="Mapa de Estacionamentos por Região"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        {/* Marcadores de exemplo (você os adicionaria dinamicamente) */}
        <div className="absolute top-1/4 left-1/4 bg-indigo-600 text-white rounded-full p-1 shadow-md">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 bg-indigo-600 text-white rounded-full p-1 shadow-md">
          <MapPin className="w-4 h-4" />
        </div>
        
        {/* Controles de zoom (exemplo) */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"><Plus className="w-4 h-4" /></button>
            <button className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"><Minus className="w-4 h-4" /></button>
        </div>

        <div className="absolute top-4 left-4 bg-white dark:bg-slate-700 px-3 py-1 rounded-full text-sm shadow-md text-gray-700 dark:text-gray-300">
            Densidade de Vagas
        </div>

      </div>
    </div>
  );
}