import { Client } from 'pg';

function criaClient() {
    return new Client({
        user: 'dia3',
        host: 'localhost',
        database: 'db_dia3',
        password: '12',
        port: 5432

    });
}

export {
    criaClient
}
