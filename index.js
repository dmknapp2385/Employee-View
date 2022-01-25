const inquirer = require('inquirer');
const Ctable = require('console.table');
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
        .then(promptTwo)
        .catch((error) => {
            console.log(error);
        });
}

// Get department query
let getDepartments = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM departments ORDER BY id ASC;`
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
    const sql = `SELECT r.id, r.job_title AS Job, r.salary, d.name AS department FROM roles AS r
    LEFT JOIN departments AS d ON r.department_id = d.id;`
    db.query(sql, (err, rows) => {
        if (err) {
            reject(err.message);
        } else {
            resolve(rows)
        }
    });
});

// Get Employees 
const getEmployees = () => {
    const sql = `SELECT CONCAT(e.first_name," ", e.last_name) AS "Full Name", e.manager AS Manager, r.job_title AS Role, r.salary AS Salary, d.name AS Department FROM employees AS e LEFT JOIN roles AS r ON e.role_id = r.id LEFT JOIN departments AS d ON r.department_id = d.id;`
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err.sqlMessage);
            return;
        }
        console.table('\n\Employees', data);
        promptOne();
    })
}


// Get Department Id for adding role and employee
let getDepId = (purpose) => {
    let depObjs = []
    getDepartments
        .then((rows) => {
            depObjs = [...rows];
            const depArray = ['None'];
            rows.forEach(department => {
                depArray.push(department.name);
            });
            return depArray;
        }).then((departments) => {
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
                    console.log('Please add the department first.');
                    return promptOne();
                } else {
                    depObjs.forEach(obj => {
                        if(obj.name === department){
                            depId = obj.id;
                        }
                    });
                    if (purpose === 'Employee') {
                        return getRolebyId(depId);
                    } else if (purpose === 'Role') {
                        return addRole(depId);
                    }
                }
            });
        });
};
//Add Role
const addRole = (id) => {
     inquirer
    .prompt([
        {
            type: 'text',
            name:'job',
            message: 'What is the job title?',
            validate: input => {
                if (input) {
                    return true;
                }
                else {
                    console.log('Please enter a job title');
                }
            }
        },
        {
            type:'number',
            name: 'salary',
            message: 'What is the salary for this job?',
            validate: input => {
                if (input) {
                    return true;
                }
                else {
                    console.log('\nPlease enter a salary');
                    return false;
                }
            }
        }
    ]).then((results) => {
        const sql = `INSERT INTO roles (job_title, salary, department_id) VALUES (?,?,?);`
        const params = [results.job, results.salary, id];
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
            } else {
                console.log('Role Added!');
                promptOne();
            }
        });
    });
    
}

//Get role by department to add employee
const getRolebyId = (id) => {
    const sql = `SELECT job_title, id FROM roles WHERE department_id=?;`
    params = id;
    db.query(sql, params, (err, rows) => {
        if (err) {
            throw err;
        }
        addEmployee(rows);
    })
}
//Add Employee
const addEmployee = (rows) => {
    console.log(rows);
    const roleArray = ['None'];
    rows.forEach(role => {
        roleArray.push(role.job_title);
    });
        inquirer
        .prompt([
            {
                type: 'list',
                name:'role',
                message:'What role does your job belong to?',
                choices: [...roleArray]
            }
        ]).then(({role}) => {
            if (role === 'None') {
                console.log('Please add this job first.')
                return promptOne();
            } else {
                inquirer
                    .prompt([
                        {
                            type: 'text',
                            name: 'firstName',
                            message:"What is the employee's first name?",
                            validate: input => {
                                if (input) {
                                    return true;
                                }
                                else {
                                    console.log('\nPlease enter a first name');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'text',
                            name: 'lastName',
                            message:"What is the employee's last name?",
                            validate: input => {
                                if (input) {
                                    return true;
                                }
                                else {
                                    console.log('\nPlease enter a last name');
                                    return false;
                                }
                            }
                        },               
                        {
                            type: 'text',
                            name: 'manager',
                            message:"Who is the employee's manager?",
                            validate: input => {
                                if (input) {
                                    return true;
                                }
                                else {
                                    console.log('\nPlease enter a manager name');
                                    return false;
                                }
                            }
                        }
                    ]).then((data) => {
                        rows.forEach(row => {
                            if(row.job_title === role){
                            roleId = row.id;
                            }
                        });
                        const sql = `INSERT INTO employees(first_name, last_name, manager, role_id) VALUES (?,?,?,?);`
                        const params = [data.firstName, data.lastName, data.manager, roleId];
                        db.query(sql, params, (err, result) => {
                            if (err) {
                                throw err
                            } else {
                                console.log('\nEmployee Added')
                            }
                            promptOne();
                        })
                    });
            }
        });

}           

//Update Employee Role


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
        getEmployees();
    } else if ( firstPrompt === 'Add Department') {
        addDepartment();
    } else if (firstPrompt === 'Add Role') {
        getDepId('Role');
    } else if (firstPrompt === 'Add Employee') {
        getDepId('Employee');
    } else if (firstPrompt === 'Update Employee Role') {
        updateEmployee();
    } else if (firstPrompt === 'Quit') {
        console.log('Exiting');
        db.end();
    }
}





promptOne()
