var mysql = require('mysql');
var inquirer = require('inquirer');

//
var menuChoices = ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'];
var chosenID;
var addedQuantity;
var newProduct = [];


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bieBay'
});

function item(name, department, price, quantity, autograph){
	this.name = name;
	this.department = department;
	this.price = price;
	this.quantity = quantity;
	this.autograph = autograph;
}

console.log('');
    console.log('Welcome to the BieBay Manager Portal. ');
    console.log('');

connectin();



function menu() {

    inquirer.prompt([{
            type: 'list',
            message: 'Select an option: ',
            name: 'menu',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }

    ]).then(function(choice) {
        if (choice.menu === menuChoices[0]) {
            viewProduct();
        } else if (choice.menu === menuChoices[1]) {
            viewLow();
        } else if (choice.menu === menuChoices[2]) {
            addInventory();
        }
        else if (choice.menu === menuChoices[3]){
        	addNew();
        }
    })
}

function connectin () {

    connection.connect(function(error, response) {
        if (error) {
            throw error;
        }
        else {
        	console.log('connected');
        	menu();
        }
 });
 };

 function viewProduct() {
        //console.log("Connected to MySQL server, as ID = " + connection.threadId);
        connection.query("SELECT * FROM `bieBay`;", function(err, response) {
            if (err) {
                console.log(err)
            } else {
                console.log("");
                console.log("Inventory List: ");
                console.log("");
                response.forEach(function(row) {
                    console.log(row.item_id + ". ", row.product_name + ',', "Price: $" + row.price + ',', "Quantity: " + row.stock_quantity)
                    console.log("");
                })
                console.log("");
                menu();
            }
        })
}

function viewLow() {

        //console.log("Connected to MySQL server, as ID = " + connection.threadId);
        connection.query("SELECT * FROM `bieBay` WHERE `stock_quantity` < 5;", function(err, response) {
            if (err) {
                console.log(err)
            } else {
                console.log("");
                console.log("Low Inventory List: ");
                console.log("");
                response.forEach(function(row) {
                    console.log(row.item_id + ". ", row.product_name + ',', "Quantity: " + row.stock_quantity);
                    console.log("");
                })
                console.log("");
                menu();
                //customerOrder();
            }
        })

}

function addInventory() {
    inquirer.prompt([{
        type: 'input',
        message: 'Enter the ID of the item you would like add inventory: ',
        name: 'id',
        validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 13) {
                return true;
            } else {
                console.log('');
				console.log('');
                console.log("Enter a valid ID. ");
                console.log('');
				console.log('');
                return false;
            }
        }
    }]).then(function(choice) {
        chosenID = choice.id;
        console.log("");
        console.log('Item found.');
        console.log("");
        quantityToAdd();

    })
};

function quantityToAdd() {
    inquirer.prompt([
    		{
            type: 'input',
            message: 'Enter quantity to add: ',
            name: 'quantity',
            validate: function(value) {
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
        }]).then(function(quantity) {
                addedQuantity = quantity.quantity;
                console.log(addedQuantity);
                connection.query('UPDATE `bieBay` SET `stock_quantity` = `stock_quantity` +' + addedQuantity + ' WHERE `item_id` =' + chosenID + ';', function(err, respone) {
                    if (err) {
                        console.log(err);
                        console.log('');
                        console.log('Something went wrong. ');
                    } else {
                        console.log('');
                        console.log('Inventory updated. ');
                        menu();
                    }
                });
            });
};

function addNew () {
	console.log('');
	console.log('Enter information for new item.');
	console.log('');
	inquirer.prompt([
	{
		type: 'input',
		message: 'Enter product name: ',
		name: 'product_name'
	},
	{
		type: 'input',
		message: 'Enter department name: ',
		name: 'department_name'
	},
	{
		type: 'input',
		message: 'Enter product price: ',
		name: 'price'
	},
	{
		type: 'input',
		message: 'Enter product quantity: ',
		name: 'stock_quantity',
		validate: function(value){
			if (isNaN(value) === false && parseInt(value) > 0) {
					return true;
				} else {
				console.log('');
				console.log('Please enter a valid number.');
				console.log('');
				return false;
			}
		}
	},
	{
		type: 'confirm',
		message: 'Did Justin autograph it?: ',
		name: 'autograph',
		default: false,
		validate: function (value) {
			if (value == 'y') {
				return true;
			}
			else {
				return false;
			}

		}
	}]).then(function(info){
		newProduct = [];
		var newItem = new item (
			info.product_name,
			info.department_name,
			info.price,
			info.stock_quantity,
			info.autograph
		);
		newProduct.push(newItem);
		connection.query("INSERT INTO `bieBay` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`, `autographed`) VALUES (NULL, '" + newProduct[0].name + "', '" + newProduct[0].department + "', " + newProduct[0].price + ', ' + newProduct[0].quantity + ', ' + newProduct[0].autograph + ');', function (err, response) {
			if (err) {
				console.log(err);
			}
			else {
				console.log('');
				console.log('ITEM SUCESSFULLY ADDED. ');
				console.log('');
				menu();
			}
		})
		})
}