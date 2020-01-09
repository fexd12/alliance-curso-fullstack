import { Router } from 'express';
import { criaClient } from './banco';

const router = Router();

router.get('/',async(req,res) =>{
    let resultado =[];

    const client =criaClient();
    await client.connect();

    let queryResult = await client.query("select ID, CODIGO_ATIVO, TIPO, DATA, PRECO, QUANTIDADE, LUCRO_PREJUIZO from OPERACOES where TIPO = 'V'");
    for (let row of queryResult.rows) {
        resultado.push({
            id: row.id,
            codigo_ativo: row.codigo_ativo.trim(),
            tipo: row.tipo.trim(),
            data: row.data,
            preco: row.preco,
            quantidade: row.quantidade,
            lucro_prejuizo: parseInt(row.lucro_prejuizo)
        });
    }
    await client.end();
    res.send(JSON.stringify(resultado));
});

export default router;
