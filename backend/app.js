// backend/app.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// 1. IMPORTAÇÕES NECESSÁRIAS PARA O SERVIDOR HÍBRIDO
import { createServer } from 'http'; // Do próprio Node.js
import { Server } from 'socket.io';   // A classe do servidor de Socket.IO
import { configureChatSocket } from './sockets/chatHandler.js'; // Nosso handler de chat que acabamos de criar

// 2. IMPORTAÇÕES DE TODAS AS NOSSAS ROTAS HTTP
import authRoutes from './routes/AuthRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import estacionamentoRoutes from './routes/EstacionamentoRoutes.js';
import vagaRoutes from './routes/vagaRoutes.js';
import veiculoRoutes from './routes/veiculoRoutes.js';
import reservaRoutes from './routes/ReservRoutes.js';
import contratoRoutes from './routes/ContratoRoutes.js';
import cupomRoutes from './routes/CupomRoutes.js';
import relatoriosRoutes from './routes/relatoriosRoutes.js';
import chatRoutes from './routes/ChatRoutes.js'; // Nossas novas rotas HTTP do chat

// 3. INICIALIZAÇÃO DO SERVIDOR HÍBRIDO
const app = express();
const httpServer = createServer(app); // Cria um servidor HTTP "pai" que encapsula o Express
const io = new Server(httpServer, {
    // Configuração do CORS para o Socket.IO, permitindo que nosso frontend se conecte
    cors: {
        origin: "http://localhost:3001", // Endereço do seu frontend
        methods: ["GET", "POST"]
    }
});

// 4. "PLUGA" TODA A LÓGICA DO CHAT NO NOSSO SERVIDOR SOCKET.IO
configureChatSocket(io);

// Configuração dos Middlewares do Express
const port = process.env.PORT || 3000;
app.use(cors()); // CORS para as rotas HTTP
app.use(express.json());

// 5. REGISTRO DE TODAS AS ROTAS HTTP
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/estacionamentos', estacionamentoRoutes);
app.use('/vagas', vagaRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/reservas', reservaRoutes);
app.use('/contratos', contratoRoutes);
app.use('/cupons', cupomRoutes);
app.use('/relatorios', relatoriosRoutes);
app.use('/chat', chatRoutes);

// Rota raiz de verificação
app.get('/', (req, res) => {
    res.send('API Navi em funcionamento! (HTTP + WebSockets)');
});

// 6. INICIALIZAÇÃO DO SERVIDOR PAI
// Note que agora usamos 'httpServer.listen' em vez de 'app.listen'
httpServer.listen(port, () => {
    console.log(`Servidor híbrido rodando e ouvindo na porta ${port}`);
});