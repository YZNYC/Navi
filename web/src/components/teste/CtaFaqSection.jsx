'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES, FAQ E UI
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const faqData = [
    { question: "Como funciona o Navi?", answer: "O Navi conecta você a uma rede de estacionamentos. Pelo mapa, você vê as vagas livres, reserva a sua, paga pelo app e estaciona sem complicações. Proprietários gerenciam tudo em um painel online." },
    { question: "Funciona em Qualquer celular?", answer: "Sim! Por ser feito em React Native, ele automaticamente tem portabilidade para todos os sistemas operacionais, porém não testamos em iPhones ainda." },
    { question: "Prentendemos Seguir com ele?", answer: "Essa resposta é difícil, pois após o curso cada um irá continuar sua vida, mas se for da vontade de todos, por que não?" },
];


const FaqItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 dark:border-slate-800 py-6 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left gap-4"
            >
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                    {item.question}
                </h3>

                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                >
                    <Plus
                        className="w-6 h-6"
                        style={{
                            color: isOpen ? '#EFB000' : 'rgb(100,116,139)' 
                        }}
                    />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const DecorativeRing = ({ className }) => (<div aria-hidden="true" className={`absolute w-48 h-48 border-[35px] rounded-full z-10 ${className}`} />);

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------

const FaqSection = () => {
    return (

        <div className="overflow-x-hidden">

            <div className="relative py-24 sm:py-32">

                <DecorativeRing className="
              top-0 right-0 
              -translate-y-[calc(50%-theme(spacing.24))] sm:-translate-y-[calc(50%-theme(spacing.32))] 
              translate-x-1/2 
              border-white/50 dark:border-slate-700/60 opacity-20"
                />
                <DecorativeRing className="
              bottom-0 left-0 
              translate-y-[calc(50%-theme(spacing.24))] sm:translate-y-[calc(50%-theme(spacing.32))] 
              -translate-x-1/2 
             border-white/50 dark:border-slate-700/60 opacity-20"
                />

                <section className="relative bg-white/20 dark:bg-slate-900 overflow-hidden py-24 sm:py-32">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-0">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white dark:text-white">
                            Perguntas Frequentes
                        </h2>
                        <p className="mt-4 text-lg text-slate-50 dark:text-slate-400">
                            Ainda tem dúvidas? Aqui estão as respostas para as perguntas mais comuns sobre o Navi.
                        </p>
                    </div>

                    <div className="mt-16 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-0">
                        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
                            {faqData.map((item, index) => (
                                <FaqItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
export default FaqSection;