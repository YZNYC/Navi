'use client';

import Image from 'next/image';
import { User, Calendar } from 'lucide-react';

// --- COMPONENTE DECORATIVO ---
// O semicírculo agora está maior
const HalfCircle = (props) => (
  <div className={`w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] border-[48px] rounded-full border-white/20 dark:border-[#ffffff]/50 ${props.className}`} />
);


// --- DADOS PARA OS CARDS ---
const posts = [
    {
        imageUrl: '/celular.webp',
        author: 'Time Navi',
        date: 'Outubro 31, 2025',
        title: 'Nova Integração com Pagamentos PIX',
        excerpt: 'Em breve, pague por suas reservas de forma instantânea e segura utilizando o PIX diretamente no aplicativo.'
    },
    {
        imageUrl: '/celular.webp', // Imagem de placeholder diferente
        author: 'Equipe de Design',
        date: 'Outubro 28, 2025',
        title: 'Dashboard do Proprietário Reimaginado',
        excerpt: 'Estamos redesenhando a experiência do proprietário com novos gráficos e relatórios para insights ainda mais poderosos.'
    },
    {
        imageUrl: '/celular.webp', // Imagem de placeholder diferente
        author: 'Time Navi',
        date: 'Outubro 25, 2025',
        title: 'Encontre Vagas para Veículos Elétricos',
        excerpt: 'A próxima grande atualização trará um filtro exclusivo para localizar pontos de recarga em nossa rede de estacionamentos.'
    }
];

// --- SUB-COMPONENTE DO CARD DE NOTÍCIA ---
const PostCard = ({ post }) => {
    return (
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex flex-col group border border-white/50 dark:border-slate-700/50">
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center gap-4 text-white text-sm font-medium">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{post.author}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{post.date}</span></div>
                    </div>
                </div>
            </div>
            <div className="p-6 sm:p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                    {post.title}
                </h3>
                <p className="mt-4 text-slate-700 dark:text-slate-400 leading-relaxed flex-grow">
                    {post.excerpt}
                </p>
            </div>
        </div>
    );
};


// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
const NewsSection = () => {
  return (
    // 'overflow-hidden' é REMOVIDO daqui para permitir que os elementos decorativos "vazem"
    <section className="relative py-24 sm:py-32">
        
        {/* --- FUNDOS DE TEMA --- */}
        {/* A 'section' não é o limite final, então os fundos ficam em uma div separada */}
        <div className="absolute inset-0 -z-30">
            <div className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0" style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }} />
            <div  style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }} />
        </div>

        {/* --- ELEMENTOS DECORATIVOS --- */}
        <HalfCircle className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-white/50 opacity-20 -z-10" />
        <div aria-hidden="true" className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-1/2 h-full rounded-full bg-[#f2b441] dark:bg-[#f6bb00]/20 blur-[150px] -z-10" />

        {/* Container principal do conteúdo */}
        <div className="relative z-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">
                    Futuras Melhorias e Notícias
                </h2>
                <p className="mt-4 text-lg text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">
                    Estamos sempre trabalhando para inovar. Fique por dentro do que está por vir na plataforma Navi e descubra as próximas funcionalidades que irão transformar sua experiência.
                </p>
            </div>

            <div className="mt-20 mx-auto max-w-none lg:max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </div>
        </div>
    </section>
  );
};

export default NewsSection;