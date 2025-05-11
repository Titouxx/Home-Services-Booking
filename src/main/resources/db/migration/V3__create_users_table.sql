CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('client', 'prestataire'))
);
