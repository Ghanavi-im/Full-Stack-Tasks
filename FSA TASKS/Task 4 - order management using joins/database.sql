-- Create Database
CREATE DATABASE IF NOT EXISTS order_management;
USE order_management;

-- Customers Table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50)
);

-- Products Table
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100),
    price DECIMAL(10,2)
);

-- Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    product_id INT,
    quantity INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Insert Customers
INSERT INTO customers (name,email,city) VALUES
('Arun','arun@gmail.com','Chennai'),
('Priya','priya@gmail.com','Madurai'),
('Rahul','rahul@gmail.com','Coimbatore');

-- Insert Products
INSERT INTO products (product_name,price) VALUES
('Laptop',60000),
('Phone',20000),
('Headphones',2000),
('Keyboard',1500);

-- Insert Orders
INSERT INTO orders (customer_id,product_id,quantity,order_date) VALUES
(1,1,1,'2024-02-01'),
(1,3,2,'2024-02-10'),
(2,2,1,'2024-03-01'),
(2,3,3,'2024-03-05'),
(2,4,2,'2024-03-10'),
(3,4,5,'2024-03-15');
