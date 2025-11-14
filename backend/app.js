// backend/app.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
// A inicialização do WebSocket será feita mais abaixo.

// =================================================================================
// IMPORTAÇÃO PADRONIZADA DE TODAS AS ROTAS
// Garantindo caminhos e nomes corretos (camelCase)
// =================================================================================
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/UsuarioRoutes.js';
import estacionamentoRoutes from './routes/EstacionamentoRoutes.js';
import vagaRoutes from './routes/VagaRoutes.js';
import veiculoRoutes from './routes/VeiculoRoutes.js';
import reservaRoutes from './routes/ReservRoutes.js'; 
import contratoRoutes from './routes/ContratoRoutes.js';
import cupomRoutes from './routes/CupomRoutes.js';
import relatoriosRoutes from './routes/RelatoriosRoutes.js';
import chatRoutes from './routes/ChatRoutes.js';
import naviRoutes from './routes/NaviRoutes.js'; 
// import conversaNaviRoutes from './routes/conversasNaviRoutes.js';
import estabelecimentoKpiRoutes from './routes/EstabelecimentoKpiRoutes.js';
import usuarioKpiRoutes from './routes/UsuarioKpiRoutes.js';


// =================================================================================
// CONFIGURAÇÃO DO SERVIDOR E MIDDLEWARES
// =================================================================================
const port = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);

// Middlewares Globais do Express
app.use(cors());       // Permite que seu frontend acesse a API
app.use(express.json()); // Permite que a API entenda requisições com corpo em JSON


// =================================================================================
// INICIALIZAÇÃO E CONFIGURAÇÃO DO WEBSOCKET (Socket.IO)
// =================================================================================
// Aqui vamos configurar o Socket.IO e exportar a instância 'io' para ser
// usada em outros lugares (como no ChatController).
import { Server } from 'socket.io';

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3001", // Endereço do seu frontend
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`🔌 Novo cliente conectado: ${socket.id}`);

    // Ouve por um evento 'entrar-na-sala' quando o usuário abre um chat
    socket.on('entrar-na-sala', (chatId) => {
        socket.join(chatId);
        console.log(`Cliente ${socket.id} entrou na sala do chat ${chatId}`);
    });
    
    // Ouve por um evento 'enviar-mensagem' vindo de um cliente
    socket.on('enviar-mensagem', (dados) => {
        const { chatId, mensagem } = dados;
        // Re-emite a mensagem para TODOS os outros clientes que estão na mesma sala (chatId)
        socket.to(chatId).emit('receber-mensagem', mensagem);
        console.log(`Mensagem enviada na sala ${chatId}:`, mensagem.conteudo);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
});

// Tornamos a instância 'io' acessível globalmente via 'app.set'
// para que possamos usá-la nos nossos controllers.
app.set('io', io);


// =================================================================================
// REGISTRO DE TODAS AS ROTAS DA API
// =================================================================================
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
app.use('/api/navi', naviRoutes);
// app.use('/api/conversas-navi', conversaNaviRoutes);
app.use('/estabelecimentos/kpi', estabelecimentoKpiRoutes);
app.use('/usuarios/kpi', usuarioKpiRoutes);


// Rota raiz para verificar se o servidor está online
app.get('/', (req, res) => {
    res.send('API Navi em funcionamento! (HTTP + WebSocket)');
});

// =================================================================================
// INICIALIZAÇÃO DO SERVIDOR HÍBRIDO
// =================================================================================
httpServer.listen(port, () => {
    console.log(`🚀 Servidor HTTP e WebSocket rodando em http://localhost:${port}`);
});