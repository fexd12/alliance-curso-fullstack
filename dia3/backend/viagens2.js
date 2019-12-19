import { Router } from 'express';
import {criaClient} from './banco'

const router = Router();

router.post('/:codigo/', async (req, res) => {
    
    const client = criaClient();
    await client.connect();
    const CODIGO_USer = req.params.codigo;
    let payload = req.body;
    var date = new Date();
    let sql = `insert into VIAGENS (ID, CODIGO_USUARIO, CODIGO_BICICLETA, DATA_INICIO, DATA_FIM,PRECO) VALUES 
    (nextval('viagens_sequence'),'${CODIGO_USer}','${payload.CODIGO_BICICLETA}','${date}','null', ${payload.saldoCreditos})`;
    
    await client.query(sql);
    res.send("Dados inseridos");
    await client.end();
    
});

export default router;