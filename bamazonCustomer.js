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
    console.log("Connected as id: "+connection.threadId);
})

var start = function(){
    inquirer.prompt({
        name:"purchaseItem",
        type:"rawlist",
        message:"What would you like to purchase?"
    })
}