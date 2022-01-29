const mysql = require('mysql2');

class Database {
    constructor() {
        this.connection = mysql.createConnection(
            {
                host:'localhost',
                user: //enert your username here,
                password: //eneter your password here,
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
        this.connection.end();
    }
}
  
module.exports = Database;
