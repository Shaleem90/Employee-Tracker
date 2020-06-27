const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");


const connection = mysql.createConnection({
  host: "localhost",

  // Port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Shajee123!",
  database: "employeeTracker_DB"
});

//connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  startApp();
});

//Start app
function startApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add New Department",
        "View all Departments",
        "Add new Employee Role",
        "View all employees Roles",
        "Add Employee",
        "View All Employees",
        "Update Employee Role",
        "Remove an Employee",
        "Exit"
      ]
    })
    .then(response => {
      switch (response.action) {
        case "Add New Department":
          addDepartments();
          break;

        case "View all Departments":
          viewDepartments();
          break;

        case "Add new Employee Role":
          addEmployeeRole();
          break;

        case "View all employees Roles":
          viewRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "Add New Department to the Company":
          addDepartment();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Remove an Employee":
          removeEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// Variable holding the sql syntex to join in the database 
const tblMain = (`SELECT employee.id, first_name, last_name, title, role_id, salary, manager_id
FROM employee
INNER JOIN role
ON employee.role_id = role.id
INNER JOIN department
ON role.department_id = department.id`);


// Add new Departments 
const addDepartments = () => {

  inquirer
    .prompt({

      name: "role",
      type: "input",
      message: "Please Add A New Department"

    }
    ).then(res => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: res.role
        },
        (err, res) => {
          if (err) throw err;
        }
      )
      connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
      })
    })

}

// View all departments
const viewDepartments = () => {
  connection.query("SELECT id, department_name FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  })
};

// Add New Employee Role
const addEmployeeRole = () => {
  let newRole = [];
  connection.query("SELECT * FROM department", (err, res) => {
    res.forEach(element => {
      newRole.push(`${element.id} ${element.department_name}`);
    })

    inquirer
      .prompt([{

        name: "role",
        type: "input",
        message: "Please Enter A New Role"

      },
      {
        name: "salary",
        type: "input",
        message: "What Is The Salary?"
      },
      {
        name: "department",
        type: "list",
        message: "Please Choose Department For New Role",
        choices: newRole
      }
      ]).then(res => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: res.role,
            salary: res.salary,
            department_id: parseInt(res.department)
          },
          (err, res) => {
            if (err) throw err;
          }
        )
        connection.query("SELECT * FROM role", (err, res) => {
          if (err) throw err;
          console.table(res);
          startApp();
        })
      })
  })
}

//View all Employee roles
const viewRoles = () => {
  connection.query("SELECT id, title FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  })
};

//  Adds new employees
const addEmployee = () => {
  let newDept = [];
  connection.query("SELECT * FROM department", (err, res) => {
    res.forEach(element => {
      newDept.push(`${element.id} ${element.department_name}`);
    })
    let newPosition = [];
    connection.query("SELECT id, title FROM role", (err, res) => {
      res.forEach(element => {
        newPosition.push(`${element.id} ${element.title}`);
      })

      inquirer.prompt([
        {
          name: "first",
          type: "input",
          message: "Enter employee's first name."
        },
        {
          name: "last",
          type: "input",
          message: "Enter empoyee's last name."
        },
        {
          name: "department",
          type: "list",
          message: "Choose employee's department",
          choices: newDept
        },
        {
          name: "role",
          type: "list",
          message: "Choose employee's role",
          choices: newPosition
        },

      ]).then(res => {
        let roleCode = parseInt(res.role);
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: res.first,
            last_name: res.last,
            role_id: roleCode,
          }, (err, res) => {
            if (err) throw err
          }
        )
        connection.query(roleCode, (err, res) => {
          if (err) throw err;
          console.table(res);
          startApp();
        })
      })
    })
  })
}

//Employees with all values
const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  })
};

// Update Employee Role

const updateRole = () => {
  const employees = [];

  connection.query(`SELECT  id, first_name, last_name FROM employee`, (err, res) => {
    res.forEach(element => {
      employees.push(`${element.id} ${element.first_name} ${element.last_name}`);
    });
    let newPosition = [];
    connection.query("SELECT id, title FROM role", (err, res) => {
      res.forEach(element => {
        newPosition.push(`${element.id} ${element.title}`);
      })

      inquirer.prompt([
        {
          name: "update",
          type: "list",
          message: "Choose employee whose role you woule like to update?",
          choices: employees
        },
        {
          name: "role",
          type: "list",
          message: "Choose employee's role",
          choices: newPosition
        }
      ]).then(res => {
        //response parsed to acquire int values from database
        let roleCode = parseInt(res.role);
        let empID = parseInt(res.update);
        connection.query(
          `UPDATE employee SET role_id = ${roleCode} WHERE id = ${empID}`,
          (err, res) => {
            if (err) throw err
          }
        )
        connection.query(tblMain, (err, res) => {
          if (err) throw err;
          console.table(res);
          startApp();
        })
      })
    })
  })
}

// Function that removes employees from database
const removeEmployee = () => {
  let active = [];

  connection.query(`SELECT  id, first_name, last_name FROM employee`, (err, res) => {
    res.forEach(element => {
      active.push(`${element.id} ${element.first_name} ${element.last_name}`);
    });

    inquirer.prompt(
      {
        name: "remove",
        type: "list",
        message: "Who would you like to remove?",
        choices: active
      }

    ).then(response => {
      console.log(response);
      let empID = parseInt(response.remove);

      connection.query(`DELETE FROM employee WHERE id = ${empID}`, (err, res) => {
        console.table(response);
        startApp();
      })
    })
  })
}