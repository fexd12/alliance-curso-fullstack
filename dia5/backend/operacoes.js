import { Router } from 'express';
import { criaClient } from './banco';

const router = Router();

router.get('/:codigo/', async(req, res) => {
    let resultado = [];
    let codigo = req.params.codigo;

    const client = criaClient();
    await client.connect();
    let sql= `select CODIGO_ATIVO, QUANTIDADE, PRECO, TIPO, LUCRO_PREJUIZO from OPERACOES where CODIGO_ATIVO = '${codigo}'`
    let queryResult = await client.query(sql);
    for (let row of queryResult.rows) {
        resultado.push({
            codigo_ativo: row.codigo_ativo.trim(),
            quantidade: row.quantidade,
            preco: row.preco,
            tipo:row.tipo,
            lucro_prejuizo: row.lucro_prejuizo
        });
    }
    await client.end();
    res.send(JSON.stringify(resultado));
});

export default router;