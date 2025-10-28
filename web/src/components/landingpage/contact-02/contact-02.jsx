'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, User, MessageSquare, ArrowRight } from 'lucide-react';

const contactInfo = [
    { icon: Phone, text: "+55 (11) 98765-4321", label: "Ligue para nós" },
    { icon: Mail, text: "suporte@estacionamento.com.br", label: "Fale por e-mail" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { 
            type: "spring", 
            damping: 15, 
            stiffness: 90 
        } 
    }
};

export default function NovoFormularioContato() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messageStatus, setMessageStatus] = useState(null); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessageStatus(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            console.log("Formulário enviado:", formData);
            setMessageStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Erro ao enviar:", error);
            setMessageStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight"
                    >
                        Vamos Iniciar uma <span className='dark:text-yellow-600'>Conversa!</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-600 dark:text-white max-w-4xl mx-auto mt-4"
                    >
                        Tire suas dúvidas ou envie sugestões. Estamos prontos para te ajudar com agilidade e atenção.
                    </motion.p>
                </motion.div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                    
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={itemVariants}
                        className="mb-12 lg:mb-0 p-8 lg:p-12 bg-white dark:bg-gray-800/70 rounded-3xl shadow-lg flex flex-col justify-center"
                    >
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                            Nossos Canais
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
                            Use um de nossos contatos diretos para um atendimento ainda mais rápido.
                        </p>

                        <div className="space-y-8">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-center space-x-4 group p-3 rounded-xl transition duration-300 hover:bg-yellow-50 dark:hover:bg-gray-700"
                                >
                                    <div className="p-4 bg-yellow-100 dark:bg-yellow-600 rounded-full flex-shrink-0 shadow-md">
                                        <item.icon className="w-6 h-6 text-yellow-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] lg:text-xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 transition duration-300  md:pl-0">
                                            {item.text}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-[13px] lg:text-sm">
                                            {item.label}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={itemVariants}
                        className="p-8 lg:p-12 bg-white dark:bg-gray-800/70 rounded-3xl shadow-xl"
                    >
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                            Formulário Rápido
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {messageStatus === 'success' && (
                                <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium shadow-sm dark:bg-green-800 dark:text-white">
                                    Mensagem enviada com sucesso! Em breve entraremos em contato.
                                </div>
                            )}
                            {messageStatus === 'error' && (
                                <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center font-medium shadow-sm dark:bg-red-800 dark:text-white">
                                    Erro ao enviar. Por favor, tente novamente.
                                </div>
                            )}

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seu Nome</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-inner focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-200"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seu Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-inner focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-200"
                                        placeholder="seu.email@exemplo.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensagem</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-inner focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-200 resize-none"
                                        placeholder="Digite sua mensagem aqui..."
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-bold rounded-xl shadow-md text-gray-900 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        Enviar Mensagem
                                        <Send className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
