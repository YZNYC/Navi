// src/components/ShowcaseSection.jsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { Check } from 'lucide-react';

// Círculo lateral customizado
const HalfCircle = (props) => (
  // Borda aumentada para 48px
  <div className={`w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] border-[48px] rounded-full border-white/40 dark:border-white/20 ${props.className}`} />
);

// Componente principal da seção
const ShowcaseSection = () => {
  return (
    <section className="relative overflow-hidden">
      
      {/* Camadas de Fundo (Claro e Escuro) */}
      <div className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0" style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }}></div>
      <div  style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }}></div>
      
      {/* Círculos Laterais */}
      <HalfCircle className="absolute top-1/4 -left-[190px] opacity-60 dark:opacity-40 -z-10" />
      <HalfCircle className="absolute bottom-1/4 -right-[190px] opacity-60 dark:opacity-40 -z-10" />

      {/* --- PRIMEIRA ÁREA: Imagem à Esquerda --- */}
      <div className="max-w-7xl mx-auto py-24 px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        
        {/* Coluna da Imagem (Decorações removidas) */}
        <div className="relative flex justify-center z-10">
          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-white/30 to-white/5 dark:from-slate-800/50 dark:to-slate-900/10 backdrop-blur-xl rounded-[4rem] shadow-2xl transform rotate-6"
          />
          <motion.div
            animate={{ rotate: [0, -3, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-white/20 to-white/5 dark:from-purple-600/30 dark:to-indigo-600/10 backdrop-blur-md rounded-[4rem] shadow-xl transform -rotate-3"
          />
          
          <div className="relative">
            <Image 
              src="/celular.webp" alt="Mockup do aplicativo Navi para motoristas"
              width={350} height={700}
              className="rounded-[2.5rem] shadow-2xl" 
            />
          </div>
        </div>

        {/* Coluna do Texto (Tamanhos de fonte aumentados) */}
        <div className="z-10">
          <p className="font-semibold text-orange-900 dark:text-indigo-400">PARA O MOTORISTA</p>
          <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-slate-800 dark:text-white">Seu Estacionamento, na Palma da Mão</h2>
          <p className="mt-6 text-xl text-gray-800 dark:text-slate-300">
            Chega de frustração no trânsito. Com o Navi, você tem acesso instantâneo às melhores vagas, planeja sua chegada e paga tudo pelo celular, com a segurança e a simplicidade que você merece.
          </p>
          <ul className="mt-10 space-y-6">
            <li className="group flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5">
              <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 text-orange-800 dark:text-indigo-300 font-bold text-lg transition-transform group-hover:scale-110">01</span>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">Encontre e Reserve em Tempo Real</h4>
                <p className="text-gray-700 dark:text-slate-400">Nosso mapa inteligente mostra as vagas livres agora. Reserve com um toque e dirija sem preocupações.</p>
              </div>
            </li>
            <li className="group flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5">
              <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 text-orange-800 dark:text-indigo-300 font-bold text-lg transition-transform group-hover:scale-110">02</span>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">Pagamento Digital e Seguro</h4>
                <p className="text-gray-700 dark:text-slate-400">Pague com Pix ou cartão de crédito. Rápido, seguro e sem a necessidade de tickets de papel.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* --- SEGUNDA ÁREA: Imagem à Direita --- */}
      <div className="max-w-7xl mx-auto py-24 px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        
        {/* Coluna do Texto (Botão mais chamativo) */}
        <div className="z-10 md:order-1">
          <p className="font-semibold text-orange-900 dark:text-indigo-400">PARA O PROPRIETÁRIO</p>
          <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-slate-800 dark:text-white">
            Otimize e Lucre Mais com Seu Negócio
          </h2>
          <p className="mt-6 text-xl text-gray-800 dark:text-slate-300">
            Nossa plataforma transforma seu estacionamento em um negócio digital. Tenha controle total, atraia mais clientes e veja sua receita crescer com tecnologia de ponta.
          </p>
          
          <Button 
            size="lg"
            className="mt-10 bg-[#FFD600] text-orange-950 font-bold hover:bg-amber-400
                       dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400
                       shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg px-8 py-7"
          >
            Conheça o Painel
          </Button>
        </div>

        {/* Coluna da Imagem (Decorações removidas) */}
        <div className="relative flex justify-center z-10 md:order-2">
            <motion.div
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-white/30 to-white/5 dark:from-slate-800/50 dark:to-slate-900/10 backdrop-blur-xl rounded-[4rem] shadow-2xl transform -rotate-6"
            />
            <motion.div
              animate={{ rotate: [0, 3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-white/20 to-white/5 dark:from-indigo-600/30 dark:to-purple-600/10 backdrop-blur-md rounded-[4rem] shadow-xl transform rotate-3"
            />
          
            <div className="relative">
              <Image 
                src="/celular.webp" 
                alt="Mockup do painel de proprietários Navi" 
                width={350} 
                height={700}
                className="rounded-[2.5rem] shadow-2xl" 
              />
            </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;