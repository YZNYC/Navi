'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Carlos Pereira',
      role: 'Executivo',
      content: 'App essencial. Economizo pelo menos 15 minutos todos os dias no trajeto para o trabalho.',
      rating: 5,
      avatar: 'Homem de negócios sorrindo'
    },
    {
      name: 'Juliana Almeida',
      role: 'Estudante',
      content: 'Muito prático para encontrar vagas perto da faculdade. O pagamento pelo app é super fácil!',
      rating: 5,
      avatar: 'Estudante universitária feliz'
    },
    {
      name: 'Ricardo Mendes',
      role: 'Representante Comercial',
      content: 'Visito muitos clientes e o ParkEasy me salva sempre. Recomendo a todos!',
      rating: 5,
      avatar: 'Homem casual sorrindo'
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
            Amado por nossos usuários
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja o que as pessoas estão dizendo sobre o ParkEasy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 card-hover shadow-sm"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-4">
                <img
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  alt={`Foto de ${testimonial.name}`}
                 src="https://images.unsplash.com/photo-1649399045831-40bfde3ef21d" />
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;