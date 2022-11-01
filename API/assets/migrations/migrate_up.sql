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

INSERT INTO users(login, password, full_name, email, role) VALUES ('administrator', '08b09f99ddc6c3376b370458c2cbbeb25123f1e6a3761dd4e16e8d8ba39a', 'Anton Chaila', 'administrator@gmail.com', 'admin');
INSERT INTO users(login, password, full_name, email, role) VALUES ('user1', '099b1844845fdf71631cf2cb08ed3f3a24671a29168705eb509be67ca636', 'user1', 'user1@gmail.com', 'user');
INSERT INTO users(login, password, full_name, email, role) VALUES ('user2', '099b1844845fdf71631cf2cb08ed3f3a24671a29168705eb509be67ca636', 'user2', 'user2@gmail.com', 'user');
INSERT INTO users(login, password, full_name, email, role) VALUES ('user3', '099b1844845fdf71631cf2cb08ed3f3a24671a29168705eb509be67ca636', 'user3', 'user3@gmail.com', 'user');
INSERT INTO users(login, password, full_name, email, role) VALUES ('user4', '099b1844845fdf71631cf2cb08ed3f3a24671a29168705eb509be67ca636', 'user4', 'user4@gmail.com', 'user');

CREATE TABLE IF NOT EXISTS posts
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT,
    title VARCHAR(256) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    publish_date DECIMAL(15) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO posts(author_id, title, publish_date, content) VALUES (1, "test post 1", "1663592477255", "content of test post");
INSERT INTO posts(author_id, title, publish_date, content) VALUES (1, "test post 2", "1663593477255", "content of test post");
INSERT INTO posts(author_id, title, publish_date, content) VALUES (2, "test post 3", "1663594477255", "content of test post");
INSERT INTO posts(author_id, title, publish_date, content) VALUES (3, "test post 3", "1663595477255", "content of test post");
INSERT INTO posts(author_id, title, publish_date, content) VALUES (4, "test post 3", "1663596477255", "content of test post");

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
INSERT INTO posts_categories(post_id, category_id) VALUES (1, 2);
INSERT INTO posts_categories(post_id, category_id) VALUES (2, 2);
INSERT INTO posts_categories(post_id, category_id) VALUES (3, 1);
INSERT INTO posts_categories(post_id, category_id) VALUES (4, 3);
INSERT INTO posts_categories(post_id, category_id) VALUES (5, 2);


CREATE TABLE IF NOT EXISTS comments
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT,
    publish_date DECIMAL(15) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO comments(author_id, publish_date, content) VALUES (1, "1663598477255", "comment content 1");
INSERT INTO comments(author_id, publish_date, content) VALUES (2, "1663598577255", "comment content 2");
INSERT INTO comments(author_id, publish_date, content) VALUES (3, "1663598677255", "comment content 3");
INSERT INTO comments(author_id, publish_date, content) VALUES (1, "1663598477255", "comment content 4");
INSERT INTO comments(author_id, publish_date, content) VALUES (1, "1663598472255", "comment content 5");

CREATE TABLE IF NOT EXISTS posts_comments 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    comment_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

INSERT INTO posts_comments(post_id, comment_id) VALUES (1, 1);
INSERT INTO posts_comments(post_id, comment_id) VALUES (1, 2);
INSERT INTO posts_comments(post_id, comment_id) VALUES (1, 3);
INSERT INTO posts_comments(post_id, comment_id) VALUES (2, 4);
INSERT INTO posts_comments(post_id, comment_id) VALUES (3, 5);

CREATE TABLE IF NOT EXISTS likes
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT,
    publish_date DECIMAL(15) NOT NULL,
    type BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO likes(author_id, publish_date) VALUES(1, "1663593977255");
INSERT INTO likes(author_id, publish_date) VALUES(2, "1663593977255");
INSERT INTO likes(author_id, publish_date) VALUES(3, "1663593977255");
INSERT INTO likes(author_id, publish_date) VALUES(4, "1663593977255");
INSERT INTO likes(author_id, publish_date) VALUES(5, "1663593977255");
INSERT INTO likes(author_id, publish_date) VALUES(1, "1663595977255");
INSERT INTO likes(author_id, publish_date) VALUES(2, "1663595977255");
INSERT INTO likes(author_id, publish_date) VALUES(3, "1663595977255");
INSERT INTO likes(author_id, publish_date) VALUES(4, "1663595977255");
INSERT INTO likes(author_id, publish_date) VALUES(5, "1663595977255");

CREATE TABLE IF NOT EXISTS posts_likes 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    like_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (like_id) REFERENCES likes(id) ON DELETE CASCADE
);

INSERT INTO posts_likes(post_id, like_id) VALUES (1, 1);
INSERT INTO posts_likes(post_id, like_id) VALUES (1, 2);
INSERT INTO posts_likes(post_id, like_id) VALUES (1, 3);
INSERT INTO posts_likes(post_id, like_id) VALUES (2, 4);
INSERT INTO posts_likes(post_id, like_id) VALUES (2, 5);

CREATE TABLE IF NOT EXISTS comments_likes 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    like_id INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (like_id) REFERENCES likes(id) ON DELETE CASCADE
);


INSERT INTO comments_likes(comment_id, like_id) VALUES (1, 6);
INSERT INTO comments_likes(comment_id, like_id) VALUES (1, 7);
INSERT INTO comments_likes(comment_id, like_id) VALUES (1, 8);
INSERT INTO comments_likes(comment_id, like_id) VALUES (2, 9);
INSERT INTO comments_likes(comment_id, like_id) VALUES (2, 10);


CREATE TABLE IF NOT EXISTS comments_comments 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_comment_id INT NOT NULL,
    comment_id INT NOT NULL,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
