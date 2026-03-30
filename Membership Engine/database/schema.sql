-- Drop database if exists
DROP DATABASE IF EXISTS membership_engine;
CREATE DATABASE membership_engine;
USE membership_engine;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('User', 'Admin') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plans table (Basic, Standard, Premium)
CREATE TABLE plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Active', 'Expired') DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- Insert Default Plans
INSERT INTO plans (name, price, duration_days) VALUES 
('Basic Plan', 9.99, 30),
('Standard Plan', 19.99, 90),
('Premium Plan', 49.99, 365);

-- Insert Default Admin User (password is 'admin123' if hashed, but we'll register it via API or insert hash manually later)
-- We will create the admin via the application to ensure password gets hashed properly.
