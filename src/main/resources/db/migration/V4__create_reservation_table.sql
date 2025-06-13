CREATE TABLE reservation (
                             id SERIAL PRIMARY KEY,
                             appointment_date TIMESTAMP NOT NULL,
                             service_id BIGINT REFERENCES services(id),
                             custom_name VARCHAR(255),
                             custom_duration INTEGER,
                             custom_price NUMERIC(10, 2)
);