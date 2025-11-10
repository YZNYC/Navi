/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
    return [
      {
        // Padrão que captura todas as requisições para /api/navi e sub-rotas
        source: '/api/navi/:path*',
        
        // Redireciona para o seu servidor Express na porta 3000, 
        // mantendo o caminho (/:path*) após /api/navi/
        destination: 'http://localhost:3000/api/navi/:path*',
      },
    ];
  },
};

export default nextConfig;
