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