const inquirer = require('inquirer');
const Ctable = require('console.table');
// const db = require('./db/connection')
const Database = require('./db/connection2');

const db2 = new Database;

const someFunction = () => {
    return db2.query(`SELECT * FROM employees`)
}

const myFunction = (data) => {
    console.table(data)
}
someFunction
    .then(rows => console.log(rows))