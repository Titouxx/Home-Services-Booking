ALTER TABLE reservation
    ADD COLUMN custom_name VARCHAR(255),
    ADD COLUMN custom_duration INTEGER,
    ADD COLUMN custom_price NUMERIC(10, 2);
