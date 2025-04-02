CREATE DATABASE IF NOT EXISTS sns_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sns_app;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    display_name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id VARCHAR(36) PRIMARY KEY,
    posted_by VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE post_likes (
    user_id VARCHAR(36) NOT NULL,
    post_id VARCHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_posted_by ON posts(posted_by);
CREATE INDEX idx_posts_created_at ON posts(created_at);

INSERT INTO users (id, username, password_hash, avatar_url, display_name, created_at) 
VALUES 
('1', 'alex_dev', '$2b$12$1234567890123456789012uQlrZ.Av6Ot7PQoL2/oSs39bNnLY1oi', 'https://avatar.iran.liara.run/public/12', 'Alex Johnson', '2023-01-01 10:00:00'),
('2', 'sarahsmith', '$2b$12$1234567890123456789012uQlrZ.Av6Ot7PQoL2/oSs39bNnLY1oi', 'https://avatar.iran.liara.run/public/24', 'Sarah Smith', '2023-01-02 11:00:00'),
('3', 'tech_ninja', '$2b$12$1234567890123456789012uQlrZ.Av6Ot7PQoL2/oSs39bNnLY1oi', 'https://avatar.iran.liara.run/public/7', 'Michael Chen', '2023-01-15 14:30:00'),
('4', 'code_wizard', '$2b$12$1234567890123456789012uQlrZ.Av6Ot7PQoL2/oSs39bNnLY1oi', 'https://avatar.iran.liara.run/public/35', 'Emma Rodriguez', '2023-02-03 09:15:00'),
('5', 'pixel_artist', '$2b$12$1234567890123456789012uQlrZ.Av6Ot7PQoL2/oSs39bNnLY1oi', 'https://avatar.iran.liara.run/public/42', 'Hiroshi Tanaka', '2023-02-18 16:45:00');

INSERT INTO posts (id, posted_by, content, created_at) VALUES
('101', '1', 'Hello world! This is my first post.', '2023-01-10 12:00:00'),
('102', '2', 'I love this new SNS platform!', '2023-01-11 13:00:00'),
('103', '1', 'Just another day coding...', '2023-01-12 14:00:00'),
('104', '3', 'Where can I get some?', '2023-01-12 14:00:00'),
('105', '5', 'Please email us with details if you can help.', '2023-01-12 14:00:00'),
('106', '4', 'Donate bitcoin', '2023-01-12 14:00:00');

INSERT INTO post_likes (user_id, post_id, created_at) VALUES
('1', '102', '2023-01-11 15:00:00'),
('2', '101', '2023-01-12 16:00:00');
