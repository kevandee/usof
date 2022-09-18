CREATE DATABASE IF NOT EXISTS usof_backend;
CREATE USER IF NOT EXISTS 'achaika'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON usof_backend.* TO 'achaika'@'localhost';

USE usof_backend;

CREATE TABLE IF NOT EXISTS users
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    profile_picture VARCHAR(100) NOT NULL DEFAULT 'profile_pictures/default.png',
    rating INT DEFAULT 0,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

INSERT INTO users(login, password, full_name, email, role) VALUES ('admin', 'admin', 'Anton Chaila', 'achayka95@gmail.com', 'admin');

CREATE TABLE IF NOT EXISTS posts
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(256) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    content TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

INSERT INTO posts(author_id, title, content) VALUES (1, "test post 1", "content of test post");
INSERT INTO posts(author_id, title, content) VALUES (1, "test post 2", "content of test post");
INSERT INTO posts(author_id, title, content) VALUES (1, "test post 3", "content of test post");

CREATE TABLE IF NOT EXISTS categories
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO categories(title, description) VALUES ("category 1", "description 1");
INSERT INTO categories(title, description) VALUES ("category 2", "description 2");
INSERT INTO categories(title, description) VALUES ("category 3", "description 3");

CREATE TABLE IF NOT EXISTS posts_categories
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

INSERT INTO posts_categories(post_id, category_id) VALUES (1, 1);
INSERT INTO posts_categories(post_id, category_id) VALUES (1, 3);


CREATE TABLE IF NOT EXISTS comments
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    publish_date VARCHAR(128) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts_comments 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    comment_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    publish_date VARCHAR(64) NOT NULL,
    type BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts_likes 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    like_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (like_id) REFERENCES likes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments_likes 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    like_id INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (like_id) REFERENCES likes(id) ON DELETE CASCADE
);
