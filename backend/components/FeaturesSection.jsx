import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, CreditCard, History } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Vagas em tempo real',
      description: 'Veja todas as vagas disponíveis no mapa interativo.',
    },
    {
      icon: Clock,
      title: 'Horários de funcionamento',
      description: 'Consulte os horários de cada estacionamento.',
    },
    {
      icon: CreditCard,
      title: 'Preço e pagamento',
      description: 'Pague diretamente pelo app de forma segura e prática.',
    },
    {
      icon: History,
      title: 'Histórico de reservas',
      description: 'Acesse seu histórico de reservas e gastos organizados.',
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Funcionalidades pensadas para simplificar sua vida.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 text-center card-hover"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <feature.icon className="w-10 h-10 text-yellow-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;