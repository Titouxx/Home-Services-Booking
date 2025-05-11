-- Create the services table
CREATE TABLE services (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          price DECIMAL(5,2) NOT NULL,
                          duration_minutes INT NOT NULL
);

-- Insert initial services
INSERT INTO services (name, price, duration_minutes) VALUES
                                                         ('House cleaning', 5.99, 60),
                                                         ('Plumber', 5.99, 60),
                                                         ('Electrician', 5.99, 60);
