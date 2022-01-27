const inquirer = require('inquirer');
const Ctable = require('console.table');
// const db = require('./db/connection')
const Database = require('./db/connection2');

const db = new Database;
// Prompt what table is to be viewed
const promptOne = function(){
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'firstPrompt',
                message: 'What would you like to do?',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Manager', 'Quit'],
                defalut: 'View All Employees'                
            }
        ])
        .then(promptTwo)
        .catch((error) => {
            console.log(error);
        });
}
// SQL commands

const getDepartmentsSQL = `SELECT * FROM departments ORDER BY id ASC;`
const getRoleSQL = `SELECT r.id, r.job_title AS Job, r.salary, d.name AS department FROM roles AS r
LEFT JOIN departments AS d ON r.department_id = d.id;`
const getEmployeesSQL = `SELECT CONCAT(e.first_name," ", e.last_name) AS "Full Name", e.manager AS Manager, r.job_title AS Role, r.salary AS Salary, d.name AS Department FROM employees AS e LEFT JOIN roles AS r ON e.role_id = r.id LEFT JOIN departments AS d ON r.department_id = d.id;`
const getRoleByIDSQL = `SELECT job_title, id FROM roles WHERE department_id=?;`

// get departments
const getDepartments = () => {
    db.query(getDepartmentsSQL)
        .then((rows) => {
            console.table('\n\nDepartments', rows);
            promptOne();
        })
        .catch((err)=>{
            throw err;
        });
}

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
        db.query(sql, params)
            .then((result)=>{
                console.log('Department added'); 
                promptOne()})
            .catch((err) => console.log(err))
        });
    
}

//Get Roles
const getRoles = () => {
    db.query(getRoleSQL)
        .then((rows) => {
            console.table('\n\nRoles', rows);
            promptOne();
        })
        .catch((err)=>{
            console.log(err);
        });
};

// Get Employees 
const getEmployees = () => {
    db.query(getEmployeesSQL)
    .then((rows) => {
        console.table('\n\nEmployees', rows);
        promptOne();
    })
    .catch((err)=>{
        console.log(err.message);
        throw err;
    });
}

// Get Department Id for adding role and employee
let getDepId = (purpose) => {
    let depObjs = []
    db.query(getDepartmentsSQL)
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
                    message:'What department does the job or person belong to?',
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
                        return addEmployee(depId);
                    } else if (purpose === 'Role') {
                        return addRole(depId);
                    } else if (purpose === 'UpdateRole') {
                        return updateEmployee(depId);
                    } else if (purpose === 'UpdateManager') {
                        return updateEmployeeManager(depId);
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
        db.query(sql, params)
            .then((results) => {
                console.log('Role added.\nWhat else would you like to do?');
                promptOne()
            })
            .catch(err => console.log(err))
    });
    
}

//Add Employee
const addEmployee = (id) => {

    db.query(getRoleByIDSQL, id)
    .then((rows) => {
        const roleArray = ['None'];
        rows.forEach(role => {
            roleArray.push(role.job_title);
        });
            inquirer
            .prompt([
                {
                    type: 'list',
                    name:'role',
                    message:'What role does your employee belong to?',
                    choices: [...roleArray]
                }
            ]).then(({role}) => {
                if (role === 'None') {
                    console.log('Please add this role first.')
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
                            db.query(sql, params)
                                .then((results) => {
                                    console.log('What would you like to do next');
                                    promptOne();
                                })
                                .catch(err => console.log(err.message))
                        });
                }
            });
    })
}           

