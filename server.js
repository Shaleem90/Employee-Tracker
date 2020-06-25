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

//  Adds new employees
const addEmployee = () => {
  let newDept = [];
  connection.query("SELECT * FROM department", (err, res) => {
    res.forEach(element => {
      newDept.push(`${element.id} ${element.dept}`);
    })
    let newPosition = [];
    connection.query("SELECT id, title FROM role", (err, res) => {
      res.forEach(element => {
        newPosition.push(`${element.id} ${element.title}`);
      })
      let newManager = [];
      connection.query(`SELECT id, first_name, last_name FROM employee`, (err, res) => {
        res.forEach(element => {
          newManager.push(`${element.id} ${element.first_name} ${element.last_name}`)

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
          {
            name: "manager",
            type: "list",
            message: "Choose employee's manager",
            choices: newManager
          }
        ]).then(res => {
          let roleCode = parseInt(res.role);
          let mgrCode = parseInt(res.manager)
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: res.first,
              last_name: res.last,
              role_id: roleCode,
              manager_id: mgrCode
            }, (err, res) => {
              if (err) throw err
            }
          )
          connection.query(mgrTable, (err, res) => {
            if (err) throw err;
            console.table(res);
            ask();
          })
        })
      })
    })
  })
}

//Employees with all values
const viewEmployees = () => {
  connection.query(employee, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  })
};