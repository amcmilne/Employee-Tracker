//DEPENDENCIES//
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

//*********************************************************CONSTRUCTOR*******************************************************************//
const entryChoices = [
    "View all Employees",
    "View all Employees by Role",
    "View all Employees by Department",
    "Add Department",
    "Add Role",
    "View Managers",
    "Add Employee",
    "Update Employee",
];

//*****************************************************START CONNECTION******************************************************************//
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "webapi",
    password: "password123",
    database: "employeetracker_db"
});


//**************************************************RETRIEVE ROLE********************************************************//
var roleDictionary = [];
function selectRole() {

    return new Promise(async function (resolve, reject) {
        await connection.query("SELECT * FROM roles", function (err, res) {
            if (err) reject(err);
            roleDictionary = JSON.parse(JSON.stringify(res))
        })
        resolve(roleDictionary);
    }
    )
}
//**************************************************RETRIEVE DEPT************************************************************//
var deptDictionary = {};
function selectDept() {

    return new Promise(async function (resolve, reject) {
        await connection.query("SELECT id, name FROM departments ORDER BY name", function (err, res) {
            if (err) reject(err);
            deptDictionary = JSON.parse(JSON.stringify(res))
        })
        resolve(deptDictionary);
    }
    )
}

//************************************************RETRIEVE EMPLOYEES************************************************************//
var employeesDictionary = [];
function selectEmployees() {
    return new Promise(async function (resolve, reject) {
        await connection.query("SELECT e1.id, CONCAT(e1.first_name,' ', e1.last_name) AS employeeName " +
            ", IF((SELECT count(id) FROM employees e2 WHERE e2.manager_id = e1.id) > 0,true,false) AS IsManager " +
            "FROM employees e1 " +
            "ORDER BY CONCAT(e1.first_name,' ', e1.last_name) "
            , function (err, res) {
                if (err) reject(err);
                employeesDictionary = JSON.parse(JSON.stringify(res))
            })
        resolve(employeesDictionary);
    }
    )
}

//******************************************************CONNECTION ID**************************************************************************//
connection.connect(function (err) {
    if (err) throw err
    //console.log("connected as Id" + connection.threadId)
    //connection.end();
});

//*******************************************************PROMPT USER************************************************************************//

function start() {
    selectDept();
    selectRole();
    selectEmployees();
    inquirer.prompt(
        [
            {
                name: "action",
                type: "rawlist",
                message: "What would you like to do?",
                choices: entryChoices,
            }
        ])
        .then(function (val) {
            switch (val.action) {
                case "View all Employees":
                    findEmployees();
                    break;
                case "View all Employees by Role":
                    findEmpRoles();
                    break;
                case "View all Employees by Department":
                    findEmpDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View Managers":
                    findManager();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee":
                    updateEmployee();
                    break;
                default:
                    break;
            }
        })

}

//*************************************************************FIND EMPLOYEE***********************************************************//
function findEmployees() {
    connection.query("SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles on roles.id = employees.role_id INNER JOIN departments on departments.id = roles.department_id left join employees e on employees.manager_id = e.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            start()
        })
}
function choicesRoles() {
    var selectableRoles = [];
    for (var key in roleDictionary) {
        if (roleDictionary.hasOwnProperty(key)) {
            let d = {};
            d['value'] = roleDictionary[key].id;
            d['name'] = roleDictionary[key].title;

            selectableRoles.push(d);
        }
    }
    return selectableRoles;
}
//***********************************************************************VIEW ROLES***********************************************************************//
function findEmpRoles() {
    connection.query("SELECT employees.first_name, employees.last_name, roles.title AS Title FROM employees JOIN roles ON employees.role_id = roles.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            start()
        })
}

function choicesDepartments() {
    var selectableDepartments = [];
    for (var key in deptDictionary) {
        if (deptDictionary.hasOwnProperty(key)) {
            let d = {};
            d['value'] = deptDictionary[key].id;
            d['name'] = deptDictionary[key].name;

            selectableDepartments.push(d);
        }
    }
    return selectableDepartments;
}

