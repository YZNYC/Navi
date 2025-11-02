'use client';

import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTE DECORATIVO QUE USAMOS ---
// MODIFICADO
const HalfCircle = (props) => (
  <div className={`w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] border-[48px] rounded-full border-white/20 dark:border-[#ffffff]/50 ${props.className}`} />
);


const VideoShowcaseSection = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);  
      }
    }
  };

return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* --- FUNDOS DE TEMA (corrigido para o modo escuro funcionar) --- */}
      <div className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0" style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }} />
      <div className="" style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }} />
      
      {/* --- ELEMENTOS DECORATIVOS --- */}

      {/* 1. SEU CÍRCULO DE SOMBRA ORIGINAL NA ESQUERDA (INTOCADO) */}
      <div aria-hidden="true" className="absolute top-3/5 left-0 -translate-y-1/2 w-1/2 h-3/5 rounded-full bg-orange-400/20 dark:bg-[#f6bb00]/10 blur-[120px] -z-10" />

      {/* 2. MEIO CÍRCULO ADICIONADO NO CENTRO DA DIREITA */}
      <HalfCircle className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 -rotate-90 opacity-10 dark:opacity-5 border-white/50 dark:border-white/50 -z-10" />

      {/* --- CABEÇALHO DA SEÇÃO --- */}
      <div className="text-center z-10">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">
          Veja o Navi em Ação
        </h2>
        <p className="mt-6 mx-auto max-w-3xl text-xl text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">
          Descubra como nossa tecnologia simplifica a vida de motoristas e otimiza a operação de estacionamentos.
        </p>
      </div>

      {/* --- CONTAINER DO VÍDEO --- */}
      <div 
        className="relative mt-16 w-full max-w-screen-2xl"
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() => { if(isPlaying) setShowButton(false) }}
      >
        <div className="relative p-2 rounded-3xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-2xl">
            
            <div aria-hidden="true" className="absolute top-0 left-0 w-12 h-12 bg-white/10 dark:bg-slate-900/50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-md" />
            <div aria-hidden="true" className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 dark:bg-slate-900/50 rounded-full translate-x-1/2 translate-y-1/2 blur-md" />

            <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    src="/carro1.mp4"
                >
                    Seu navegador não suporta a tag de vídeo.
                </video>
                
                <AnimatePresence>
                  {showButton && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button 
                        onClick={handlePlayPause}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/30 
                                   transform transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95"
                      >
                          <AnimatePresence mode="wait">
                              {isPlaying ? (
                                  <motion.div key="pause" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                    <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-white" />
                                  </motion.div>
                              ) : (
                                  <motion.div key="play" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;