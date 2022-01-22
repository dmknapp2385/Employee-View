const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require ('./db/connection');

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
        const sql = `SELECT * FROM roles`
        db.query(sql, (err, data) => {
            if (err) {
                throw err;
            }
            console.table('\n\nRoles', data);
            promptOne();
        })
    } else if (firstPrompt === 'View All Employees') {
        const sql = `SELECT * FROM departments`
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
    }
    promptOne();
    // inquirer
    //     .prompt([
    //         {

    //         }
    //     ])
}

promptOne()
