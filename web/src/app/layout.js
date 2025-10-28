// src/app/layout.js
import './globals.css'; // Caminho correto
import { AuthProvider } from '../contexts/AuthContext'; // Caminho relativo

export const metadata = {
  title: 'Navi Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children} {/* Ele só renderiza o que a página mandar */}
        </AuthProvider>
      </body>
    </html>
  );
}