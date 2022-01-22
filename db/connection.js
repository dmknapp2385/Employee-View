const mysql = require('mysql2');

// connect node to mysql database

const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: 'dani7392385',
        database: 'records'
    },
    console.log('Connected to the records database.')
);


module.exports = db;