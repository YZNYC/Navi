import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { toast } from './ui/use-toast';

const Footer = () => {
  const handleLinkClick = (section) => {
    toast({
      title: "🚧 Em desenvolvimento",
      description: `A seção ${section} será implementada em breve!`,
    });
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2 mb-6 md:mb-0"
          >
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-gray-800" />
            </div>
            <span className="text-xl font-bold text-white">ParkEasy</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex space-x-6 mb-6 md:mb-0"
          >
            {['Sobre', 'Contato', 'Privacidade'].map((item) => (
              <button
                key={item}
                onClick={() => handleLinkClick(item)}
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex space-x-4"
          >
            {['Facebook', 'Instagram', 'Twitter'].map((social) => (
              <button
                key={social}
                onClick={() => handleLinkClick(social)}
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-500 group transition-colors duration-300"
              >
                <span className="text-sm text-gray-300 group-hover:text-gray-800">{social[0]}</span>
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm"
        >
          <p>© {new Date().getFullYear()} ParkEasy. Todos os direitos reservados.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;