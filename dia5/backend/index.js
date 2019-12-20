import express, { Router } from 'express';
import ativos from './ativos';
import carteira from './carteira';
import performance from './performance';
import cors from 'cors'; 

const app = express();

app.use(cors());
app.use(express.json());
app.use('/ativos', ativos);
app.use('/carteira', carteira);
app.use('/performance', performance);

app.listen(3000, () =>
    console.log('Servidor rodando na porta 3000'),
);