//Update Employee Role
const updateEmployee = (id) => {
    db.query(getRoleByIDSQL, id)
        .then((rows) => {
            let roleObj = [...rows];
            const roleArray = [];
            rows.forEach(role => {
                roleArray.push(role.job_title);
            });
            inquirer
            .prompt([
                {
                    type: 'list',
                    name:'role',
                    message:'What role does your employee currently have?',
                    choices: ['None', ...roleArray]
                }
            ]).then(({role}) => {
                if (role === 'None') {
                    console.log('Please make sure you are in the right deparment or add another role first')
                    return promptOne();
                } else {
                    console.log(roleObj);
                    console.log(typeof(role));
                    roleObj.forEach(row => {
                        if (row.job_title === role) {
                            oldroleId = row.id;
                        }
                    })
                    const sql = `SELECT last_name, id FROM employees WHERE role_id=?;`
                    db.query(sql, oldroleId)
                        .then((rows) => {
                            let lastnameobj = [...rows]
                            const lastNamearry = [];
                            rows.forEach(name => {
                                lastNamearry.push(name.last_name);
                            });
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'LastName',
                                        message:'What is the last name of the employee you would like to update?',
                                        choices:['None', ...lastNamearry]
                                    }
                                ])
                                .then(({LastName}) => {
                                    if (LastName === 'None') {
                                        console.log('Please make sure you are in the right department and role')
                                        return promptOne();
                                    } else {
                                        inquirer
                                            .prompt([
                                                {
                                                    type:'list',
                                                    name:'update',
                                                    message:'What is the new role you would like the employee to have?',
                                                    choices: [...roleArray]
                                                }
                                            ])
                                            .then(({update}) => {
                                                roleObj.forEach(row => {
                                                    if (row.job_title === update) {
                                                        newRoleId = row.id
                                                    }
                                                })
                                                lastnameobj.forEach(row => {
                                                    if(row.last_name === LastName) {
                                                        empId = row.id
                                                    }
                                                })
                                                const sql = `UPDATE employees SET role_id=? WHERE id=?;`
                                                const params = [newRoleId, empId];
                                                db.query(sql, params)
                                                    .then((results)=> {
                                                        console.log(`Employee updated to ${update}. \nWhat else would you like to do?`);
                                                        return promptOne();
                                                    })
                                                    .catch(err => {
                                                        console.log(err.message)
                                                    })
                                            });
                                    }
                                });
                        })
                   
                }
        })
})
}

//Update Employee Manager 
const updateEmployeeManager = (id) => {
    console.log(id)
    db.query(getRoleByIDSQL, id)
    .then((rows) => {
        let roleObj = [...rows];
        const roleArray = [];
        rows.forEach(role => {
            roleArray.push(role.job_title);
        });
        inquirer
        .prompt([
            {
                type: 'list',
                name:'role',
                message:'What role does the employee have?',
                choices: ['None', ...roleArray]
            }
        ]).then(({role}) => {
            if (role === 'None') {
                console.log('Please make sure you are in the right deparment or add another role first')
                return promptOne();
            } else {
                roleObj.forEach(row => {
                    if (row.job_title === role) {
                        oldroleId = row.id;
                    }
                })
                const sql = `SELECT last_name, id FROM employees WHERE role_id=?;`
                db.query(sql, oldroleId)
                    .then((rows) => {
                        let lastnameobj = [...rows]
                        const lastNamearry = [];
                        rows.forEach(name => {
                            lastNamearry.push(name.last_name);
                        });
                        inquirer
                            .prompt([
                                {
                                    type: 'list',
                                    name: 'LastName',
                                    message:'What is the last name of the employee you would like to update?',
                                    choices:['None', ...lastNamearry]
                                }
                            ])
                            .then(({LastName}) => {
                                if (LastName === 'None') {
                                    console.log('Please make sure you are in the right department and role')
                                    return promptOne();
                                } else {
                                    inquirer
                                        .prompt([
                                            {
                                                type:'text',
                                                name:'update',
                                                message:'Who is the new manager you would like the employee to have?',
                                                validate: input => {
                                                    if (input) {
                                                        return true
                                                    } else {
                                                        console.log('Please enter a manager')
                                                    }
                                                }
                                            }
                                        ])
                                        .then(({update}) => {
                                            lastnameobj.forEach(row => {
                                                if(row.last_name === LastName) {
                                                    empId = row.id
                                                }
                                            })
                                            const sql = `UPDATE employees SET manager=? WHERE id=?;`
                                            const params = [update, empId];
                                            db.query(sql, params)
                                                .then((results)=> {
                                                    console.log(`Employee manager updated to ${update}. \nWhat else would you like to do?`);
                                                    return promptOne();
                                                })
                                                .catch(err => {
                                                    console.log(err.message)
                                                })
                                        });
                                }
                            });
                    })
               
            }
    })
})

}


// Take results from first prompt and output table
const promptTwo = function (result) {
    const {firstPrompt} = result;
    if(firstPrompt === 'View All Departments'){
        getDepartments();
    } else if (firstPrompt === 'View All Roles') {
        getRoles();
    } else if (firstPrompt === 'View All Employees') {
        getEmployees();
    } else if ( firstPrompt === 'Add Department') {
        addDepartment();
    } else if (firstPrompt === 'Add Role') {
        getDepId('Role');
    } else if (firstPrompt === 'Add Employee') {
        getDepId('Employee');
    } else if (firstPrompt === 'Update Employee Role') {
        getDepId('UpdateRole');
    } else if (firstPrompt === 'Update Employee Manager') {
        getDepId('UpdateManager');
    } else if (firstPrompt === 'Quit') {
        db.close();
    }
}

promptOne()
