'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES E DADOS DO CARROSEL
// -----------------------------------------------------------------------------

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const screenshots = [
  { id: 1, src: "/celular.webp", alt: "Tela inicial do aplicativo Navi" },
  { id: 2, src: "/celular.webp", alt: "Tela de mapa com vagas em tempo real" },
  { id: 3, src: "/celular.webp", alt: "Tela de confirmação de reserva" },
];

const positions = {
  left: { x: '-75%', scale: 0.85, zIndex: 1, opacity: 0.5 },
  center: { x: '0%', scale: 1, zIndex: 2, opacity: 1 },
  right: { x: '75%', scale: 0.85, zIndex: 1, opacity: 0.5 },
  hidden: { scale: 0.5, zIndex: 0, opacity: 0 },
};

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------

const AppShowcaseSection = () => {
  const [order, setOrder] = useState([1, 2, 3]);

  const nextSlide = () => {
    setOrder(prevOrder => [prevOrder[1], prevOrder[2], prevOrder[0]]);
  };
  
  const prevSlide = () => {
    setOrder(prevOrder => [prevOrder[2], prevOrder[0], prevOrder[1]]);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      
      <div className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0" style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }} />
      <div style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }} />
      
      <div className="w-[380px] h-[380px] border-[48px] rounded-full absolute top-1/4 -left-[190px] opacity-20 dark:opacity-20 border-white/50 dark:border-slate-700/60 -z-10" />
    
      <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">
          Screenshots do App
        </h2>
        <p className="mt-6 mx-auto max-w-3xl text-xl text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">
          Veja como é fácil encontrar, reservar e pagar por sua vaga de estacionamento com o Navi.
        </p>
      </div>


      <div className="mt-20 relative flex flex-col items-center">
          <div className="h-[700px] w-full relative flex items-center justify-center">
          
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                {screenshots.map((item) => {
                    const itemIndex = order.indexOf(item.id);
                    let positionState = itemIndex === 0 ? 'left' : itemIndex === 1 ? 'center' : itemIndex === 2 ? 'right' : 'hidden';

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute w-[350px] h-[700px] rounded-[3rem] overflow-hidden"
                            initial="center"
                            animate={positionState}
                            variants={positions}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover"
                                priority={positionState === 'center'}
                            />
                        </motion.div>
                    );
                })}
            </div>

            <div className="absolute w-[350px] h-[700px] pointer-events-none z-10">
              <Image
                src="/mobile-frame.webp"
                alt="Moldura de celular"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-4">
            <button onClick={prevSlide} className="w-14 h-14 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-sm border border-white/30 dark:border-slate-700 flex items-center justify-center text-white hover:bg-white/40 dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="w-14 h-14 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-sm border border-white/30 dark:border-slate-700 flex items-center justify-center text-white hover:bg-white/40 dark:hover:bg-slate-700 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
      </div>
    </section>
  );
};

export default AppShowcaseSection;