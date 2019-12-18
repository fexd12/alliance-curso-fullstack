import express from 'express';
import usuarios from './usuarios';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/usuarios', usuarios);

app.listen(3000, () =>
    console.log('Servidor rodando na porta 3000'),
);

