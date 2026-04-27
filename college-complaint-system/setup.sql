CREATE DATABASE IF NOT EXISTS college_complaints;
USE college_complaints;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('Hostel', 'Academic', 'Infrastructure', 'Other') NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Default admin user (password: admin123)
-- Hash generated via password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@college.edu', '$2y$10$wE9q.u45654zH8GfO/w2.emXhT9F0eN60sW6lR8k5p.Y8d.L2XkEa', 'admin')
ON DUPLICATE KEY UPDATE name=name;
