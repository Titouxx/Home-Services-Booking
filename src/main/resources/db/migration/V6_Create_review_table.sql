CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    service_id BIGINT REFERENCES services(id),
    provider_id BIGINT REFERENCES users(id),
    user_id BIGINT REFERENCES users(id), -- celui qui laisse l'avis
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
