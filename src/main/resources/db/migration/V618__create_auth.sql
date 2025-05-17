CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       status VARCHAR(20) NOT NULL CHECK (status IN ('client', 'prestataire'))
);

INSERT INTO users (username, password, status)
VALUES
    ('client1', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH/rH8Lb6FciUz/.5fajl6l.4QwZAgK', 'client'),
    ('pro1', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MH/rH8Lb6FciUz/.5fajl6l.4QwZAgK', 'prestataire');
