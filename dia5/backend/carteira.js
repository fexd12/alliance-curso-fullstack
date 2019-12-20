import { Router } from 'express';
import { criaClient } from './banco';

const router = Router();

router.get('/', async (req, res) => {
    let resultado = [];

    const client = criaClient();
    await client.connect();
    let queryResult = await client.query('select CODIGO_ATIVO, QUANTIDADE, PRECO_MEDIO from CARTEIRA');
    for (let row of queryResult.rows) {
        resultado.push({
            codigo_ativo: row.codigo_ativo.trim(),
            quantidade: row.quantidade,
            preco_medio: row.preco_medio
        });
    }
    await client.end();
    res.send(JSON.stringify(resultado));
});

router.get(':codigo/operacoes');

router.post('/', async (req, res) => {
    const client = criaClient();
    await client.connect();
    let payload = req.body;
 
    let queryResult = await client.query('select CODIGO_ATIVO from CARTEIRA where CODIGO_ATIVO = 1');

    if (queryResult.rows >= 1) {
        let sql = `insert into CARTEIRA (CODIGO_ATIVO, QUANTIDADE, PRECO_MEDIO) VALUES 
    ('${payload.codigo_ativo}',${Number(payload.quantidade)},${Number(payload.preco_medio)})`;
        await client.query(sql);

        let sql1 = `insert into OPERACOES (ID, CODIGO_ATIVO, QUANTIDADE, PRECO, TIPO) VALUES 
    (nextval('seq_operacoes_id'),'${payload.codigo_ativo}',${Number(payload.quantidade)},${Number(payload.preco_medio)},'C'})`;
        await client.query(sql1);

    }

});

router.put('/:codigo', async (req, res) => {
    let payload = req.body;
    const client = criaClient();
    await client.connect();

    if (payload.tipo == 'V') {
        let sql0 = `SELECT PRECO_MEDIO from CARTEIRA where CODIGO_ATIVO = '${payload.codigo_ativo}'
    `;console.log(sql0);
        let preco_medio = await cliente.query(sql0).rows[0].preco_medio
        
        let sql1 = `insert into OPERACOES (ID, CODIGO_ATIVO,QUANTIDADE, PRECO,TIPO,LUCRO_PREJUIZO) VALUES 
        (nextval('SEQ_OPERACOES_ID'),'${payload.codigo_ativo}',${payload.quantidade},${payload.preco_medio},'V',${(payload.preco_medio - preco_medio) * payload.quantidade})
    `;
        await client.query(sql1);
        console.log(sql1);
        let sql3 = `select QUANTIDADE from CARTEIRA where CODIGO_ATIVO = '${payload.codigo_ativo}'
    `;
        let carteira_quantidade = await cliente.query(sql3).row[0].quantidade;
        console.log(carteira_quantidade);
        let sql2 = `update CARTEIRA set
    QUANTIDADE = ${carteira_quantidade - payload.quantidade}
     where
    CODIGO_ATIVO = ${payload.codigo_ativo}
    `;
        await client.query(sql2);
        console.log(sql2);

        await client.end();
        res.status(201)
        res.send();
    }

    else if (payload.tipo === 'C') {
        let sql1 = `insert into OPERACOES (ID, CODIGO_ATIVO,QUANTIDADE,PRECO,TIPO) VALUES 
    (nextval('SEQ_OPERACOES_ID'),'${payload.codigo_ativo}',${payload.quantidade},${payload.preco_medio},'${payload.tipo}')
`;
        await client.query(sql1);
        console.log(sql1);
        let sql2 = `select QUANTIDADE from CARTEIRA where CODIGO_ATIVO = '${payload.codigo_ativo}'
    `;
        let carteira_quantidade = await client.query(sql2).rows[0].quantidade;
        console.log(carteira_quantidade);
        let sql3 = `select PRECO_MEDIO from CARTEIRA where CODIGO_ATIVO = '${payload.codigo_ativo}'
    `;
        let carteira_precoMedio = await client.query(sql3).rows[0].preco_medio;
        console.log(carteira_precoMedio);
        let sql4 = `update CARTEIRA set
    QUANTIDADE = ${Number(carteira_quantidade) + Number(payload.quantidade)},
    PRECO_MEDIO = ${((Number(carteira_quantidade) * Number(carteira_precoMedio)) + (Number(payload.quantidade) * Number(payload.preco_medio))) / (Number(carteira_quantidade) + Number(payload.quantidade))}
     where
    CODIGO_ATIVO = '${payload.codigo_ativo}'
    `;
    console.log(sql4);
        await client.query(sql4);

        await client.end();
        res.status(201)
        res.send();
    }
    else {
        await client.end();
        res.send("erro");
    }
});

export default router;
