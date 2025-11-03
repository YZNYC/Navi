'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Image from 'next/image';

// --- DADOS DAS LOGOS DE TECNOLOGIA (use imagens da sua pasta /public/logos) ---
const logos = [
    { name: 'Next.js', src: '/logos/nextjs.svg' },
    { name: 'Node.js', src: '/logos/nodejs.svg' },
    { name: 'Prisma', src: '/logos/prisma.svg' },
    { name: 'Tailwind CSS', src: '/logos/tailwind.svg' },
    { name: 'AWS', src: '/logos/aws.svg' },
    { name: 'MySQL', src: '/logos/mysql.svg' },
];

// --- COMPONENTE DECORATIVO ---
const HalfCircle = (props) => (
  <div className={`w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] border-[48px] rounded-full border-white/50 dark:border-[#ffffff]/50 ${props.className}`} />
);

// --- ESQUEMA DE VALIDAÇÃO ZOD ---
const contactSchema = z.object({
  name: z.string().min(2, "Seu nome é obrigatório."),
  email: z.string().email("Por favor, insira um email válido."),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Sua mensagem precisa ter no mínimo 10 caracteres."),
});


const ContactSection = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(contactSchema) });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiState, setApiState] = useState({ success: false, error: false });
    
    // INSTRUÇÃO: Substitua 'YOUR_CODE' pelo seu código do Formspree.
    const FORMPSREE_ENDPOINT = "https://formspree.io/f/xgvpnbqyc";

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setApiState({ success: false, error: false });
        try {
            const response = await fetch(FORMPSREE_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setApiState({ success: true, error: false });
                reset();
            } else {
                throw new Error("Falha ao enviar o formulário.");
            }
        } catch (error) {
            setApiState({ success: false, error: true });
            console.error("Erro no formulário:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
  
  return (
    <>
      {/* 1. Faixa das Logos de Tecnologia */}
      <div className="py-16 sm:py-20 bg-white/50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-8 items-center">
                  {logos.map((logo, index) => (
                      <div key={index} className="flex justify-center">
                          <Image
                              src={logo.src}
                              alt={logo.name}
                              width={120}
                              height={40}
                              className="object-contain text-slate-400 dark:text-slate-500 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300"
                          />
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 2. Seção do Formulário de Contato */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Fundos de Tema (gradientes) */}
        <div className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0" style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }} />
        <div  style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }} />

        {/* Elementos Decorativos de Fundo */}
        <div aria-hidden="true" className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-2/4 h-2/4 rounded-full bg-[#ff8f00] dark:bg-[#d08700]/10 blur-[150px] -z-10" />
        <HalfCircle className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 -rotate-90 opacity-10 dark:opacity-5 border-slate-300 dark:border-slate-700 -z-10" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">
                Fale Conosco
            </h2>
            <p className="mt-4 text-lg text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">
                Tem uma pergunta, feedback ou uma proposta de parceria? Adoraríamos ouvir de você. Preencha o formulário abaixo e nossa equipe entrará em contato.
            </p>
        </div>

        <div className="mt-16 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="relative">
                {/* A Sombra Amarela Sólida */}
                <div aria-hidden="true" className="absolute top-2 left-2 w-full h-full bg-[#efb000] rounded-2xl" />
                {/* O Formulário Branco (sem borda) */}
                <div className="relative bg-white p-8 sm:p-12 rounded-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <input type="text" {...register('name')} placeholder="Seu nome" className={`w-full p-4 rounded-md bg-slate-100 border-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#efb000] focus:border-transparent ${errors.name ? 'border-red-500' : 'border-slate-200'}`} />
                           <input type="text" {...register('company')} placeholder="Empresa (opcional)" className="w-full p-4 rounded-md bg-slate-100 border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#efb000] focus:border-transparent" />
                           <input type="email" {...register('email')} placeholder="Seu email" className={`w-full p-4 rounded-md bg-slate-100 border-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#efb000] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-slate-200'}`} />
                           <input type="tel" {...register('phone')} placeholder="Telefone (opcional)" className="w-full p-4 rounded-md bg-slate-100 border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#efb000] focus:border-transparent" />
                       </div>
                       <div>
                           <textarea {...register('message')} placeholder="Sua mensagem..." rows="5" className={`w-full p-4 rounded-md bg-slate-100 border-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#efb000] focus:border-transparent ${errors.message ? 'border-red-500' : 'border-slate-200'}`}></textarea>
                       </div>
                        <div className="mt-2">
                           <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 rounded-lg font-semibold text-lg text-gray-900 bg-[#efb000] hover:bg-[#f6bb00] transition-colors disabled:opacity-50">
                               {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                           </button>
                           {apiState.success && <p className="mt-4 text-green-600 font-semibold">Mensagem enviada com sucesso!</p>}
                           {apiState.error && <p className="mt-4 text-red-500 font-semibold">Erro ao enviar mensagem.</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;