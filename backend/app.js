import 'dotenv/config'; 

console.log('--- Verificando variáveis de ambiente ---');
console.log('DATABASE_URL lida:', process.env.DATABASE_URL ? 'SIM' : 'NÃO');
console.log('------------------------------------');


import express from 'express';
import authRoutes from './routes/AuthRoutes.js';
import vagaRoutes from './routes/vagaRoutes.js';
import estacionamentoRoutes from './routes/estacionamentoRoutes.js';
import usuarioRoutes from './routes/UsuarioRoutes.js'; 
import veiculoRoutes from './routes/veiculoRoutes.js';

const port = 3000;
const app = express();
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes); 
app.use('/vagas', vagaRoutes);
app.use('/estacionamentos', estacionamentoRoutes);
app.use('/veiculos', veiculoRoutes);


app.get('/', (req, res) => {
    res.send('você não deveria estar aqui...');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

