var mysql = require('mysql');
var inquirer = require('inquirer');
var requestedItem;
var requestedQuantity;
var itemArray = [];
var cost;

function item(id, name, price, quantity, autograph){
	this.id = id;
	this.name = name;
	this.price = price;
	this.quantity = quantity;
	this.autograph = autograph;
}

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bieBay'
});

connectin();
function connectin () {
connection.connect(function (error, response) {
	if (error) {
		throw error;
	}
	else {
		introItems();
	}
});
};


function introItems () {

		//console.log("Connected to MySQL server, as ID = " + connection.threadId);
		connection.query("SELECT * FROM `bieBay`", function(err, response) {
			if (err) {
				console.log(err)
			}
			else {
				console.log('Hello! Welcome to Justin Bieber super fan Mega Online store. This is your one stop shop to all your Justin Bieber needs. You butter Beliebe we will have all of your Justin Bieber related desires.');
				console.log("");
				console.log("Items available for sale: ");
				response.forEach(function (row) {
					console.log(row.item_id + ".) ", row.product_name, "................$" + row.price)
					
				})
			console.log("");
			customerOrder();
			}
		})

};

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
			requestedItem = answer.id;
			console.log("");
			console.log('Ok! Let me check that for you.');
			//console.log(requestedItem);
			orderQuantity();
		})
		
}

function orderQuantity () {
		inquirer.prompt([
		{
			type: 'input',
			message: 'Enter a desired quantity: ',
			name: 'quantity',
			validate: function(value){
			if (isNaN(value) === false && parseInt(value) > 0) {
					return true;
				} else {
				console.log('');
				console.log('');
				console.log('Please enter a valid number.');
				console.log('');
				console.log('');
				return false;
			}
		}
		}
		]).then(function(answer) {
			requestedQuantity = answer.quantity; 
			//console.log(requestedQuantity);
			connection.query('SELECT * FROM `bieBay` WHERE `item_id` ='+ requestedItem, function (error, response){
				if (error){
					console.log(error);

				}
				else {
					itemArray = [];
					//console.log(response[0].product_name);
					
					var newItem = new item (response[0].item_id, response[0].product_name, response[0].price, response[0].stock_quantity, response[0].autograph);
					//console.log(newItem);
					itemArray.push(newItem);
					//console.log(requestedQuantity);
					//console.log(itemArray[0].quantity);

					if (requestedQuantity <= itemArray[0].quantity) {
						console.log("");
						console.log('We can process your order! :) ')
						processOrder();


					}
					else if (itemArray[0].quantity <= 0){
						console.log("");
						console.log('This item is currently out of stock! Try again another time.');
						nextOrder();
					}
					else {
						console.log("");
						console.log('Insufficient quantity. Try again.');
						console.log("");
						console.log('Currently we have '+ itemArray[0].quantity +' unit(s) of this item available.');
						console.log("");
						orderQuantity();
					}
					//processQuantity();

					
				}
				
			})
			console.log('')
		})
}

function processOrder () {
	itemArray[0].quantity -= requestedQuantity;
	cost = requestedQuantity * itemArray[0].price;
	//console.log(itemArray[0].quantity);
	connection.query('UPDATE `bieBay` SET `stock_quantity` =' + itemArray[0].quantity + ' WHERE `item_id` =' + requestedItem, function (err, respone){
		if (err) {
			console.log(err);
			console.log('');
			console.log('Sorry! Something went wrong. :(');
		}
		else {
			console.log('');
			console.log('Order sucessful! Your card as been charged: $' + cost);
			console.log('');
			console.log('Your product(s) will be mailed to the address on file.');
			console.log('');
			console.log('Justin Bieber told me to tell you "Thanks dawg."');
			console.log('');
			nextOrder();
		}
	})

}

function nextOrder () {
	inquirer.prompt([

	{
		type: 'confirm',
		message: 'Would you like to place another order?',
		name: 'confirm',
		default: true,
		validate: function(value){
			if (value == 'y' || value == 'n' || value == 'yes' || value == 'no') {
				return true;
			}
			else {
				return false;
			}
		}
	}
		]).then(function(answer) {
			if (answer.confirm === true) {
				console.log('');
				console.log('Great choice! I know, these prices are unbeliebable. =D');
				console.log('');
				console.log('');
				introItems();
			}
			else {
				console.log('');
				console.log("That's OK. Maybe you ran out money. Maybe you can't beliebe the deals. But when you're ready, come back any time.");
				console.log('');
				console.log('Justin Bieber loves you. <3');
			}
		})
}






