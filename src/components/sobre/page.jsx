'use client';

import { motion } from "framer-motion";

export default function Sobre() {
    const container = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100">
                <path
                    className="fill-white dark:fill-yellow-400"
                    d="M990 45H535.5A35.2 35.2 0 0 1 500 11.6 35.2 35.2 0 0 1 464.5 45H10v10h454.5A35.2 35.2 0 0 1 500 88.4 35.2 35.2 0 0 1 535.5 55H990V45Z"
                />
            </svg>

            <section id="sobre" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 md:px-5 lg:px-5">
                    <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-16 lg:gap-36">

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={container}
                            className="flex flex-col items-center lg:items-start gap-6"
                        >
                            <motion.h2
                                variants={container}
                                className="text-gray-100 dark:text-yellow-400 text-3xl md:text-4xl font-bold font-manrope text-center lg:text-left leading-snug"
                            >
                                Estacione com Facilidade, Rapidez e Economia
                            </motion.h2>

                            <motion.p
                                variants={container}
                                className="text-white text-base md:text-lg leading-relaxed text-center lg:text-left"
                            >
                                Com nosso aplicativo, você encontra vagas de estacionamento próximas em segundos, visualiza preços e distância até o local, e reserva sua vaga antes de chegar. Tudo de forma prática, segura e totalmente digital. Pare de perder tempo procurando estacionamento e aproveite cada momento com tranquilidade.
                            </motion.p>

                            <motion.button
                                variants={container}
                                className="w-full sm:w-fit px-6 py-3 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:from-orange-500 hover:to-yellow-400 flex justify-center items-center"
                            >
                                Conheça nosso App
                            </motion.button>
                        </motion.div>

                        <motion.img
                            src="/sobre3.png"
                            alt="About Us image"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                            transition={{ duration: 0.6 }}
                            className="hidden md:block lg:mx-0 mx-auto h-full rounded-3xl object-cover cursor-pointer"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
