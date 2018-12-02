var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Nyjets$41",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;

    managerCommands();
})



/////////////////functions////////////////////
function seeInventory () {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['Prod Id', 'Description', 'Department', 'Price', 'Stock'],
            colWidths: [10, 20, 20 , 10, 10]
        });
        for (i in res) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }

        console.log(table.toString());
        managerCommands();
    });
}

function managerCommands() {
    inquirer.prompt([
    {
        name: "which",
        type: "list",
        message: "\nPlease make a selection: ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Program"]
    }
    ]).then(function(answer) {
        if (answer.which === "View Products for Sale") {
            seeInventory();
        }
        if (answer.which === "View Low Inventory") {
            viewLowInventory();
        }
        if (answer.which === "Add to Inventory") {
            addToInventory();
        }
        if (answer.which === "Add New Product") {
            newProduct();
        }
        if (answer.which === "Exit Program") {
            console.log("Terminating Connection.....")
            connection.end();
        }
    })
}

function viewLowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['Prod Id', 'Description', 'Department', 'Price', 'Stock'],
            colWidths: [10, 20, 20, 10, 10]
        });
        for (i in res) {
            if (res[i].stock_quantity < 5) {
                table.push(
                    [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
                );
            }
        
        }
        console.log(table.toString());
        managerCommands();
    })
}

function newProduct() {
    var depts = [];

    connection.query(
        "SELECT department_name FROM departments", function(err, res) {
         for (i in res) {
             if (depts.indexOf(res[i].department_name) < 0) {
              depts.push(res[i].department_name);
             }
         }
        }
    )
    inquirer.prompt([
    {
        name: "prodDesc",
        type: "input",
        message: "Please enter the product's name"
    },
    {
        name: "dept",
        type: "list",
        message: "Please select a department for the item.",
        choices: depts
    },
    {
        name: "price",
        type: "input",
        message: "Please enter a price for the item.",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    },
    {
        name: "amount",
        type: "input",
        message: "Please enter amount of units."
    }
    ]).then(function(answer) {
      connection.query(
          "INSERT INTO products SET ?",
          {
              product_name: answer.prodDesc,
              department_name: answer.dept,
              price: answer.price,
              stock_quantity: answer.amount,
              product_sales: 0
          },
          function(err) {
              if (err) throw err;
              console.log("New item added to inventory.\n");
              managerCommands();
          }
      )
    })
}

function addToInventory() {
   connection.query(
       "Select product_name FROM products", function(err, res) {
           if (err) throw err;
           var prodList = [];
           for (i in res) {
               prodList.push(res[i].product_name);
               
           }
           inquirer.prompt([
               {
               name: "prod",
               type: "list",
               message: "\n\nAdd inventory to which product? ",
               choices: prodList
               },
               {
                   name: "amount",
                   type: "input",
                   message: "\n\nHow many units will be added to inventory? "
               }
           ]).then(function(answer) {
               connection.query(
                   "UPDATE products SET stock_quantity = stock_quantity + " + answer.amount + " WHERE ?",
                   [
                       {
                           product_name: answer.prod
                       }
                   ],
                   function(err, res) {
                       console.log(answer.amount + " units added to the " + answer.prod + " inventory.");
                       managerCommands(res);
                   }
               )
               

           })
          
           
       }
   )
   
   
}