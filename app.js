var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: ""
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function to get user input as to what and how much they would like to purchase
let chooseProduct = () => {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter the id number of the item you would like to purchase.",
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?",
        }])
        .then(function (answer) {
            // pulls the item which was selected
                connection.query("SELECT * FROM products WHERE item_id = " + answer.id, function (err, results) {
                    if (err) throw err;
                    console.log('Available units: ' +results[0].stock_quantity)
                    if (results[0].stock_quantity > answer.quantity) {
                        // updates SQL database removing the number of chosen products to purchase
                        connection.query("UPDATE products SET stock_quantity = (stock_quantity -" + answer.quantity + ")WHERE item_id = " + answer.id, function (err, results) {
                            console.log(results)
                            if (err) throw err;
                            console.log('Your purchase was succesfull!');
                            connection.end();
                        });
                    } else {
                        console.log('Order is too big try again!');
                        connection.end()
                    }

                });
        })
};




// start function that runs when the app is run in node
let start = () => {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log(results)
        chooseProduct();
    }
    )
}