import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, ShieldCheck } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Praticidade',
      description: 'Encontre e pague sua vaga com poucos cliques.',
    },
    {
      icon: Clock,
      title: 'Economia de tempo',
      description: 'Chega de dar voltas. Vá direto para a sua vaga.',
    },
    {
      icon: ShieldCheck,
      title: 'Pagamento rápido e seguro',
      description: 'Transações seguras e sem contato com dinheiro.',
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Vantagens que fazem a diferença
            </h2>
            
            <p className="text-xl text-gray-600 mb-12">
              Estacionar nunca foi tão fácil. Veja por que nossos usuários amam o ParkEasy.
            </p>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-gray-800" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              alt="Pessoa usando o celular com um sorriso, representando a facilidade de usar o app ParkEasy"
             src="https://images.unsplash.com/photo-1625708974337-fb8fe9af5711" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;