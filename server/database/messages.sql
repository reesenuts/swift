CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message_id VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    message_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted',
    error_code VARCHAR(50),
    error_message TEXT,
    price DECIMAL(10,4),
    network VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_message_id (message_id),
    INDEX idx_phone_number (phone_number),
    INDEX idx_status (status)
); 