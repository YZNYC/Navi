import express from 'express';
import vagaRoutes from './routes/vagaRoutes.js';
// import authMiddleware from '../middlewares/authMiddleware.js';  //--> descomentar qnd criar autenticação
const port = 3000;

// import cors from 'cors';  //--> descomentar qnd for usar o frontend

const app = express();

//middlewares
// app.use(cors());
app.use(express.json());


//rotas modularizadas
app.use('/vagas', vagaRoutes);


//rotas
app.get('/', (req, res) => {
    res.send('você não deveria estar aqui...');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

