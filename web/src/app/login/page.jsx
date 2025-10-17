'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import Image from 'next/image';

const loginSchema = z.object({
    email: z.string().nonempty("O email é obrigatório.").email("Insira um email válido"),
    senha: z.string().nonempty("A senha é obrigatória"),
});

const cadastroSchema = z.object({
    nome: z.string().min(2, "Nome muito curto"),
    sobrenome: z.string().min(2, "Sobrenome muito curto"),
    telefone: z.string().optional(),
    email: z.string().nonempty("O email é obrigatório.").email("Insira um email válido"),
    senha: z.string().min(8, "A senha precisa de no mínimo 8 caracteres"),
});


export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleView = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setIsLoginView(prev => !prev);
            setIsAnimating(false);
        }, 400); // Duração da animação da "cortina"
    };

    return (
        <>
            <main className="min-h-screen flex items-center justify-center bg-[#fbfaf8] p-4 font-sans">
                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    <div className={`absolute inset-0 bg-yellow-400 z-20 transition-transform duration-500 ease-in-out ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}></div>
                    <div className={`absolute inset-0 bg-yellow-500 z-20 transition-transform duration-500 ease-in-out delay-100 ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}></div>

                    <div className="relative z-10 p-10">
                        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                            {isLoginView
                                ? <AuthForm key="login" isLoginView={true} toggleView={toggleView} />
                                : <AuthForm key="cadastro" isLoginView={false} toggleView={toggleView} />
                            }
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        /* ... CSS FIEL AO EXEMPLO COM SEU TEMA AMARELO ... */
        :root {
          --c-yellow: #FFD600; --c-yellow-dark: #f9a825; --c-text-on-yellow: #4E431B;
          --c-input-bg: #FCFBF8; --c-input-border: #F3EAE0; --c-input-text: #6e5847;
          --c-label-text: #b8aaa0; --c-error: #ef4444;
        }
        
        .soft-input-wrapper { position: relative; }
        .soft-input { width: 100%; font-size: 1rem; color: var(--c-input-text); background: var(--c-input-bg); border: 1px solid var(--c-input-border); border-radius: 14px; padding: 22px 16px 8px 16px; outline: none; transition: all 0.2s ease-out; position: relative; z-index: 1; }
        .soft-label { position: absolute; top: 16px; left: 17px; color: var(--c-label-text); pointer-events: none; transition: all 0.2s ease-out; z-index: 2; }
        .soft-input:focus + .soft-label, .soft-input:not(:placeholder-shown) + .soft-label { top: 7px; font-size: 0.75rem; color: var(--c-text-on-yellow); font-weight: 500; }
        .accent-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--c-yellow-dark); transform: scaleX(0); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); border-radius: 0 0 14px 14px; }
        .soft-input-wrapper:focus-within .accent-bar { transform: scaleX(1); }
        .soft-input-wrapper.error .soft-input { border-color: var(--c-error); animation: shake 0.5s ease-out; }
        .soft-input-wrapper.error .soft-label { color: var(--c-error); }
        .error-message { color: var(--c-error); font-size: 0.8rem; padding: 4px 0 0 2px; }

        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-2px); } 40%, 60% { transform: translateX(2px); } }
      `}</style>
        </>
    );
}

// --- Componente de Formulário Separado ---
function AuthForm({ isLoginView, toggleView }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm({
        resolver: zodResolver(isLoginView ? loginSchema : cadastroSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        const url = isLoginView ? 'http://localhost:3000/auth/login' : 'http://localhost:3000/usuarios/cadastro';
        let apiData = { ...data };
        if (!isLoginView) {
            apiData.nome = `${data.nome} ${data.sobrenome}`.trim();
            delete apiData.sobrenome;
        }

        try {
            const response = await axios.post(url, apiData);
            alert(isLoginView ? `Login bem-sucedido! Token: ${response.data.token}` : "Cadastro realizado! Faça seu login.");
            if (!isLoginView) toggleView();
        } catch (error) {
            const msg = axios.isAxiosError(error) && error.response ? error.response.data.message : 'Erro ao conectar.';
            setError(isLoginView ? 'senha' : 'nome', { type: 'api', message: msg });
        }
    };

    return (
        <>
            <div className="text-center mb-8">
                <Image src="/dark.png" alt="Logo" width={56} height={56} className="mx-auto" />
                <h1 className="mt-4 text-2xl font-bold text-gray-800">{isLoginView ? 'Bem-vindo de Volta' : 'Criar Conta'}</h1>
                <p className="mt-1 text-sm text-gray-500">{isLoginView ? 'Acesse seu espaço tranquilo' : 'Junte-se a nós hoje'}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {!isLoginView && (
                    <div className="flex gap-4">
                        <div className="w-1/2"><SoftInput id="nome" label="Nome" register={register('nome')} error={errors.nome} /></div>
                        <div className="w-1/2"><SoftInput id="sobrenome" label="Sobrenome" register={register('sobrenome')} error={errors.sobrenome} /></div>
                    </div>
                )}
                {errors.nome && <span className="error-message">{errors.nome.message}</span>}


                <SoftInput id="email" type="email" label="Endereço de Email" register={register('email')} error={errors.email} />
                <SoftInput id="senha" type="password" label="Senha" register={register('senha')} error={errors.senha} hasIcon={true} />

                {isLoginView && (
                    <div className="flex items-center justify-between text-sm">
                        {/* Lógica de Checkbox aqui */}
                    </div>
                )}

                <button type="submit" disabled={isSubmitting} className="w-full font-semibold p-3.5 rounded-xl bg-yellow-400 text-yellow-900 transition-all duration-300 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 disabled:opacity-70">
                    {isLoginView ? 'Entrar' : 'Cadastrar'}
                </button>
            </form>

            {/* Divisor Social e Botões */}
            <div className="my-6 flex items-center gap-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium">ou</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">{/* Google */}</button>
                <button className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">{/* Facebook */}</button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
                {isLoginView ? 'Não tem uma conta?' : 'Já é um membro?'}{' '}
                <button onClick={toggleView} className="font-semibold text-yellow-600 hover:underline">{isLoginView ? 'Cadastre-se' : 'Faça login'}</button>
            </p>
        </>
    );
}


// --- Componente de Input Reutilizado e Fiel ao Exemplo ---
function SoftInput({ id, label, type, register, error }) {
    return (
        <div className={`soft-input-wrapper ${error ? 'error' : ''}`}>
            <input id={id} type={type} placeholder=" " {...register} className="soft-input" />
            <label htmlFor={id} className="soft-label">{label}</label>
            <div className="accent-bar"></div>
            {error && <span className="error-message">{error.message}</span>}
        </div>
    );
}