CREATE TABLE subServices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(5,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    description VARCHAR(500),
    service SERIAL NOT NULL,
    CONSTRAINT fk_service_name
        FOREIGN KEY (service)
        REFERENCES services(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

INSERT INTO subServices (name, price, duration_minutes, description, service) VALUES
('Floor washing', 5.99, 60, 'Thorough cleaning and mopping of all floors in the house.', 1),
('Window cleaning', 5.99, 60, 'Interior and exterior window cleaning for a sparkling view.', 1),
('Bathroom cleaning', 5.99, 60, 'Deep cleaning of toilets, sinks, showers, and tiles.', 1);

INSERT INTO subServices (name, price, duration_minutes, description, service) VALUES
('Pipe leak repair', 5.99, 60, 'Fixing leaking or broken water pipes efficiently.', 2),
('Drain unclogging', 5.99, 60, 'Removing clogs and ensuring proper drainage.', 2),
('Water heater installation', 5.99, 60, 'Installing standard water heaters safely and correctly.', 2);

INSERT INTO subServices (name, price, duration_minutes, description, service) VALUES
('Light fixture installation', 5.99, 60, 'Installing or replacing ceiling lights and lamps.', 3),
('Outlet replacement', 5.99, 60, 'Replacing old or broken power outlets.', 3),
('Circuit breaker check', 5.99, 60, 'Inspecting and testing circuit breakers for safety.', 3);
