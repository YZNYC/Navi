import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Autoplay from "embla-carousel-autoplay"
import { 
  Bell, 
  Menu, 
  MapPin, 
  Search, 
  Navigation, 
  DollarSign, 
  Shield, 
  Star,
  Clock,
  Car,
  Leaf,
  Zap,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const NaviHome = () => {
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "Esta feature não está implementada ainda—mas não se preocupe! Você pode solicitar na próxima mensagem! 🚀",
      duration: 3000,
    });
  };

  const parkingData = [
    {
      id: 1,
      name: "Estacionamento Central",
      price: "8,00",
      distance: "150m",
      availableSpots: 12,
      rating: 4.8,
      features: ["Coberto", "24h", "Segurança"],
      image: "Modern covered parking garage in city center"
    },
    {
      id: 2,
      name: "Shopping Plaza",
      price: "6,50",
      distance: "300m",
      availableSpots: 8,
      rating: 4.6,
      features: ["Coberto", "Segurança"],
      image: "Shopping mall parking garage with modern lighting"
    },
    {
      id: 3,
      name: "Rua das Flores",
      price: "5,00",
      distance: "220m",
      availableSpots: 15,
      rating: 4.2,
      features: ["24h"],
      image: "Street parking area with trees and flowers"
    },
    {
      id: 4,
      name: "Centro Empresarial",
      price: "12,00",
      distance: "400m",
      availableSpots: 6,
      rating: 4.9,
      features: ["Coberto", "24h", "Segurança"],
      image: "Premium business center parking with security"
    }
  ];

  const quickFilters = [
    { icon: Navigation, label: "Próximo" },
    { icon: DollarSign, label: "Barato" },
    { icon: Shield, label: "Coberto" },
    { icon: Leaf, label: "Sustentável" },
    { icon: Clock, label: "24h" },
    { icon: Sparkles, label: "Novo" }
  ];

  const carouselItems = [
    {
      title: "Novo estacionamento!",
      subtitle: "Conheça o mais novo parceiro perto de você.",
      icon: Sparkles
    },
    {
      title: "Reserva Antecipada",
      subtitle: "Garanta sua vaga — reserve com até 2h de antecedência.",
      icon: Clock
    },
    {
      title: "Pagamento Rápido",
      subtitle: "Pague com um clique e evite filas no caixa.",
      icon: Zap
    }
  ];

  return (
    <div className="bg-gray-50 max-w-md mx-auto pb-24">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm px-4 py-4 sticky top-0 z-20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleFeatureClick('menu')}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Olá, João Silva</h1>
              <p className="text-sm text-gray-500">Encontre sua vaga ideal</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleFeatureClick('notifications')}
            className="text-gray-600 hover:text-gray-900 relative"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
        </div>
      </motion.header>

      <main>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative h-64"
        >
          <img class="w-full h-full object-cover" alt="Map showing nearby parking spots with pins" src="https://images.unsplash.com/photo-1518487346609-25352f3e0c8c" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent"></div>
        </motion.div>

        <div className="px-4 -mt-16 z-10 relative">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar estacionamentos..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-lg"
              />
            </div>

            <Button 
              onClick={() => handleFeatureClick('location')}
              className="w-full gradient-yellow text-white font-bold py-4 rounded-xl shadow-yellow hover:shadow-lg transition-all duration-300 text-base"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Usar minha localização
            </Button>
          </motion.div>
        </div>
        
        <div className="mt-6">
            <Carousel className="w-full" opts={{ align: "start", dragFree: true }}>
              <CarouselContent className="-ml-2 pl-4">
                {quickFilters.map((filter, index) => (
                  <CarouselItem key={index} className="basis-auto pl-2">
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                      onClick={() => handleFeatureClick(`filter-${filter.label}`)}
                      className="bg-white border border-gray-200 rounded-xl py-3 px-4 flex items-center space-x-2 hover:border-yellow-400 hover:shadow-sm transition-all duration-300"
                    >
                      <filter.icon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{filter.label}</span>
                    </motion.button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6"
        >
          <Carousel 
            className="w-full" 
            opts={{ loop: true }}
            plugins={[ Autoplay({ delay: 3000, stopOnInteraction: false }) ]}
          >
            <CarouselContent className="-ml-2">
              {carouselItems.map((item, index) => (
                <CarouselItem key={index} className="pl-4">
                  <div className="p-1">
                    <div className="gradient-yellow rounded-2xl p-6 text-white shadow-yellow flex items-center">
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-shadow mb-1">{item.title}</h2>
                        <p className="text-yellow-100 text-sm leading-relaxed">{item.subtitle}</p>
                      </div>
                      <item.icon className="h-10 w-10 text-yellow-200 ml-4" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 px-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recomendações</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {parkingData.length} encontrados
            </span>
          </div>

          <div className="space-y-4">
            {parkingData.map((parking, index) => (
              <motion.div
                key={parking.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="relative">
                  <img class="w-full h-32 object-cover" alt={parking.image} src="https://images.unsplash.com/photo-1586137409491-bed36541a323" />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{parking.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg truncate mb-2">{parking.name}</h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{parking.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="h-4 w-4" />
                      <span>{parking.availableSpots} vagas</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-4">
                    {parking.features.map((feature) => (
                      <span 
                        key={feature}
                        className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-baseline">
                      <span className="text-xl font-bold text-green-600">R${parking.price}</span>
                      <span className="text-sm text-gray-500">/h</span>
                    </div>
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleFeatureClick(`reserve-${parking.id}`)}}
                      className="gradient-yellow text-white font-semibold py-2 px-5 rounded-lg shadow-yellow hover:shadow-lg transition-all duration-300"
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NaviHome;