// Import mysql and inquirer packages
var mysql = require('mysql');
var inquirer = require('inquirer');

// Connect to DB...
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

// Connect to DB...
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

// Displays the list of products for sale and includes ID, product name, and price
function displayProducts() {
    // console.log('Displaying products...');
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);

        console.log('WELCOME, CUSTOMER!')
        console.log('');
        console.log('ITEMS FOR SALE')
        console.log('#######################');
        console.log('');
        // Loop through each product in table...
        for (var i = 0; i < res.length; i++) {
            // Print relevant info
            console.log(`ID: ${res[i].item_id} || ${res[i].product_name} || $${res[i].price}`);
            console.log('------------------------------');
        }
        // Once the products are printed to the screen, ask the customer what they want to buy.
        promptCustomer();
    })
};

function promptCustomer() {
    inquirer.prompt([
        {
            type: 'number',
            name: 'purchaseID',
            message: 'Please enter the ID of the item you want to buy',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log('Please enter a number.');
                return false;
            }
        },
        {
            type: 'number',
            name: 'quantity',
            message: 'How many do you want to buy?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log('Please enter a number.');
                return false;
            }
        }
    ]).then(function (answer) {
        // Once the product and quantity are selected, handle the transaction.
        inStockCheck(answer);
    })
};

function inStockCheck(item) {
    // console.log(item.purchaseID);

    connection.query(`SELECT * FROM products WHERE item_id = ${item.purchaseID}`, function (err, res) {
        if (err) throw err;
        // console.log(res[0].stock_quantity);
        // Variable to represent the quantity in stock from DB.
        var amountInStock = res[0].stock_quantity;
        // isInStock will return true if the inventory is greater than or equal to the quantity the customer requests.
        var isInStock = function (item) {
            return item.quantity <= amountInStock;
        }

        // If the item is out of stock, do not carry out the transaction. Log out the message and prompt again for item selection. 
        if (!isInStock(item)) {
            console.log('Insufficient quantity available!');
            promptCustomer();
        } else {
            console.log(`You have ordered ${item.quantity} ${res[0].product_name}s`);
            console.log('Handling transaction.');
            handleTransaction();
        };

    function handleTransaction() {

        // Calculate price (item price * quantity requested)
        var totalPrice = res[0].stock_quantity * item.quantity;
        console.log(`Price: $${totalPrice}`);

        connection.query(`UPDATE products SET ? WHERE ?`, 
        [
            {
                stock_quantity: res[0].stock_quantity - item.quantity
            },
            {
                item_id: item.purchaseID
            }
        ])
        connection.end();
    }

    });

}