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