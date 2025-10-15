'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDownloadClick = () => {
    toast({
      title: "🚧 Download em breve!",
      description: "O app estará disponível na Google Play Store em breve. Fique ligado!",
    });
  };

  const handleMenuClick = (item) => {
    toast({
      title: "🚧 Navegação",
      description: `Seção ${item} em desenvolvimento. Solicite mais funcionalidades!`,
    });
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-700 shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <Smartphone className="w-6 h-6 text-gray-800" />
            </div>
            <span className="text-2xl font-bold text-white">ParkEasy</span>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Sobre', 'Funcionalidades', 'Contato'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05, color: '#FCD34D' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMenuClick(item)}
                className="text-gray-300 font-medium transition-colors duration-200"
              >
                {item}
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Button
              onClick={handleDownloadClick}
              className="bg-yellow-400 text-gray-800 font-semibold px-6 py-2 rounded-full shadow-yellow hover:bg-yellow-500 transition-all duration-300"
            >
              Baixe o App
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-gray-600 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-600 py-4"
          >
            <nav className="flex flex-col space-y-4">
              {['Sobre', 'Funcionalidades', 'Contato'].map((item) => (
                <motion.button
                  key={item}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMenuClick(item)}
                  className="text-left text-gray-300 hover:text-yellow-400 font-medium py-2 transition-colors"
                >
                  {item}
                </motion.button>
              ))}
              <Button
                onClick={handleDownloadClick}
                className="bg-yellow-400 text-gray-800 font-semibold py-3 rounded-full shadow-yellow mt-4 hover:bg-yellow-500"
              >
                Baixe o App
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;