'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// --- Esquemas de Validação (Schemas) ---
const loginSchema = z.object({
    email: z.string().email("Por favor, insira um email válido."),
    senha: z.string().min(1, "A senha é obrigatória."),
});
const cadastroSchema = z.object({
    nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("Por favor, insira um email válido."),
    senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
});

// --- Componente Principal ---
export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const currentSchema = isLoginView ? loginSchema : cadastroSchema;

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(currentSchema),
        defaultValues: { nome: '', email: '', senha: '' },
    });

    const toggleView = () => {
        reset(); setApiError(''); setApiSuccess('');
        setIsLoginView(!isLoginView);
    };

    const onSubmit = async (data) => {
        setApiError(''); setApiSuccess('');
        const url = isLoginView ? 'http://localhost:3000/auth/login' : 'http://localhost:3000/usuarios/cadastro';
        try {
            await axios.post(url, data);
            setApiSuccess(isLoginView ? "Login bem-sucedido! Redirecionando..." : "Cadastro realizado! Por favor, faça seu login.");
            if (!isLoginView) setTimeout(toggleView, 2000);
        } catch (error) {
            setApiError(axios.isAxiosError(error) && error.response ? error.response.data.message : 'Não foi possível conectar ao servidor.');
        }
    };

    return (
        <>
            {/* --- FUNDO ANIMADO --- */}
            <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="absolute w-[300px] h-[250px] bg-yellow-500/20 rounded-full blur-3xl animate-blob top-[-10%] left-[-5%] animation-delay-2000"></div>
                <div className="absolute w-[200px] h-[180px] bg-yellow-400/20 rounded-full blur-3xl animate-blob top-[60%] right-[-5%] animation-delay-4000"></div>
                <div className="absolute w-[180px] h-[160px] bg-amber-500/10 rounded-full blur-3xl animate-blob top-[20%] right-[20%]"></div>
            </div>

            <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-sm px-8 py-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-[0_8px_16px_rgba(255,214,0,0.3)] animate-breathe flex items-center justify-center">
                                <Image src="/dark.png" alt="Navi Logo" width={48} height={48} />
                                <div className="absolute inset-0 bg-radial-gradient-yellow rounded-full animate-glow-pulse"></div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {isLoginView ? 'Bem-vindo' : 'Crie sua conta'}
                        </h1>
                        <p className="text-sm text-gray-400 mt-2">
                            {isLoginView ? 'Acesse seu painel' : 'Rápido e fácil'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>

                        {!isLoginView && (
                            <div className="relative">
                                <input {...register('nome')} placeholder=" " id="nome" type="text" className="input-field peer" />
                                <label htmlFor="nome" className="input-label">Nome Completo</label>
                                {errors.nome && <p className="error-text">{errors.nome.message}</p>}
                            </div>
                        )}

                        <div className="relative">
                            <input {...register('email')} placeholder=" " id="email" type="email" className="input-field peer" />
                            <label htmlFor="email" className="input-label">Endereço de Email</label>
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>

                        <div className="relative">
                            <input {...register('senha')} placeholder=" " id="password" type={isPasswordVisible ? 'text' : 'password'} className="input-field peer" />
                            <label htmlFor="password" className="input-label">Senha</label>
                            <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-3.5 text-gray-400 hover:text-yellow-400 transition">
                                {/* Ícone de olho */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    {isPasswordVisible ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
                                </svg>
                            </button>
                            {errors.senha && <p className="error-text">{errors.senha.message}</p>}
                        </div>

                        {(apiError || apiSuccess) && <p className={`text-center text-sm ${apiError ? 'text-red-400' : 'text-green-400'}`}>{apiError || apiSuccess}</p>}

                        <button type="submit" disabled={isSubmitting} className="w-full py-3 font-bold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? (isLoginView ? 'Entrando...' : 'Criando...') : (isLoginView ? 'Entrar' : 'Criar Conta')}
                        </button>
                    </form>

                    <p className="text-sm text-center text-gray-400">
                        {isLoginView ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
                        <button onClick={toggleView} className="font-medium text-yellow-400 hover:text-yellow-500 hover:underline">
                            {isLoginView ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </main>

            {/* --- CSS E ANIMAÇÕES GLOBAIS VIA JSX --- */}
            <style jsx global>{`
        .animate-blob {
          animation: blob 10s infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 { animation-delay: -2s; }
        .animation-delay-4000 { animation-delay: -4s; }

        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 16px rgba(255,214,0,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 12px 20px rgba(255,214,0,0.4); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .input-field {
          width: 100%;
          background: transparent;
          border: 1px solid #4B5563; /* Borda cinza */
          border-radius: 8px;
          padding: 14px;
          color: white;
          outline: none;
          transition: border-color 0.3s;
        }
        .input-field:focus {
          border-color: #FFD600; /* Amarelo */
        }
        
        .input-label {
          position: absolute;
          top: 14px;
          left: 14px;
          color: #9CA3AF; /* Cinza claro */
          pointer-events: none;
          transition: all 0.2s ease-out;
        }

        /* Efeito de Label Flutuante */
        .peer:focus + .input-label,
        .peer:not(:placeholder-shown) + .input-label {
          top: -10px;
          left: 10px;
          font-size: 0.75rem;
          padding: 0 4px;
          color: #FFD600; /* Amarelo */
          background-color: #1a1a1a; /* Cor do fundo do Card */
        }
        
        .error-text {
            color: #ef4444;
            font-size: 0.75rem;
            margin-top: 4px;
        }
        .bg-radial-gradient-yellow {
          background-image: radial-gradient(circle, rgba(255,214,0,0.3) 0%, transparent 70%);
        }
      `}</style>
        </>
    );
}