CREATE TABLE reservation (
                             id SERIAL PRIMARY KEY,
                             appointment_date TIMESTAMP NOT NULL,
                             service_id BIGINT REFERENCES services(id)
);