import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const handleDownloadClick = () => {
    toast({
      title: `🚧 Download para Android`,
      description: "O app estará disponível em breve! Solicite mais funcionalidades!",
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-100 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6"
          >
            Encontre vagas e pague pelo <span className="text-yellow-500">app</span>
          </h1>

          <p
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Rápido, prático e seguro.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button
              onClick={handleDownloadClick}
              size="lg"
              className="bg-yellow-400 text-gray-800 font-bold px-10 py-7 rounded-full shadow-yellow hover:bg-yellow-500 transition-all duration-300 text-lg"
            >
              <Play className="w-6 h-6 mr-3" />
              Baixar no Android
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mt-16 max-w-3xl mx-auto"
        >
          <div className="relative z-10">
            <img
              className="w-full mx-auto drop-shadow-2xl"
              alt="Celular Android mostrando o aplicativo ParkEasy com vagas disponíveis"
             src="https://images.unsplash.com/photo-1528033978085-52f315289665" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-2xl -z-10" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-300 rounded-full opacity-20 blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;