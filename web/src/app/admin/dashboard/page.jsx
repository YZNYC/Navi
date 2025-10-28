// src/app/adm/page.jsx
import React from 'react';

// Componente para o ícone NAVI (mockup simples)
const NaviLogo = () => (
    <div className="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-md">
        <span className="font-bold text-sm text-gray-800">NAVI</span>
    </div>
);

// Componente para o ícone de '+' (mockup simples)
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

// Componente para as estrelas de avaliação
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
            ))}
            {hasHalfStar && (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <defs><linearGradient id="half"><stop offset="50%" stopColor="#FACC15"/><stop offset="50%" stopColor="#D1D5DB"/></linearGradient></defs>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" fill="url(#half)"></path>
                </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
            ))}
        </div>
    );
};


export default function DashboardPage() {
    return (
        // A div raiz agora define o fundo, padding e arredondamento para o conteúdo do dashboard.
        // - bg-gray-100: O fundo claro que você quer para a área de conteúdo.
        // - p-8: Padding em todas as direções para espaçar o conteúdo das bordas internas.
        // - rounded-xl: Aplica bordas arredondadas ao contêiner principal do dashboard.
        // - h-full: Opcional, faz com que esta div ocupe a altura total disponível dentro do <main>.
        <div className="bg-gray-100 p-8 rounded-xl h-full">
            {/* Top Section: Analysis Query */}
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">
                    Quer uma análise mais profunda do seu negócio?
                </h1>
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
                    <NaviLogo />
                    <PlusIcon />
                    <input
                        type="text"
                        placeholder="Pergunte alguma coisa"
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Middle Section: Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Novos Assinantes */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-between">
                    <h2 className="text-lg text-gray-600 mb-2">Novos Assinantes</h2>
                    <div className="flex items-end justify-between">
                        <span className="text-5xl font-bold text-gray-900">150</span>
                        <span className="text-green-500 font-medium text-lg">+15%</span>
                    </div>
                </div>

                {/* Card 2: Tempo de estadia médio */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-between">
                    <h2 className="text-lg text-gray-600 mb-2">Tempo de estadia médio</h2>
                    <div className="flex items-end justify-between">
                        <span className="text-5xl font-bold text-gray-900">1h</span>
                        <span className="text-gray-400 font-medium text-2xl">—</span>
                    </div>
                </div>

                {/* Card 3: Taxa de ocupação */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-between">
                    <h2 className="text-lg text-gray-600 mb-2">Taxa de ocupação</h2>
                    <div className="flex items-end justify-between">
                        <span className="text-5xl font-bold text-gray-900">76%</span>
                        <span className="text-green-500 font-medium text-lg">+3%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Chart and Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart Card: Mensalistas por mês */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg text-gray-600 mb-4">Mensalistas por mês</h2>
                    <div className="flex items-end h-40"> {/* Container para o gráfico */}
                        <div className="flex-1 text-center text-xs text-gray-500 mr-2">
                            <div className="h-8 bg-yellow-500 rounded-sm mb-1 w-full" style={{ height: '20%' }}></div> {/* 20% */}
                            Janeiro
                        </div>
                        <div className="flex-1 text-center text-xs text-gray-500 mr-2">
                            <div className="h-12 bg-yellow-500 rounded-sm mb-1 w-full" style={{ height: '30%' }}></div> {/* 30% */}
                            Fevereiro
                        </div>
                        <div className="flex-1 text-center text-xs text-gray-500 mr-2">
                            <div className="h-20 bg-yellow-500 rounded-sm mb-1 w-full" style={{ height: '50%' }}></div> {/* 50% */}
                            Março
                        </div>
                        <div className="flex-1 text-center text-xs text-gray-500">
                            <div className="h-32 bg-yellow-500 rounded-sm mb-1 w-full" style={{ height: '80%' }}></div> {/* 80% */}
                            Abril
                        </div>
                    </div>
                </div>

                {/* Feedback Card: O que seus clientes pensam de você? */}
                <div className="bg-gradient-to-r ml-105 from-yellow-300 to-yellow-500 text-white rounded-lg w-80 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
                    {/* Elemento de background amarelo claro no lado direito */}
                    <div className="absolute top-0 right-0 h-full w-1/4 opacity-50 z-0"></div>
                    <div className="relative z-10"> {/* Conteúdo sobreposto */}
                        <h2 className="text-lg font-semibold mb-4">O que seus clientes pensam de você?</h2>
                        <div className="flex items-center mb-6">
                            <StarRating rating={3.5} />
                            <span className="ml-2 text-3xl font-bold">3.5</span>
                        </div>
                        <button className="flex items-center bg-white cursor-pointer text-yellow-600 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.5-8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path></svg>
                            <span>Saiba mais</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}