//*******************************************************************ADD ROLE**********************************************************************//
function addRole() {
    selectDept();
    inquirer.prompt(
        [
            {
                name: "title",
                type: "input",
                message: "What is the title?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary?",
            },
            {
                name: "department",
                type: "rawlist",
                message: "What is the department?",
                choices: choicesDepartments()
            }
        ])
        .then(function (res) {
            connection.query(
                "INSERT INTO roles SET ? ",
                {
                    title: res.title,
                    salary: res.salary,
                    department_id: res.department,
                },

                function (err) {
                    if (err) throw err
                    consoleTable(res);
                    start()
                }
            )
        })
}

//***************************************************************************VIEW DEPT*************************************************************************//
function findEmpDepartments() {
    connection.query("SELECT employees.first_name, employees.last_name, departments.name AS Department FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY employees.id;",
        function (err, res) {
            if (err) throw err
            consoleTable(res)
            start()
        })
}

//*************************************************************************ADD DEPT*****************************************************************************//
function addDepartment() {
    inquirer.prompt(
        [
            {
                name: "department",
                type: "input",
                message: "What is the department?",
            }
        ])
        .then(function (res) {
            connection.query(
                "INSERT INTO departments SET ? ",
                {
                    name: res.department,
                },

                function (err) {
                    if (err) throw err
                   consoleTable(res);
                    start()
                }
            )
        })
}
//*********************************************************************VIEW MANAGER*********************************************************************************/
function findManager() {
    selectDept();
    selectRole();
    connection.query("SELECT CONCAT(employees.first_name, ' ' ,employees.last_name) AS Managers FROM employees WHERE id in (select manager_id from employees where manager_id is not null) ORDER by employees.id",
        function (err, res) {
            if (err) throw err
            consoleTable(res)
            start()
        })
}

function choicesEmployees(managersOnly) {
    var selectableEmployees = [];
    for (var key in employeesDictionary) {
        if (employeesDictionary.hasOwnProperty(key)) {
            let d = {};
            if (managersOnly && employeesDictionary[key].IsManager) {
                d['value'] = employeesDictionary[key].id;
                d['name'] = employeesDictionary[key].employeeName;
                selectableEmployees.push(d);
            }
            else if (!managersOnly) {
                d['value'] = employeesDictionary[key].id;
                d['name'] = employeesDictionary[key].employeeName;
                selectableEmployees.push(d);
            }
        }
    };
    return selectableEmployees;
}
//*************************************************************************ADD EMPLOYEE******************************************************************************//
function addEmployee() {
    selectDept();
    selectRole();
    selectEmployees();
    inquirer.prompt(
        [
            {
                name: "first_name",
                type: "input",
                message: "What is employees first name?",
            },
            {
                name: "last_name",
                type: "input",
                message: "What is employees last name?",
            },
            {
                name: "department",
                type: "rawlist",
                message: "what is employees department?",
                choices: choicesDepartments()
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is employees role?",
                choices: choicesRoles()
            },
            {
                name: "choice",
                type: "confirm",
                message: "Does employee have a manager?"
            },
            {
                when: function (response) {
                    return response.choice;
                },
                default: true,
                name: "manager",
                type: "rawlist",
                message: "Who is employee's manager?",
                choices: choicesEmployees(true),
            }
        ])
        .then(function (res) {
            connection.query(
                "INSERT INTO employees SET ?",
                {
                    first_name: res.first_name,
                    last_name: res.last_name,
                    role_id: res.role,
                    //department_id: res.department,
                    manager_id: res.manager
                },
                function (err) {
                    if (err) throw err;
                    consoleTable(res)
                    start()
                })

        })
}

//***************************************************************UPDATE EMPLOYEE******************************************************************************//
function updateEmployee() {
    selectDept();
    selectRole();
    selectEmployees();
    connection.query("SELECT employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;", function (err, res) {
        if (err) throw err
        consoleTable(res)

        inquirer.prompt(
            [
                {
                    name: "employeeId",
                    type: "rawlist",
                    choices: choicesEmployees(false),
                    message: "Which Employee? ",
                },
                {
                    name: "role",
                    type: "rawlist",
                    message: "What is the Employee's new title? ",
                    choices: choicesRoles()
                },
            ]).then(function (res) {
                connection.query("UPDATE employees SET ? WHERE ?",
                    [
                        {
                            role_id: res.role
                        },
                        {
                            id: res.employeeId
                        }
                    ],
                    function (err) {
                        if (err) throw err
                        consoleTable(res)
                        start()
                    })

            });
    });

}

start();