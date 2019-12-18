import {Client} from 'pg';
import { Router } from 'express';

const router=Router(); 

router.get('/', async () => {
    let resultado =[];
    const client = criaClient();
    await client.connect();
    let res = await client.query('select CODIGO, NOME, TELEFONE, EMAIL, SALDO_CREDITOS from USUARIOS');
    for(let row of res.rows){
        resultado.push({
            codigo: row.CODIGO,
            nome: row.NOME,
            telefone: row.TELEFONE,
            email: row.EMAIL,
            saldoCreditos: row.SALDO_CREDITOS
        });
        
    }
    await client.end();

    res.send(JSON.stringify({ resultado }));

});

function criaClient(){
    return new Client({
        user:  'dia3',
        host: 'localhost',
        database: 'db_dia3',
        password: '12',
        port: 5432
    
    });
}

export default router;