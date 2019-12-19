import { Router } from 'express';
import {criaClient} from './banco'

const router = Router();

router.get('/:codigo/', async (req, res) => {

    const CODIGO_USER = req.params.codigo;
    let resultado = [];
    
    const client = criaClient();
    await client.connect();
    let texto = `select ID,CODIGO_USUARIO,CODIGO_BICICLETA,DATA_INICIO,DATA_FIM,PRECO from public.VIAGENS 
    where 
    CODIGO_USUARIO = ${CODIGO_USER} `;
    let queryResult = await client.query(texto);
    for (let row of queryResult.rows) {
        resultado.push({
            id: row.id,
            codigo_usuario: row.codigo_usuario,
            codigo_bicicleta: row.codigo_bicicleta.trim(),
            data_inicio: row.data_inicio,
            data_fim: row.data_fim,
            preco: row.preco
            
        });
    console.log(queryResult.rows);
    }
    await client.end();
    res.send(JSON.stringify(resultado));
});

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