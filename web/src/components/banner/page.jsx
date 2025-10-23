'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Clock,
  CreditCard,
  Zap,
  Star,
  ArrowRight,
  Download,
  Users,
} from "lucide-react";


const stats = [
  { icon: Star, value: "4.8", label: "Avaliações" },
  { icon: Star, value: "120", label: "Estacionamentos" },
  { icon: Star, value: "3000", label: "Usuários" },
  { icon: Star, value: "500", label: "Reservas" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

const Hero3 = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <>
    <section className="relative flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0"
      >
      </motion.div>

      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.5" />
        </svg>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto h-[800px] px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-white"
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 mb-6 px-5 py-2.5 text-sm font-semibold">
                <Zap className="w-4 h-4 mr-2" />
                Novo na Cidade
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]"
            >
              Estacione com
              <br />
              <span className="bg-white text-transparent bg-clip-text">
                Inteligência
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl mb-10 text-white/95 leading-relaxed max-w-xl"
            >
              Encontre, reserve e pague por vagas de estacionamento em segundos.
              Simples, rápido e seguro.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white text-yellow-500 hover:bg-gray-100 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-white shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg px-8 py-7 font-semibold w-full sm:w-auto cursor-pointer"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Grátis
                </Button>
              </motion.div>

            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-white/20 backdrop-blur-md rounded-2xl">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[650px] perspective-1000">
              <motion.div
                animate={{
                  rotate: [0, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-[4rem] shadow-2xl transform rotate-6"
              />
              <motion.div
                animate={{
                  rotate: [0, -3, 0],
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-[4rem] shadow-2xl transform -rotate-3"
              />

              <div className="relative bg-slate-100 rounded-[3.5rem] shadow-2xl p-4 w-[340px] h-[650px] mx-auto border-8 border-gray-900">
                <div className="flex items-center justify-between px-6 py-3 mb-4">
                  <div className="text-xs font-semibold text-gray-900">07:59</div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-3 border border-gray-900 rounded-sm" />
                    <div className="w-4 h-3 border border-gray-900 rounded-sm" />
                    <div className="w-4 h-3 bg-gray-900 rounded-sm" />
                  </div>
                </div>

                <div className="px-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Bem-vindo de volta!</div>
                      <div className="text-2xl font-bold text-gray-900">Olá, Jorge 👋</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      J
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar estacionamento..."
                      className="bg-transparent text-sm flex-1 outline-none text-gray-900 placeholder-gray-500"
                      disabled
                    />
                  </div>
                </div>

                <div className="px-6 space-y-3 overflow-hidden">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="bg-gradient-to-br from-yellow-500 to-yellow-500 rounded-3xl p-5 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-white font-semibold mb-1">Shopping Iguatemi</div>
                        <div className="text-white/90 text-xs">Av. Brigadeiro Faria Lima</div>
                      </div>
                      <Badge className="bg-white/20 text-white border-none text-xs">
                        Aberto
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white/80 text-xs mb-1">Vagas disponíveis</div>
                        <div className="text-2xl font-bold text-white">24</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/80 text-xs mb-1">A partir de</div>
                        <div className="text-2xl font-bold text-white">R$ 12</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-white text-yellow-600 hover:bg-gray-50 font-semibold">
                      Reservar Agora
                    </Button>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className="bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-gray-900 font-semibold mb-1">Estac. Paulista</div>
                        <div className="text-gray-500 text-xs">Av. Paulista, 1578</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-none text-xs">
                        Popular
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Vagas disponíveis</div>
                        <div className="text-2xl font-bold text-gray-900">15</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-xs mb-1">A partir de</div>
                        <div className="text-2xl font-bold text-gray-900">R$ 15</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-gray-100 text-gray-900 hover:bg-gray-200 font-semibold">
                      Ver Detalhes
                    </Button>
                  </motion.div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-gray-900 rounded-3xl px-6 py-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-1">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-[10px] text-white font-medium">Buscar</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-1">
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">Histórico</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-1">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">Carteira</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-1">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">Perfil</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>

    </>
  );
};

export default Hero3;
