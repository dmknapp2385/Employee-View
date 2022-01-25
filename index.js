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
    console.log(purpose);
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
                    return addDepartment();
                } else {
                    depObjs.forEach(obj => {
                        if(obj.name === department){
                            depId = obj.id;
                        }
                    });
                    if (purpose === 'Employee') {
                        return addEmployee(depId)
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

//Add Employee
const addEmployee = (id) => {
    roleObj = {};
    getRoles
        .then((rows) => {
            roleObj = [...rows];
            const roleArray = ['None'];
            rows.forEach(role => {
                roleArray.push(role.Job);
            });
            return roleArray;
        }).then((roles) => {
            inquirer
            .prompt([
                {
                    type: 'list',
                    name:'role',
                    message:'What role does your job belong to?',
                    choices: [...roles]
                },
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
                if (data.role === 'None') {
                    return addRole(id);
                } else {
                    roleObj.forEach(obj => {
                        if(obj.Job === data.role){
                            roleId = obj.id;
                        }
                    });
                    console.log(data)
                    console.log(id)
                    console.log(roleId)

                }
            });
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
