
import 'dotenv/config';
console.log('------------------------------------');

import cors from 'cors';
import express from 'express';

import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import estacionamentoRoutes from './routes/EstacionamentoRoutes.js';
import vagaRoutes from './routes/vagaRoutes.js';
import veiculoRoutes from './routes/veiculoRoutes.js';
import reservaRoutes from './routes/ReservRoutes.js'; 
import contratoRoutes from './routes/ContratoRoutes.js'; 
import cupomRoutes from './routes/CupomRoutes.js'; 
import naviRoutes from './routes/NaviRoutes.js'
import relatoriosRoutes from './routes/relatoriosRoutes.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());


// Rotas da API 
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/estacionamentos', estacionamentoRoutes);
app.use('/vagas', vagaRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/reservas', reservaRoutes); 
app.use('/contratos', contratoRoutes); 
app.use('/cupons', cupomRoutes)
app.use('/api/navi', naviRoutes); 
app.use('/cupons', cupomRoutes);
app.use('/relatorios', relatoriosRoutes);

// Rota raiz para verificação
app.get('/', (req, res) => {
    res.send('API Navi em funcionamento!');
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});