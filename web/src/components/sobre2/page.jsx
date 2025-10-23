'use client';

import { motion } from "framer-motion";

const ArrowRight = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

export default function Sobre2() {
    const container = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <>
            <section id="sobre" className="py-16 relative dark:bg-cyan-900 bg-orange-700/50 z-0 shadow-2xl shadow-yellow-950/70">
                <div className="max-w-7xl mx-auto px-4 md:px-5 lg:px-5">
                    <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-16 lg:gap-36">

                        <div className="flex justify-center">
                        <motion.img
                                src="/Parking3.png"
                                alt="Demonstração animada da interface do aplicativo de estacionamento"
                                loading="lazy"
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                whileHover={{ scale: 1.03, rotate: 1 }}
                                transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
                                className="block dark:hidden lg:mx-0 mx-auto w-full max-w-lg h-full rounded-[2.5rem] object-cover cursor-pointer transform-gpu"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/FFCC00/000000?text=App+Demo+GIF" }}
                            />
                            <motion.img
                                src="/Parking5.png"
                                alt="Demonstração animada da interface do aplicativo de estacionamento"
                                loading="lazy"
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                whileHover={{ scale: 1.03, rotate: 1 }}
                                transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
                                className="hidden dark:block lg:mx-0 mx-auto w-full max-w-lg h-full rounded-[2.5rem] object-cover cursor-pointer transform-gpu"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/FFCC00/000000?text=App+Demo+GIF" }}
                            />
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={container}
                            className="flex flex-col items-center text-center lg:items-start gap-6"
                        >
                            <motion.p
                                variants={container}
                                className=" text-white text-sm font-semibold tracking-widest"
                            >
                                TECNOLOGIA PARA UM TRÂNSITO MAIS INTELIGENTE
                            </motion.p>

                            <motion.h2
                                variants={container}
                                className=" text-white text-4xl md:text-5xl font-black font-manrope text-center lg:text-left leading-tight"
                            >
                                Encontre e Estacione com Facilidade Total
                            </motion.h2>

                            <motion.p
                                variants={container}
                                className=" text-white text-base pb-10 px-3 md:px-0 md:pb-0 md:text-lg leading-relaxed text-center lg:text-left"
                            >
                                Nosso aplicativo conecta motoristas aos melhores estacionamentos da cidade em tempo real. Localize vagas disponíveis, compare valores, reserve com um toque e dirija com tranquilidade. Mais praticidade, menos estresse e tempo ganho no seu dia.
                            </motion.p>

                            <motion.button
                                variants={container}
                                className="w-80 sm:w-fit lg:px-10 py-4 bg-yellow-500 dark:bg-yellow-600 text-white dark:text-black font-extrabold text-lg rounded-full shadow-2xl shadow-yellow-500/50 transition-all duration-300 hover:scale-[1.05] hover:from-orange-500 hover:to-yellow-400 flex justify-center items-center gap-2 cursor-pointer"
                            >
                                Baixe Agora
                                <ArrowRight className="h-6 w-6" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 100"
                className="w-screen h-[120px] -mt-16 z-10 block relative left-1/2 -translate-x-1/2"
            >
                <path
                    className="fill-white dark:fill-yellow-600"
                    d="M990 45H535.5A35.2 35.2 0 0 1 500 11.6 35.2 35.2 0 0 1 464.5 45H10v10h454.5A35.2 35.2 0 0 1 500 88.4 35.2 35.2 0 0 1 535.5 55H990V45Z"
                ></path>
            </svg>
        </>
    );
}
