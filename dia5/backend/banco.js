import { Client } from 'pg';

function criaClient() {
    return new Client({
        user: 'dia3',
        host: 'localhost',
        database: 'db_dia5',
        password: '12',
        port: 5432

    });
}

// function criaClient() {
//     return new Client({
//         user: 'adminfelipe',
//         host: 'db-teste.database.windows.net',
//         database: 'db_users',
//         password: '#Dmin123',
//         port: 1433

//     });
// }

export {
    criaClient
}
