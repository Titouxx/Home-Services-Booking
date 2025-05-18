-- V6_create_basket_items.sql

CREATE TABLE basket_items (
    id SERIAL PRIMARY KEY,
    user_id INT,
    service_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_service
        FOREIGN KEY (service_id) REFERENCES services(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);
