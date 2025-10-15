'use client'

import { motion } from "framer-motion";

export default function Funcionamento() {
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    const steps = [
        {
            title: "Encontre",
            desc: "Navegue pelo mapa e veja as vagas disponíveis em tempo real perto de você."
        },
        {
            title: "Reserve",
            desc: "Garanta sua vaga com antecedência e evite o estresse de procurar um lugar."
        },
        {
            title: "Pague",
            desc: "Finalize o pagamento de forma segura e 100% digital, direto no aplicativo."
        }
    ];

    return (
        <section id="como-funciona" className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 }} variants={staggerContainer} className="text-center mb-16">
                    <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-600 dark:text-yellow-500">Simples como 1, 2, 3</motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-lg text-white">Comece a usar a Navi em segundos.</motion.p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12 text-center text-white/70 font-semibold">
                    {steps.map((step, index) => (
                        <motion.div key={step.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}>
                            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md shadow-md transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-2xl cursor-pointer">
                                <h3 className="mt-4 text-2xl font-semibold text-white">{step.title}</h3>
                                <p className="mt-2 text-white font-semibold">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path className="fill-gray-600 dark:fill-yellow-400" d="M990 45H535.5A35.2 35.2 0 0 1 500 11.6 35.2 35.2 0 0 1 464.5 45H10v10h454.5A35.2 35.2 0 0 1 500 88.4 35.2 35.2 0 0 1 535.5 55H990V45Z"></path></svg>
        </section >
    )
}
