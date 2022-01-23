const db = require('./db/connection');

let p = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM departments;`
    db.query(sql, (err, rows) => {
        if (err) {
            reject(err.message);
        } else {
            resolve(rows);
        }
    })
});

p.then((message) => console.log(message)).catch((message) => console.log(message + 'from the catch'));