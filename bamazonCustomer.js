var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "5eLUrWj=$J",
    database: "bamazondb"
})

connection.connect(function (err) {
    if (err) throw err;
    storeFront();
    // console.log("Connected as id: " + connection.threadId);
})

// storeFront function used as an opening to the store. "Yes" come in. "No" disconnect from server.
function storeFront() {
    inquirer.prompt({
            name: "invite",
            type: "list",
            message: "Would you like to go shopping?",
            choices: [
                "Yes",
                "No"
            ]
        })
        .then(function (answer) {
            switch (answer.invite) {
                case "Yes":
                    goShopping();
                    break;
                case "No":
                    console.log("Thanks for stopping by. We'll be here when you need us.");
                    connection.end();

            }
        });
};


// goShopping function that lists inventory and prompts interaction with consumer.
var goShopping = function () {
    var queryStock = `SELECT item_id, product_name, price FROM bamazondb.products`;
    connection.query(queryStock, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`\n------------------------------\nItem ID:\t${res[i].item_id}\nProduct Name:\t${res[i].product_name}\nPrice:\t\t${res[i].price} USD\n`)
        }
        // price does not format correctly with a two digit decimal. Looks fine in mysql, but when logging, drops the final zero
        inquirer.prompt([
            //The app should then prompt users with two messages.
            //* The first should ask them the ID of the product they would like to buy.
            //* The second message should ask how many units of the product they would like to buy.
            {
                type: "input",
                message: "Please enter the ID of the item you would like to purchase.",
                name: "item_id",
                filter: Number,
                default: 0
            },
            {
                type: "input",
                message: "How many would you like?",
                name: "quantity",
                filter: Number,
                default: 0
            },

        ]).then(function (input) {
            var item = input.item_id;
            var quantity = input.quantity;

            // var queryShop = "SELECT * FROM products WHERE ?";
            var queryShop = `SELECT * FROM products WHERE ?`;
            connection.query(queryShop, {
                    item_id: item
                }, function (err, data) {
                    if (err) throw err;

                    if (data.length === 0) {
                        console.log('Error: Invalid Item ID. Please select an item id from the store inventory.');
                        displayInventory();

                    } else {
                        var productData = data[0];

                        if (quantity === 0) {
                            console.log('Nothing from nothing leaves nothing. You gotta have something.');
                            goShopping();

                        } else if (quantity > 0 && quantity <= productData.stock_quantity) {
                            console.log("We have that in stock. Hang on a minute and we'll get it for you.");

                            // update query to take item from inventory and update the database
                            var queryUpdate = `UPDATE products SET stock_quantity = ${productData.stock_quantity - quantity} WHERE item_id = ${item}`;

                            connection.query(queryUpdate, function (err, data) {
                                if (err) throw err;

                                console.log("Thank you! Your order is being processed.");
                                connection.end();
                            });

                        } else {
                            console.log("We don't have that in stock at the moment.")
                            console.log("\n-------------------------------\n");
                            goShopping();
                        }

                    };

                }



            )
        })
    });




};