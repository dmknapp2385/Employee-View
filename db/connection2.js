const mysql = require('mysql2');
const { promise } = require('./connection');

class Database {
    constructor() {
        this.connection = mysql.createConnection(
            {
                host:'localhost',
                user: 'root',
                password: 'dani7392385',
                database: 'records'
            },
        )
    }
    query(sql, args) {
        return new Promise( (resolve, reject) => {
            this.connection.query(sql, args, (err, rows ) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise ( (resolve, reject) => {
            this.connection.end( err => {
                if(err) {
                    return reject(err)
                } else {
                    resolve('Connection Ended')
                }
            });
        });
    }
}
  
module.exports = Database;
