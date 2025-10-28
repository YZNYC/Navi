'use client'

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    CreditCard,
    CheckCircle2,
    Users,
    TrendingUp,
} from "lucide-react";

export default function Funcionamento() {
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


    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const steps = [
        {
            number: "1",
            title: "Cadastre-se Grátis",
            description: "Crie sua conta em menos de 1 minuto",
            icon: Users
        },
        {
            number: "2",
            title: "Busque Vagas",
            description: "Visualize disponibilidade no mapa",
            icon: MapPin
        },
        {
            number: "3",
            title: "Reserve & Pague",
            description: "Confirme e pague com segurança",
            icon: CreditCard
        },
        {
            number: "4",
            title: "Estacione Feliz",
            description: "Chegue e use o QR Code",
            icon: CheckCircle2
        }
    ];
    return (
        <>
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 md:mb-14 py-14">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="text-center mb-20"
                >
                    <motion.div variants={itemVariants}>
                        <Badge className="bg-gray-100 text-gray-700 mb-6 px-5 py-2.5 text-sm font-semibold">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Processo Simples
                        </Badge>
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                    >
                        Como Funciona?
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-white max-w-3xl mx-auto leading-relaxed"
                    >
                        Apenas 4 passos simples para você nunca mais perder tempo procurando vaga
                    </motion.p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200 dark:from-gray-400 dark:to-gray-600 dark:bg-gradient-to-r" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, type: "spring" }}
                            whileHover={{ y: -10 }}
                            className="relative"
                        >
                            <div className="text-center">
                                <div className="relative inline-flex items-center justify-center mb-8">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: index * 0.5
                                        }}
                                        className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 dark:from-gray-700 dark:to-gray-800 dark:bg-gradient-to-br rounded-3xl blur-2xl opacity-50"
                                    />
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 dark:from-gray-400 dark:to-gray-600 dark:bg-gradient-to-br rounded-3xl flex items-center justify-center shadow-2xl">
                                        <step.icon className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-100">
                                        <span className="text-lg font-bold text-orange-600 dark:text-gray-600">{step.number}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-white leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    )
}
