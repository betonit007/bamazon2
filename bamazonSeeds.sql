DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(5, 2),
    stock_quantity INTEGER(100) NOT NULL,
    product_sales DECIMAL(7, 2),
    PRIMARY KEY (id)
);

CREATE TABLE departments(
    department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100),
    over_head_costs DECIMAL(7, 2),
    PRIMARY KEY (department_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('PlayStation 4', 'Electronics', 179.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Slinky', 'Toys', 17.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Beanie Baby', 'Toys', 19.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('BMX Bike', 'Hardgoods', 79.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Nintendo Switch', 'Electronics', 299.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Xbox One', 'Electronics', 189.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Razor Scooter', 'Hardgoods', 59.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Rubiks Cube', 'Toys', 9.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Foosball Table', 'Hardgoods', 189.99, 50, 0.00);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
VALUES('Tickle Me Elmo', 'Toys', 39.99, 50, 0.00);

INSERT INTO departments (department_name, over_head_costs) 
VALUES('Electronics', 4500);

INSERT INTO departments (department_name, over_head_costs) 
VALUES('Toys', 3000);

INSERT INTO departments (department_name, over_head_costs) 
VALUES('Hardgoods', 5500);

