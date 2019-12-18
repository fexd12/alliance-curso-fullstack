import express from 'express';
import usuarios from './usuarios';
import bicicletas from './bicicletas';
import viagens from './viagens';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/usuarios', usuarios);
app.use('/bicicletas',bicicletas);
app.use('/usuarios/codigo/viagens',viagens);

app.listen(3000, () =>
    console.log('Servidor rodando na porta 3000'),
);

