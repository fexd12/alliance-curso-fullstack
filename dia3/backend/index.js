import express, { Router } from 'express';
import usuarios from './usuarios';
import bicicletas from './bicicletas';
import viagens from './viagens';
import viagens2 from './viagens2';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/usuarios', usuarios);
app.use('/bicicletas', bicicletas);
app.use('/viagens/', viagens);
app.use('/viagens2/',viagens2);

app.route('/usuarios/:codigo')
    .get(function (req,res){
        res.redirect('/viagens/'+ req.params.codigo);
       // app.use('/viagens/'+ req.params.codigo,viagens)
    })
    .post(function(req,res){
        res.redirect('/viagens/'+ req.params.codigo);
       // app.use('/viagens/'+ req.params.codigo,viagens);

    })




app.listen(3000, () =>
    console.log('Servidor rodando na porta 3000'),
);

