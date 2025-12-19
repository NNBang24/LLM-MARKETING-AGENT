-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS marketing_db;
USE marketing_db;

-- 2. Bảng nội dung AI tạo
CREATE TABLE generated_contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_info JSON NOT NULL COMMENT 'Tham số đầu vào',
    content TEXT NOT NULL COMMENT 'Nội dung AI tạo',
    status VARCHAR(50) DEFAULT 'Generated',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Bảng đánh giá
CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    rating INT NOT NULL,
    feedback TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_content
      FOREIGN KEY (content_id)
      REFERENCES generated_contents(id)
      ON DELETE CASCADE
);
