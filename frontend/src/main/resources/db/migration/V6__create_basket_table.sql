CREATE TABLE IF NOT EXISTS basket_items (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL
);
