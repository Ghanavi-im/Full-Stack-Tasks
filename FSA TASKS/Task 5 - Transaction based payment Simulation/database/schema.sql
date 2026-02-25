CREATE DATABASE payment_simulator;
USE payment_simulator;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    balance DECIMAL(10,2)
);

CREATE TABLE merchants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    balance DECIMAL(10,2)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    merchant_id INT,
    amount DECIMAL(10,2),
    status VARCHAR(20),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users(name, balance) VALUES ('Kaviya',5000);
INSERT INTO merchants(name, balance) VALUES ('Amazon',10000);
