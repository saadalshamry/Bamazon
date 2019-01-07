var i = require('inquirer');
var mysql = require('mysql');
var cTable = require('console.table');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect();
connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    console.table(results)
    buyItem()
});

// choose item function
function buyItem() {
    i.prompt([{
            name: "id",
            message: "Please enter the id of the item you want to buy"
        },
        {
            name: "quantity",
            message: "Please enter quantity:"
        }
    ]).then(function (answers) {
        connection.query('SELECT * FROM products WHERE id = ?', answers.id, function (err, res) {
            if (res[0].stock_quantity > answers.quantity) {
                connection.query('UPDATE products  SET stock_quantity= stock_quantity - ? WHERE id = ?', [answers.quantity, answers.id], function (err) {
                    if (err) throw err;
                    console.log('Your order has been placed and your total is', res[0].price * answers.quantity, "$");
                    connection.end();
                })
            } else {
                console.log('Insufficient quantity!')
                buyItem();
            }
        });
    })
}