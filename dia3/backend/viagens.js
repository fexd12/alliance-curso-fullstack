import { Router } from 'express';
import {criaClient} from './banco'


const router = Router();

router.get(':codigo/', async (req, res) => {
    let resultado = [];
    
    const CODIGO_USUARIO = req.params.codigo;

    const client = criaClient();
    await client.connect();
    let queryResult = await client.query('select ID, CODIGO_USUARIO, CODIGO_BICICLETA, DATA_INICIO, DATA_FIM,PRECO from VIAGENS');
    for (let row of queryResult.rows) {
        resultado.push({
            ID: row.id,
            CODIGO_USUARIO: row.codigoUsuario,
            CODIGO_USUARIO: CODIGO_USUARIO,
            CODIGO_BICICLETA: row.CODIGO_BICICLETA,
            DATA_INICIO: row.DATA_INICIO,
            DATA_FIM,PRECO: row.DATA_FIM

        });

    }
    await client.end();
    res.send(JSON.stringify(resultado));
});







export default router