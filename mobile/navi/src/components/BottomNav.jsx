import React, { useState } from 'react';
import { Home, Search, Ticket, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const navItems = [
  { icon: Home, label: 'Início' },
  { icon: Search, label: 'Buscar' },
  { icon: Ticket, label: 'Reservas' },
  { icon: User, label: 'Perfil' },
];

const BottomNav = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { toast } = useToast();

  const handleNavClick = (index, label) => {
    setActiveIndex(index);
    if (label !== 'Início') {
      toast({
        title: `🚧 Navegação para ${label}`,
        description: "Esta tela não está implementada ainda—mas não se preocupe! Você pode solicitar na próxima mensagem! 🚀",
        duration: 3000,
      });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] max-w-md mx-auto z-50 rounded-t-2xl">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item, index) => (
          <div
            key={item.label}
            className="relative flex flex-col items-center justify-center w-1/4 cursor-pointer"
            onClick={() => handleNavClick(index, item.label)}
          >
            {activeIndex === index && (
              <motion.div
                layoutId="active-nav-indicator"
                className="absolute -top-4 w-16 h-16 bg-yellow-400 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <item.icon
                className={`h-6 w-6 transition-colors duration-300 ${activeIndex === index ? 'text-white' : 'text-gray-400'}`}
              />
              <span
                className={`text-xs mt-1 font-medium transition-all duration-300 ${activeIndex === index ? 'opacity-0' : 'opacity-100'}`}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;   