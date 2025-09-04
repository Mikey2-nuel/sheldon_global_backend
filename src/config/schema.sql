CREATE DATABASE sheldon_global;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  gender ENUM('male', 'female', 'other') NOT NULL,
  dob DATE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  home_address TEXT NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  profile_pic VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL;
ALTER TABLE users
ADD COLUMN role VARCHAR(50) DEFAULT 'user',
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

INSERT INTO users (
  first_name, last_name, email, gender, dob, phone_number,
  home_address, city, state, country, profile_pic, status,
  password, role
)
VALUES (
  "Admin", "User", "admin@sheldonglobal.com", "male", "1990-01-01", "+48792294342",
    "Admin HQ", "Krakow", "Krakow", "Poland", NULL, "active", "Nwaapa1000$", "admin"
);



CREATE TABLE website_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    website_link VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    title VARCHAR(150),
    year INT,
    referral_commission DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO website_settings (
  website_link, name, email, title, year, referral_commission
) VALUES (
  'https://sheldonglobal.io',
  'Sheldon Global Investment',
  'contact@sheldonglobal.com',
  'Sheldon Global Investment Platform',
  2002,
  5.00
);

CREATE TABLE withdrawals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    wallet VARCHAR(255) NOT NULL,
    status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE investments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  plan_slug VARCHAR(255) NOT NULL,
  plan_type VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(20) NOT NULL,
  payment_id VARCHAR(255) NOT NULL,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
