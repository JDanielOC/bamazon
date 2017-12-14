var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"5eLUrWj=$J",
    database:"bamazondb"
})

connection.connect(function(err){
    if (err) throw err;
    storeFront();
    // console.log("Connected as id: " + connection.threadId);
})

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
    .then(function(answer) {
        switch (answer.invite) {
            case "Yes": itemsForSale();
            break;
            case "No": console.log("Sounds good. We'll be here when you need us.") /*&& process.exit()*/;

        }
    });
};

var itemsForSale = function(){
    var query = "SELECT * FROM bamazondb.products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].products);
        }
    });
};

// var shopping = function () {
//     inquirer.prompt({
//         name: "purchaseItem",
//         type: "rawlist",
//         message: "What would you like to purchase?"
//     })
// }