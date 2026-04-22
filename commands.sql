\d
CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
INSERT INTO blogs (author, url, title) VALUES ('Rain Veskus', 'www.postgres.com', 'Testing realational database');
INSERT INTO blogs (url, title) VALUES ('www.mongodb.com', 'Is SQL better than Mongo?');
SELECT * FROM blogs;