const postgressCon = require('../config/postgresConn');
const { Client } = require('pg');

// Se crea la conexión a la base de datos postgres
const connectionData = {
    user: postgressCon.user,
    host: postgressCon.host,
    database: postgressCon.database,
    password: postgressCon.password,
    port: postgressCon.port
}
const client = new Client(connectionData);
client.connect();

// Se crea la función que inserta la transacción en la base de datos
exports.insertTransaction = async (transaction) => {
    try {
        const query = {
            text: 'INSERT INTO transaction (id, amount, currency, status, created_at) VALUES ($1, $2, $3, $4, $5)',
            values: [transaction.id, transaction.amount, transaction.currency, transaction.status, transaction.created_at]
        }
        const res = await client.query(query);
        return res;
    } catch (error) {
        console.log(error);
    }
}

exports.getTransaction = async (transactionId) => {
    try {
        const query = {
            text: "SELECT ID, case when status='succeeded' then 'Pagado' else status end as Estado,"+ 
                "created_at as Hora FROM transaction WHERE id = $1",
            values: [transactionId]
        }
        const res = await client.query(query);
        return res;
    } catch (error) {
        console.log(error);
    }
}