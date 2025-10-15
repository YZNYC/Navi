import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CTASection = () => {
  const handleDownloadClick = () => {
    toast({
      title: `🚧 Download para Android`,
      description: "O app estará disponível em breve! Solicite mais funcionalidades!",
    });
  };

  return (
    <section className="py-20 md:py-28 bg-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Comece a economizar tempo hoje mesmo!
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Baixe o ParkEasy e transforme a maneira como você estaciona.
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
      </div>
    </section>
  );
};

export default CTASection;