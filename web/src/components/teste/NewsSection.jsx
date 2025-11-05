'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES, UI E ARRAY DE FUTURO
// -----------------------------------------------------------------------------

import Image from 'next/image';
import { User, Calendar } from 'lucide-react';


const HalfCircle = (props) => (
  <div className={`w-[150px] h-[300px] border-t-[35px] border-r-[35px] border-b-[35px] rounded-r-full ${props.className}`} />
);

const posts = [
    { imageUrl: '/pix.png', author: 'Time Navi', date: 'Planejamento', title: 'Pagamentos via PIX', excerpt: 'Estamos planejando a realização de um update no app para que pagamentos via PIX sejam reconhecidos.' },
    { imageUrl: '/qualidade.jpg', author: 'Equipe Navi', date: 'Planejamento', title: 'Melhorias de Vida', excerpt: 'Sabemos da importância de um App bem atualizado, nós planejamos diversas mudanças para facilitar o uso do App.' },
    { imageUrl: '/googleplay.png', author: 'Time Navi', date: 'Planejamento', title: 'Lançamento na App Store', excerpt: 'Um lançamento importante para a empresa e seus usuários, com isso o app chegará em novos patamares.' }
  
];

// -----------------------------------------------------------------------------
// CARDS DE FUNCIONALIDADES FUTURAS
// -----------------------------------------------------------------------------

const PostCard = ({ post }) => {
    return (
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex flex-col group border border-white/50 dark:border-slate-700/50">
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center gap-4 text-white text-sm font-medium">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{post.author}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{post.date}</span></div>
                    </div>
                </div>
            </div>
            <div className="p-6 sm:p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-orange-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">{post.title}</h3>
                <p className="mt-4 text-orange-950/80 dark:text-slate-400 leading-relaxed flex-grow">{post.excerpt}</p>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------

const NewsSection = () => {
  return (
   
    <section className="relative py-24 sm:py-32 overflow-hidden">
        
    
        <div className="absolute inset-0 -z-30">
            <div className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0" style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }} />
            <div style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }} />
        </div>

        <HalfCircle className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-white/50 opacity-20 -z-10" />
        <div aria-hidden="true" className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-1/3 h-2/3 rounded-full bg-orange-400/10 dark:bg-[#f6bb00]/5 blur-[150px] -z-10" />

        <div className="relative z-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <p className="font-semibold uppercase tracking-wider text-orange-950 dark:text-[#efb000]">
                  Para o Futuro
                </p>
                <h2 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">
                    Próximas Melhorias
                </h2>
                <p className="mt-4 text-lg text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">
                    O Navi está em constante evolução. Aqui estão algumas das novidades que estamos preparando para transformar ainda mais sua experiência.
                </p>
            </div>

            <div className="mt-20 mx-auto max-w-screen-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </div>
        </div>
    </section>
  );
};

export default NewsSection;