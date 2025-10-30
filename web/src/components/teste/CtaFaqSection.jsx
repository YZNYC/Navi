'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DADOS DO FAQ ---
const faqData = [
    { question: "Como funciona o Navi?", answer: "O Navi conecta você a uma rede de estacionamentos. Pelo mapa, você vê as vagas livres, reserva a sua, paga pelo app e estaciona sem complicações. Proprietários gerenciam tudo em um painel online." },
    { question: "Quais métodos de pagamento são aceitos?", answer: "Atualmente, aceitamos pagamentos via Pix e os principais cartões de crédito e débito, tudo processado com segurança através do nosso parceiro de pagamentos." },
    { question: "Posso cancelar uma reserva?", answer: "Sim! Você pode cancelar sua reserva diretamente pelo aplicativo. Dependendo da política do estacionamento, o cancelamento pode ser gratuito até um certo tempo antes do horário reservado." },
];

// --- SUB-COMPONENTE DO FAQ ITEM ---
const FaqItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-800 py-6 last:border-b-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left gap-4">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">{item.question}</h3>
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0"><Plus className="w-6 h-6 text-slate-500 dark:text-slate-400" /></motion.div>
            </button>
            <AnimatePresence>
                {isOpen && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden"><p className="pt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p></motion.div> )}
            </AnimatePresence>
        </div>
    );
};

// --- COMPONENTE DO ANEL DECORATIVO ---
const DecorativeRing = ({ className }) => ( <div aria-hidden="true" className={`absolute w-64 h-64 border-[35px] rounded-full z-10 ${className}`} /> );


// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
const FaqSection = () => {
  return (
    // 1. O "CONTÊINER PAI" TRANSPARENTE
    // Ele tem 'relative' para posicionar os anéis e 'py' para criar o espaço vazio.
    <div className="relative py-24 sm:py-32">
        
        {/* 2. ANÉIS DECORATIVOS
            Posicionados em relação ao contêiner pai, para que fiquem nas bordas da seção colorida abaixo. */}
        <DecorativeRing className="
            top-0 right-0 
            -translate-y-[calc(50%-theme(spacing.24))] sm:-translate-y-[calc(50%-theme(spacing.32))] 
            translate-x-1/2 
            border-white/50 dark:border-slate-700/60 opacity-20 dark:opacity-20"
        />
        <DecorativeRing className="
            bottom-0 left-0 
            translate-y-[calc(50%-theme(spacing.24))] sm:translate-y-[calc(50%-theme(spacing.32))] 
            -translate-x-1/2 
           border-white/50 dark:border-slate-700/60  opacity-20 dark:opacity-20"
        />

        {/* 3. A "FAIXA" COLORIDA DO FAQ
            Esta seção tem a cor de fundo e o 'overflow-hidden' para conter seus próprios brilhos internos. */}
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
  );
};

export default FaqSection;