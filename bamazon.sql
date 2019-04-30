CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50),
price DECIMAL(10,2),
stock_quantity INTEGER(10),
Primary key (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Cowboy Video Game", "Toys", 15, 30);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Marimba", "Musical Instruments", 30, 5);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Charcoal Grill", "Outdoors", 20, 6);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Instant Campfire", "Outdoors", 7, 17);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Garden Hose", "Outdoors", 10, 23);
SELECT * FROM products;