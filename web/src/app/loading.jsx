'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  // Este componente será exibido automaticamente pelo Next.js
  // enquanto o conteúdo da página principal estiver carregando.
  
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F4F0]">
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/3423eff2-d78f-4eea-9833-94823707f9b3/bireVIoAQ6.lottie"
          loop
          autoplay
        />
      </div>
      <p className="text-gray-500 text-lg mt-4 animate-pulse">
        Carregando...
      </p>
    </main>
  );
}