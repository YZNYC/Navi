'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../lib/api'; 
import { useState, useEffect } from 'react';
import Image from 'next/image';



const resetSchema = z.object({
  novaSenha: z.string().min(3, "A nova senha precisa ter no mínimo 3 caracteres."),
  confirmarSenha: z.string(),
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"], 
});


// Forms e Lógica da Página
export default function ResetPasswordPage() {

    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
     
        setTimeout(() => {
            setIsMounted(true);
        }, 100);
    }, []);
    
    const searchParams = useSearchParams();
    const router = useRouter(); 
    const token = searchParams.get('token'); 

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm({
        resolver: zodResolver(resetSchema),
        mode: 'onBlur',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiSuccess, setApiSuccess] = useState('');
    
    const backgroundSource = "/dark.png"; 

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        clearErrors("apiError");
        setApiSuccess('');

        if (!token) {
            setError("apiError", { type: "manual", message: "Token de redefinição ausente ou inválido." });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post(`/auth/reset-password/${token}`, {
                novaSenha: data.novaSenha,
            });

            setApiSuccess(response.data.message);
            setTimeout(() => {
                router.push('/');
            }, 3000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Não foi possível redefinir a senha.';
            setError("apiError", { type: "manual", message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#F7F4F0] p-4 font-sans overflow-hidden">
            <DynamicBackground src={backgroundSource} />

            <div 
        
              className={`relative w-full max-w-lg transition-opacity duration-700 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0'}`} 
            >
                <div 
                  className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 flex flex-col" 
                  style={{ height: '555px' }}
                >
                    <div 
                    
                        className={`transition-all duration-700 ease-in-out delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        <div className="text-center mb-8">
                            <Image src="/light.png" alt="Logo" width={56} height={56} className="mx-auto" />
                            <h1 className="mt-4 text-2xl font-bold text-gray-800 tracking-tight">Crie sua Nova Senha</h1>
                            <p className="mt-1 text-sm text-gray-500">Escolha uma senha forte e segura.</p>
                        </div>
                    </div>

                    <form 
                        onSubmit={handleSubmit(onSubmit)} 
                        noValidate 
                     
                        className={`space-y-4 transition-all duration-700 ease-in-out delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        <SoftInput id="novaSenha" type='password' label="Nova Senha" register={register('novaSenha')} error={errors.novaSenha} hasIcon={true} />
                        <SoftInput id="confirmarSenha" type='password' label="Confirme a Nova Senha" register={register('confirmarSenha')} error={errors.confirmarSenha} hasIcon={true} />

                        {apiSuccess && <p className='text-green-600 font-semibold text-sm text-center pt-2'>{apiSuccess}</p>}
                        {errors.apiError && <p className='text-red-500 text-sm text-center pt-2'>{errors.apiError.message}</p>}
                        
                        <div className="pt-4">
                            <button type="submit" disabled={isSubmitting || !!apiSuccess} className="main-button">
                                {isSubmitting ? 'Salvando...' : 'Redefinir Senha'}
                            </button>
                        </div>
                    </form>

                    <div 
             
                        className={`mt-auto pt-8 text-center text-sm text-gray-500 transition-opacity duration-700 delay-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Lembrou da senha?
                        <a href="/" className="font-semibold text-yellow-600 underline-grow ml-1">Fazer login</a>
                    </div>
                </div>
            </div>

            <GlobalStyles />
        </main>
    );
}


// -----------------------------------------------------------------------------
// COMPONENTES DE UI REUTILIZÁVEIS
// -----------------------------------------------------------------------------

function SoftInput({ id, label, type = 'text', register, error, hasIcon = false }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);
    const finalType = hasIcon ? (isPasswordVisible ? 'text' : 'password') : type;
    return (
        <div className="relative pb-4"> 
          <div className={`soft-input-wrapper ${error ? 'error' : ''}`}>
            <input id={id} type={finalType} placeholder=" " {...register} className="soft-input" />
            <label htmlFor={id} className="soft-label">{label}</label>
            <div className="accent-bar"></div>
            {hasIcon && <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-yellow-600">{isPasswordVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}</button>}
          </div>
          {error && <span className="error-message">{error.message}</span>}
        </div>
      );
}

function DynamicBackground({ src }) {
    const isVideo = /\.(mp4|webm)$/i.test(src);
    return isVideo 
        ? <video className="absolute inset-0 w-full h-full object-cover -z-10" autoPlay loop muted><source src={src} type={`video/${src.split('.').pop()}`} /></video> 
        : <Image src={src} alt="background" fill className="absolute inset-0 object-cover -z-10 opacity-40" />;
}


// -----------------------------------------------------------------------------
// ESTILOS GLOBAIS E ÍCONES
// -----------------------------------------------------------------------------

function GlobalStyles() {
    return (
        <style jsx global>{`
            :root {
                --c-yellow: #FFD600; 
                --c-yellow-dark: #f9a825; 
                --c-text-on-yellow: #4E431B;
                --c-input-bg: #FCFBF8; 
                --c-input-border: #F3EAE0; 
                --c-input-text: #6e5847;
                --c-label-text: #b8aaa0; 
                --c-error: #ef4444;
            }
            .main-button { width: 100%; padding: 14px; font-weight: 600; color: var(--c-text-on-yellow); background: var(--c-yellow); border-radius: 14px; transition: all 0.3s; }
            .main-button:disabled { background-color: #f9a82580; cursor: not-allowed; }
            .soft-input-wrapper { position: relative; overflow: hidden; border-radius: 14px; }
            .soft-input { width: 100%; font-size: 1rem; color: var(--c-input-text); background: var(--c-input-bg); border: 1px solid var(--c-input-border); border-radius: 14px; padding: 26px 18px 10px 18px; outline: none; transition: all 0.2s ease-out; position: relative; z-index: 1; }
            .soft-input[type="password"]::-ms-reveal { display: none; }
            .soft-label { position: absolute; top: 18px; left: 19px; color: var(--c-label-text); pointer-events: none; transition: all 0.2s ease-out; z-index: 2; }
            .soft-input:focus + .soft-label, .soft-input:not(:placeholder-shown) + .soft-label { top: 8px; font-size: 0.75rem; color: var(--c-text-on-yellow); font-weight: 500; }
            .accent-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--c-yellow-dark); transform: scaleX(0); transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: left; z-index: 3; }
            .soft-input-wrapper:focus-within .accent-bar { transform: scaleX(1); }
            .soft-input-wrapper.error .soft-input { border-color: var(--c-error); animation: shake 0.5s ease-out; }
            .error-message { position: absolute; bottom: -5px; left: 2px; color: var(--c-error); font-size: 0.8rem; }
            @keyframes shake { 10%,90%{transform:translateX(-1px)}20%,80%{transform:translateX(2px)}30%,50%,70%{transform:translateX(-2px)}40%,60%{transform:translateX(2px)} }
        `}</style>
    );
}

function EyeIcon(props) { return (<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>); }
function EyeSlashIcon(props) { return (<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>); }