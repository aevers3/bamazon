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
    password: "Greenduck",
    database: "bamazon"
});

// Connect to DB...
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // Once connection to DB is established, display the menu.
    displayMenu();
});

// First thing displayed to user
function displayMenu() {
    console.log('WELCOME, MANAGER!');
    console.log('');
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(answer => {
        // console.log(answer);
        switch (answer.action) {
            case 'View Products for Sale':
                displayProductsManager();
                break;

            case 'View Low Inventory':
                displayLowInventory();
                break;

            case 'Add to Inventory':
                addToInventory();
                break;

            case 'Add New Product':
                addNewProduct();
                break;

            default:
                displayProductsManager();
                break;
        }
    });
}

function displayProductsManager() {
    console.log('Displaying products...');
    // Query DB to bring back products...
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        console.log('#######################');
        console.log('');
        console.log('ITEMS FOR SALE');
        console.log('');
        // Loop through each product in table...
        for (var i = 0; i < res.length; i++) {
            // Print relevant info
            console.log(`ID: ${res[i].item_id} || ${res[i].product_name} || $${res[i].price} || ${res[i].stock_quantity} in stock.`);
            console.log('-----------------------------------------------');
        };
        // console.log(res)
        connection.end();
        return res;
    });
};

function displayLowInventory() {
    console.log('Displaying low inventory...');
    // Query DB and bring back items with a stock_quantity of 5 or less.
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        // console.log(res);
        console.log('#######################');
        console.log('');
        console.log('LOW INVENTORY ITEMS');
        console.log('');
        // Loop through each product in table...
        for (var i = 0; i < res.length; i++) {
            // Print relevant info
            console.log(`ID: ${res[i].item_id} || ${res[i].product_name} || $${res[i].price}`);
            console.log(`We have ${res[i].stock_quantity} in stock.`)
            console.log('------------------------------');
        };
        connection.end();
    })
};

// Allows a manager to restock an item.
function addToInventory() {
    // First grab a reference to the DB. We will use this res to reference the current inventory when we add new inventory.
    connection.query("SELECT * FROM Products", function (err, res) {
        if (err) throw err;
        // Get the ID to update, as well as the quantity to add. These must both be numbers.
        inquirer.prompt([
            {
                name: 'restockItem',
                type: 'number',
                message: 'Please enter the ID number of the product you\'d like to restock',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log('Please enter a number.');
                    return false;
                }
            },
            {
                name: 'restockQuantity',
                type: 'number',
                message: 'How many of this item would you like to add?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    console.log('Please enter a number.');
                    return false;
                }
            }
        ]).then(function (answer) {
            // Once we have the answer, we will query the DB again to update inventory using data from user answer.
            // console.log(answer);
            // console.log(res);
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: res[answer.restockItem - 1].stock_quantity + answer.restockQuantity
                    },
                    {
                        item_id: answer.restockItem
                    }
                ])
                // Log out success message.
                console.log(`Inventory updated for ${res[answer.restockItem - 1].product_name} by ${answer.restockQuantity}!`);

                // The comment line below will log out the math operation taking place. Keeping here for possible reference.
                // console.log(`${res[answer.restockItem - 1].stock_quantity} + ${answer.restockQuantity}`);
                
                // Once we perform the operations, display the updated product list.
                console.log('');
                displayProductsManager();
            })
    });
}

function addNewProduct() {
    console.log('Adding New Product...');
    inquirer.prompt([
        {
            name: 'newProductName',
            type: 'input',
            message: 'Enter the name of the new product.'
        }, {
            name: 'newProductDepartment',
            type: 'list',
            message: 'Choose a department for the new product',
            choices: ['Toys', 'Kitchen', 'Musical Instruments', 'Outdoors']
        }, {
            name: 'newProductPrice',
            type: 'number',
            message: 'Enter the price for the new product.',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log('Please enter a number.');
                return false;
            }
        }, {
            name: 'newProductQuantity',
            type: 'number',
            message: 'How many do you want to add?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log(' Please enter a number.');
                return false;
            }
        }
    ]).then(function(answer) {
        // console.log(answer);
        var query = connection.query("INSERT INTO products SET ?", 
        {
            product_name: answer.newProductName,
            department_name: answer.newProductDepartment,
            price: answer.newProductPrice,
            stock_quantity: answer.newProductQuantity
        }, 
        function(err,res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            displayProductsManager();
        })
    })




    
};