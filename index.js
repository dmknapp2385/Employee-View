const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require ('./db/connection');


// Prompt what table is to be viewed
const promptOne = function(){
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'firstPrompt',
                message: 'What would you like to do?',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit'],
                defalut: 'View All Employees'                
            }
        ])
        .then(promptTwo);
}


// Take results from first prompt and output table
const promptTwo = function (result) {
    const {firstPrompt} = result;
    if(firstPrompt === 'View All Departments'){
        const sql = `SELECT * FROM departments`
        db.query(sql, (err, data) => {
            if (err) {
                throw err;
            }
            console.table('\n\nDepartments', data);
            promptOne();
        })
    } else if (firstPrompt === 'View All Roles') {
        const sql = `SELECT r.job_title AS Role, r.salary, d.name AS department FROM roles AS r
        LEFT JOIN departments AS d ON r.department_id = d.id;`
        db.query(sql, (err, data) => {
            if (err) {
                throw err;
            }
            console.table('\n\nRoles', data);
            promptOne();
        })
    } else if (firstPrompt === 'View All Employees') {
        const sql = `SELECT CONCAT(e.first_name," ", e.last_name) AS "Full Name", e.manager AS Manager, r.job_title AS Role, r.salary AS Salary, d.name AS Department FROM employees AS e LEFT JOIN roles AS r ON e.role_id = r.id LEFT JOIN departments AS d ON r.department_id = d.id;`
        db.query(sql, (err, data) => {
            if (err) {
                throw err;
            }
            console.table('\n\Employees', data);
            promptOne();
        })
    } else if ( firstPrompt === 'Add Department') {
        console.log('adding department')
    } else if (firstPrompt === 'Add Role') {
        console.log('Adding Role')
    } else if (firstPrompt === 'Add Employee') {
        console.log('adding employee')
    } else if (firstPrompt === 'Update Employee Role') {
        console.log('updating employee')
    } else if (firstPrompt === 'Quit') {
        console.log('Exiting');
    }

}



promptOne()
