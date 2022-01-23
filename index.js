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

// Get department sql query
let getDepartments = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM departments;`
    db.query(sql, (err, rows) => {
        if (err) {
            reject(err.sqlMessage);
        } else {
            resolve(rows);
        }
    })
});

// Add department
const addDepartment = () => {
    inquirer
    .prompt([
        {
            type:'text',
            name:'department',
            message:'What department would you like to add?',
            validate: input => {
                if (input) {
                    return true;
                }
                else {
                    console.log('Please enter a department name');
                }
            }
        }
    ]).then((result) => {
        const sql = `INSERT INTO departments (name) VALUES (?);`
        const params = result.department;
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                return addDepartment();
            } else{
                console.log('Department added');
            }
            promptOne();
        })
    });
}

//Get Roles
const getRoles = new Promise((resolve, reject) => {
    const sql = `SELECT r.job_title AS Role, r.salary, d.name AS department FROM roles AS r
    LEFT JOIN departments AS d ON r.department_id = d.id;`
    db.query(sql, (err, rows) => {
        if (err) {
            reject(err.message);
        } else {
            resolve(rows)
        }
    });
})

// Take results from first prompt and output table
const promptTwo = function (result) {
    const {firstPrompt} = result;
    if(firstPrompt === 'View All Departments'){
        getDepartments
            .then((rows) => {
                console.table('\n\nDepartments', rows);
                promptOne();
            })
            .catch((err)=>{
                console.log("Error");
                throw err;
            });
    } else if (firstPrompt === 'View All Roles') {
        getRoles
            .then((rows) => {
                console.table('\n\nRoles', rows);
                promptOne();
            })
            .catch((err)=>{
                throw err;
            });
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
        addDepartment();
    } else if (firstPrompt === 'Add Role') {
        const depArray = ['None'];
        getDepartments
            .then((rows) => {
                rows.forEach(department => {
                    depArray.push(department.name);
                });
                return depArray;
            }).then((departments) => {
                console.log(departments);
                inquirer
                .prompt([
                    {
                        type: 'list',
                        name:'department',
                        message:'What department does your job belong to?',
                        choices: [...departments]
                    },
                ]).then(({department}) => {
                    if (department === 'None') {
                        addDepartment();
                    } else {
                        return department
                    }
                }).then((department) => {
                    console.log(department);
                })
            })
       
    } else if (firstPrompt === 'Add Employee') {
        console.log('adding employee')
    } else if (firstPrompt === 'Update Employee Role') {
        console.log('updating employee')
    } else if (firstPrompt === 'Quit') {
        console.log('Exiting');
        db.end();
    }
}





promptOne()
