// src/app/layout.js

import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../components/providers/providers'; // Importa o nosso novo componente de tema

export const metadata = {
  title: 'Navi - Encontre Sua Vaga', // Título mais amigável
  description: 'A solução inteligente para encontrar e gerenciar vagas de estacionamento.',
};

export default function RootLayout({ children }) {
  return (
    // 'suppressHydrationWarning' é recomendado pela 'next-themes' para evitar avisos no console
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        {/*
          O ThemeProvider "envelopa" tudo, inclusive o AuthProvider.
          Ele é o responsável por aplicar a classe 'dark' na tag <html>.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // Começa com o tema do sistema do usuário
          enableSystem
          disableTransitionOnChange
        >
          {/* O AuthProvider continua gerenciando o estado de autenticação como antes */}
          <AuthProvider>
            {children}
          </AuthProvider>
          
        </ThemeProvider>
      </body>
    </html>
  );
}