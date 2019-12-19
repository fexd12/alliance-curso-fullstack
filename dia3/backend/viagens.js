import { Router } from 'express';
import {criaClient} from './banco'

const router = Router();

router.get('/:codigo', async (req, res) => {

    const CODIGO_USer = req.params.codigo;
    let resultado = [];
    
    const client = criaClient();
    await client.connect();
    let texto = `select ID, CODIGO_USUARIO, CODIGO_BICICLETA, DATA_INICIO, DATA_FIM,PRECO from VIAGENS where codigo_usuario = ${CODIGO_USer}`
    let queryResult = await client.query(texto);
    for (let row of queryResult.rows) {
        resultado.push({
            ID: row.id,
            CODIGO_USUARIO: row.codigoUsuario,
            CODIGO_BICICLETA: row.CODIGO_BICICLETA,
            DATA_INICIO: row.DATA_INICIO,
            DATA_FIM: row.DATA_FIM,
            PRECO: row.PRECO

        });

    }
    await client.end();
    res.send(JSON.stringify(resultado));
});


export default router