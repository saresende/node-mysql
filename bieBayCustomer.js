var mysql = require('mysql');
var inquirer = require('inquirer');
var requestedItem;

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bieBay'
});

connection.connect(function (error, response) {
	if (error) {
		throw error;
	}
		console.log("Connected to MySQL server, as ID = " + connection.threadId);
		connection.query("SELECT * FROM `bieBay`", function(err, response) {
			if (err) {
				console.log(err)
			}
			else {
				console.log('Hello! Welcome to Justin Bieber super fan Mega Online store. This is your one stop shop to all your Justin Bieber needs. You butter Beliebe we will have all of your needs and desires.');
				console.log("");
				console.log("Items available for sale: ");
				response.forEach(function (row) {
					console.log(row.item_id + ".) ", row.product_name, "................$" + row.price)
					
				})
			console.log("");
			customerOrder();
			}
		})
});

function customerOrder () {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Enter the ID number of the item you would like: ',
			name: 'id',
			validate: function(value){
				if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 11) {
					return true;
				} else {
				console.log("");
				console.log("Hmmm....I couldn't find that item. Try entering another value.");
				return false;
			}
			}
		}
		]).then(function(answer) {
			requestedItem = parseInt(answer.id);
			console.log("");
			console.log('Ok! Let me check that for you.');
			console.log(requestedItem);
			//orderQuantity();
		})
		
}



