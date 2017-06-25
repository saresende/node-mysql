var mysql = require('mysql');
var inquirer = require('inquirer');
var menuChoices = ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'];

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bieBay'
});


menu();

function menu () {

console.log('');
console.log('Welcome to the BieBay Manager Portal. ');
console.log('');
	inquirer.prompt([
	{
		type: 'list',
		message: 'Select an option: ',
		name: 'menu',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
	}

		]).then(function(choice) {
			if (choice.menu === menuChoices[0]){
				viewProduct();
			}
			else if (choice.menu === menuChoices[1]){
				viewLow();
			}
			/*else if (choice.menu === menuChoices[2]){
				addInventory();
			}
			else if (choice.menu === menuChoices[3]){
				addNew();
			}*/
		})
}

function viewProduct () {
connection.connect(function (error, response) {
	if (error) {
		throw error;
	}
		//console.log("Connected to MySQL server, as ID = " + connection.threadId);
		connection.query("SELECT * FROM `bieBay`;", function(err, response) {
			if (err) {
				console.log(err)
			}
			else {
				console.log("");
				console.log("Inventory List: ");
				console.log("");
				response.forEach(function (row) {
					console.log(row.item_id + ". ", row.product_name +',', "Price: $" + row.price+',', "Quantity: " + row.stock_quantity)
					console.log("");
				})
			console.log("");
			//customerOrder();
			}
		})
});
}

function viewLow () {

connection.connect(function (error, response) {
	if (error) {
		throw error;
	}
		//console.log("Connected to MySQL server, as ID = " + connection.threadId);
		connection.query("SELECT * FROM `bieBay` WHERE `stock_quantity` < 5;", function(err, response) {
			if (err) {
				console.log(err)
			}
			else {
				console.log("");
				console.log("Low Inventory List: ");
				console.log("");
				response.forEach(function (row) {
					console.log(row.item_id + ". ", row.product_name +',', "Quantity: " + row.stock_quantity);
					console.log("");
				})
			console.log("");
			//customerOrder();
			}
		})
});

}