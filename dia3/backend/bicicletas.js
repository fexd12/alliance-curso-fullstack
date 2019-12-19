import {criaClient} from './banco'
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let resultado = [];
    
    const client = criaClient();
    await client.connect();
    let queryResult = await client.query('select CODIGO, ATIVO from BICICLETAS');
    for (let row of queryResult.rows) {
        resultado.push({
            codigo: row.codigo.trim(),
            ativo: row.ativo.trim()
        });

    }
    await client.end();
    res.send(JSON.stringify(resultado));
});

router.post('/', async (req, res) => {
    const client = criaClient();
    await client.connect();
    let payload = req.body;
    let sql = `insert into BICICLETAS (CODIGO, ATIVO) VALUES 
    ('${payload.codigo}','${payload.ativo}')`;
    
    await client.query(sql);
    res.send("Dados inseridos");
    await client.end()
    res.status(201);
    res.send();
});

router.put('/:codigo', async (req, res) => {
    let codigo = req.params.codigo;
    let payload = req.body;
    const client = criaClient();
    await client.connect();

    let sql = `update BICICLETAS set
    ATIVO ='${payload.ativo}'    
     where
    codigo = '${codigo}'
    `;

    await client.query(sql);
    await client.end();
    res.send("dado alterado");
});


router.delete('/:codigo', async (req, res) => {
    let codigo = req.params.codigo;
   
    const client = criaClient();
    await client.connect();

    let sql = `delete from BICICLETAS 
     where
    codigo = '${codigo}'
    `;

    await client.query(sql);
    await client.end();
    res.status(204);
    res.send();
});

export default router;