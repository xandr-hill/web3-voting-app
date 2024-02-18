-- Створення бази даних, якщо вона ще не існує
CREATE DATABASE IF NOT EXISTS my_db;

-- Використання бази даних
USE my_db;

-- Створення таблиці для реєстрації виборців
CREATE TABLE IF NOT EXISTS voter_registration (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registrationDateTime DATETIME,
  walletAddress VARCHAR(255) NOT NULL,
  numberOfTokens INT NOT NULL
);

-- Створення таблиці для голосування
CREATE TABLE IF NOT EXISTS vote_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  voteDateTime DATETIME,
  walletAddress VARCHAR(255) NOT NULL,
  voteResult VARCHAR(10) NOT NULL
);
