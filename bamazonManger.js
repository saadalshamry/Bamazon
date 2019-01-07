var i = require('inquirer');
var mysql = require('mysql');
var cTable = require('console.table');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

i.prompt([{
    name: "task",
    type: "list",
    choices: ['View Products for sale', "View Low Inventory", "Add to Inventory", "Add New Product"],
    message: "How can I help you?"
}]).then(function (answers) {
    switch (answers.task) {
        case "View Products for sale":
            connection.query('SELECT * FROM products', function (err, res) {
                if (err) throw err;
                console.table(res);
            })
            break;

        case 'View Low Inventory':
            connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
                if (err) throw err;
                console.table(res);
                connection.end()
            })
            break;
        case "Add New Product":
            i.prompt([{
                    name: "name",
                    message: "please enter product name"
                },
                {
                    name: "department",
                    message: "please enter department name"
                },
                {
                    name: "quantity",
                    message: "please enter stock quantity"
                },
                {
                    name: "price",
                    messagea: "please enter price"
                }
            ]).then(function (answers) {
                connection.query('INSERT INTO products (product_name, department_name, stock_quantity, price) VALUES (?,?,?,?)', [
                    answers.name, answers.department, answers.quantity, answers.price
                ], function (err) {
                    if (err) throw err;
                    console.log("Product added successfully");
                    connection.end()
                })
            })
            break;
        case "Add to Inventory":
            connection.query('SELECT * FROM products', function (err, res) {
                if (err) throw err;
                console.table(res);
                i.prompt([{
                    name: "id",
                    message: "enter the id of the item you want to add to"
                }, {
                    name: "quantity",
                    message: "enter quantity"
                }]).then(function (answers) {
                    connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [answers.quantity, answers.id], function (err) {
                        if (err) throw err;
                        console.log('item has been updated')
                        connection.end()
                    })
                })
            })

            break;





    }
})