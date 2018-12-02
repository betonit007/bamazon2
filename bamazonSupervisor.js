var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Nyjets$41',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    supervisorCommands();
})


/////////////////functions/////////////////////////////////////

function supervisorCommands() {
    inquirer.prompt([
        {
        name: 'which',
        type: 'list',
        message: '\nPlease make a selection: ',
        choices: ['View Sales by Department', 'Create new Department', 'Exit Program']
        }
    ]).then(function(answer) {
        if (answer.which === 'View Sales by Department') {
            departmentSales();
        }
        if (answer.which === 'Create new Department') {
            createNewDept();
        }
        if (answer.which === 'Exit Program') {
            connection.end();
        }
    })
}

function departmentSales() {
    connection.query("SELECT * FROM (SELECT department_id, department_name, over_head_costs from departments) AS dept LEFT JOIN (SELECT department_name, SUM(product_sales) AS product_sales from products GROUP BY department_name) AS prod ON prod.department_name = dept.department_name",
    function(err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['dept_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'],
            colWidths: [10, 20, 20, 20, 20]
        });
        for (i in res) {
            var total =  (res[i].product_sales - res[i].over_head_costs).toFixed(2);
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, total]
            );
        }
        console.log(table.toString());
        supervisorCommands();
    }       
)

}

function createNewDept() {
    inquirer.prompt([
        {
            name: 'dept',
            type: 'input',
            message: 'Please enter a name for the new Department.'
        },
        {
            name: 'costs',
            type: 'input',
            message: 'Please enter the overhead costs for this department.'
        }
    ]).then(function(answer) {
        connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name: answer.dept,
            over_head_costs: answer.costs
        },
        function(err) {
            if(err) throw err;
            console.log("\nNew department, " +answer.dept+ " added to database.");
            supervisorCommands();
        }
        )
    })
}