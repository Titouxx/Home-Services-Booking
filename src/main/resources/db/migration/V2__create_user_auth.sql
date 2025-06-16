CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       status VARCHAR(20) NOT NULL CHECK (status IN ('client', 'prestataire', 'administrateur')),
                       first_name VARCHAR(100),
                       last_name  VARCHAR(100),
                       email      VARCHAR(255),
                       age INTEGER
);

INSERT INTO users (username, password, status)
VALUES
    ('admin', '$2a$10$bQqtw70ocnE/g/AYDro6wexNoR77mvTY9mfoPyhDJ/wyNDh8AZdmm', 'administrateur');
