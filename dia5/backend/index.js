import express, { Router } from 'express';
import ativos from './ativos';
import carteira from './carteira';
import performance from './performance';
import operacoes from './operacoes';
import cors from 'cors'; 

const app = express();

app.use(cors());
app.use(express.json());
app.use('/ativos', ativos);
app.use('/carteira', carteira);
app.use('/performance', performance);
app.use('/operacoes', operacoes);

app.route('/:codigo')
    .get(function (req,res){
        res.redirect('/operacoes/'+ req.params.codigo);
       // app.use('/viagens/'+ req.params.codigo,viagens)
    })

app.listen(3000, () =>
    console.log('Servidor rodando na porta 3000'),
);