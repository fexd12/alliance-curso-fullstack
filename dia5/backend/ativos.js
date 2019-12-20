import {criaClient} from './banco'
import { Router } from 'express';   

const router = Router();

router.get('/', async (req, res) => {
    let resultado =[];
    
    const client = criaClient();
    await client.connect();
    
    let queryResult = await client.query('select CODIGO, DESCRICAO from ATIVOS');
    for (let row of queryResult.rows) {
        resultado.push({
            codigo: row.codigo.trim(),
            descricao: row.descricao.trim()
        });
    }
    await client.end();
    res.send(JSON.stringify(resultado));
});

router.post('/', async (req, res) => {
    const client = criaClient();
    await client.connect();
    let payload = req.body;
    let sql = `insert into ATIVOS (CODIGO, DESCRICAO) VALUES 
    ('${payload.codigo}','${payload.descricao}')`;
    
    await client.query(sql);
    
    await client.end()
    res.status(201);
    res.send("Dados inseridos");
});

router.put('/:codigo', async (req, res) => {
    let codigo = req.params.codigo;
    let payload = req.body;
    const client = criaClient();
    await client.connect();

    let sql = `update ATIVOS set
    DESCRICAO ='${payload.descricao}'    
     where
    CODIGO = '${codigo}'
    `;

    await client.query(sql);
    await client.end();
    res.status(204);
    res.send("dado alterado");
});


router.delete('/:codigo', async (req, res) => {
    let codigo = req.params.codigo;
   
    const client = criaClient();
    await client.connect();

    let sql = `delete from ATIVOS 
     where
    CODIGO = '${codigo}'
    `;

    await client.query(sql);
    await client.end();
    res.status(204);
    res.send();
});

export default router;