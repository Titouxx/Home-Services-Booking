CREATE TABLE services (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          price DECIMAL(5,2) NOT NULL,
                          duration_minutes INT NOT NULL,
                          description VARCHAR(500) NOT NULL
);

INSERT INTO services (name, price, duration_minutes, description) VALUES
                                                         ('House cleaning', 5.99, 60, 'Complete cleaning service: deep cleaning, vacuuming, mopping, dusting and tidying up. Eco-friendly products used. Weekly or one-time packages available.'),
                                                         ('Plumber', 5.99, 60, 'Full plumbing service including leak repairs, sanitary installations and emergency repairs. Our certified plumbers intervene within 24 hours.'),
                                                         ('Electrician', 5.99, 60, 'Electrical installation and renovation compliant with NFC 15-100 standards. Troubleshooting, electrical panel, safety upgrades and home automation.');
