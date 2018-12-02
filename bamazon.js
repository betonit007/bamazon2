var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');
var first = true;
var total = 0;

//creates connection to the mySQL database Bamazon
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    seeTable();
});


////////////functions///////////////////////////////////////////////////////////
function seeTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        var table = new Table({
            head: ['Prod Id', 'Description', 'Department', 'Price', 'Stock'],
            colWidths: [10, 20, 20, 10, 10]
        });
        for (i in res) {
            table.push(
                    [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
            console.log(table.toString());
            if(first) {
            buyPrompt(res);
            }
    });
}

function buyPrompt(res) {
   //prompt user to enter the product id and number of unit to buy
   inquirer.prompt([
       {
           name: "id",
           type: "input",
           message: "Please select item by Product ID number.\n"
       },
       {
           name: "quantity",
           type: "input",
           message: "Please enter number of units to purchase.\n"
       }
   ]).then(function(answer) {
        
        id = answer.id;
        quantity = answer.quantity;
        getStockLevel(answer.id, answer.quantity);
   })
}

function getStockLevel(id, quantity) {
    
    connection.query(
       "SELECT stock_quantity, price FROM products WHERE id = " + id 
     ,
        function(err, res) {
        if (err) throw err;
        purchase(res[0].stock_quantity, quantity, res[0].price, id);
    
        }
    );
}

function purchase(left, quantity, price, id) {
    if (left < quantity) {
        inquirer.prompt({
            
                name: "confirm",
                type: "rawlist",
                message: "Sorry, insufficient quantities on that item. Would you like to try again?",
                choices: ["Yes", "No"]
            }).then(function(answer) {
                if(answer.confirm === "No") {
                    console.log("Thanks for shopping this us! Please come back soon!")
                    connection.end();
                }
                else {
                    seeTable();
                }
            });
    }
    else {
        total = total + (quantity * price);
        connection.query(
            "UPDATE products SET product_sales = product_sales + " + (quantity * price) + " WHERE ?",
            [
                {
                    id: id
                }
            ],
            function(err){
                if(err) throw err;
            }
        )
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity -  " + quantity + " WHERE ?", 
            [
            {
                id: id
            }
            ],
            function(err, res) {
            if (err) throw err;
            
            inquirer.prompt({
            
                name: "confirm",
                type: "rawlist",
                message: "\nPurchase Complete! Your total for this item is: $" + (quantity * price).toFixed(2) + ". Would you like to make another purchase?",
                choices: ["Yes", "No"]
            }).then(function(answer) {
                if(answer.confirm === "No") {
                    console.log("\nYour Grand Total was: $" + total.toFixed(2));
                    console.log("Thanks for shopping this us! Please come back soon!")
                    connection.end();
                }
                else {
                    seeTable();
                }
                
            });

            }
        
        );
    }
}
